import AVFoundation
import ScreenCaptureKit

@MainActor
final class ScreenRecordingService: NSObject, SCStreamDelegate, SCStreamOutput {
    private var stream: SCStream?
    private var assetWriter: AVAssetWriter?
    private var videoInput: AVAssetWriterInput?
    private var audioInput: AVAssetWriterInput?
    private var isSessionStarted = false
    private(set) var isRecording = false
    private var outputURL: URL?
    private var startTime: Date?
    private var recordingSize: CGSize = .zero

    var onRecordingFinished: ((RecordingResult) -> Void)?

    func startRecording(region: CGRect? = nil, displayID: CGDirectDisplayID? = nil, includeAudio: Bool = true) async throws {
        let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: true)
        let display = if let displayID {
            content.displays.first { $0.displayID == displayID } ?? content.displays.first!
        } else {
            content.displays.first!
        }

        let filter = SCContentFilter(display: display, excludingWindows: [])
        let config = SCStreamConfiguration()

        if let region {
            config.sourceRect = region
            config.width = Int(region.width * 2)
            config.height = Int(region.height * 2)
            recordingSize = region.size
        } else {
            config.width = display.width * 2
            config.height = display.height * 2
            recordingSize = CGSize(width: display.width, height: display.height)
        }

        config.scaleFactor = 2
        config.captureResolution = .best
        config.minimumFrameInterval = CMTime(value: 1, timescale: CMTimeScale(AppConstants.Recording.defaultFPS))
        config.showsCursor = true
        config.capturesAudio = includeAudio
        config.sampleRate = 48000
        config.channelCount = 2

        let fileName = "ScreenForge_\(Self.dateFormatter.string(from: Date())).mp4"
        let url = FileOutputService.shared.outputDirectory.appendingPathComponent(fileName)
        outputURL = url

        let writer = try AVAssetWriter(outputURL: url, fileType: .mp4)
        let videoSettings: [String: Any] = [
            AVVideoCodecKey: AVVideoCodecType.hevc,
            AVVideoWidthKey: config.width,
            AVVideoHeightKey: config.height,
            AVVideoCompressionPropertiesKey: [
                AVVideoAverageBitRateKey: AppConstants.Recording.defaultBitrate,
                AVVideoProfileLevelKey: kVTProfileLevel_HEVC_Main_AutoLevel,
            ]
        ]
        let vInput = AVAssetWriterInput(mediaType: .video, outputSettings: videoSettings)
        vInput.expectsMediaDataInRealTime = true
        writer.add(vInput)
        videoInput = vInput

        if includeAudio {
            let audioSettings: [String: Any] = [
                AVFormatIDKey: kAudioFormatMPEG4AAC,
                AVSampleRateKey: 48000,
                AVNumberOfChannelsKey: 2,
                AVEncoderBitRateKey: 128000,
            ]
            let aInput = AVAssetWriterInput(mediaType: .audio, outputSettings: audioSettings)
            aInput.expectsMediaDataInRealTime = true
            writer.add(aInput)
            audioInput = aInput
        }

        assetWriter = writer
        writer.startWriting()

        stream = SCStream(filter: filter, configuration: config, delegate: self)

        try stream?.addStreamOutput(self, type: .screen, sampleBufferQueueDepth: 8)
        if includeAudio {
            try stream?.addStreamOutput(self, type: .audio, sampleBufferQueueDepth: 8)
        }

        try await stream?.startCapture()
        startTime = Date()
        isRecording = true
        isSessionStarted = false
    }

    func stopRecording() {
        guard isRecording else { return }
        isRecording = false

        Task {
            try? await stream?.stopCapture()
            stream = nil

            videoInput?.markAsFinished()
            audioInput?.markAsFinished()

            await assetWriter?.finishWriting()

            if let url = outputURL, let start = startTime {
                let duration = Date().timeIntervalSince(start)
                let result = RecordingResult(fileURL: url, mode: .mp4, duration: duration, resolution: recordingSize)
                onRecordingFinished?(result)
            }

            assetWriter = nil
            videoInput = nil
            audioInput = nil
        }
    }

    nonisolated func stream(_ stream: SCStream, didOutputSampleBuffer sampleBuffer: CMSampleBuffer, of type: SCStreamOutputType) {
        guard sampleBuffer.isValid else { return }

        Task { @MainActor in
            guard isRecording, let writer = assetWriter, writer.status == .writing else { return }

            if !isSessionStarted {
                let pts = CMSampleBufferGetPresentationTimeStamp(sampleBuffer)
                writer.startSession(atSourceTime: pts)
                isSessionStarted = true
            }

            switch type {
            case .screen:
                if let input = videoInput, input.isReadyForMoreMediaData {
                    input.append(sampleBuffer)
                }
            case .audio:
                if let input = audioInput, input.isReadyForMoreMediaData {
                    input.append(sampleBuffer)
                }
            @unknown default:
                break
            }
        }
    }

    nonisolated func stream(_ stream: SCStream, didStopWithError error: Error) {
        Task { @MainActor in
            if isRecording {
                stopRecording()
            }
        }
    }

    private static let dateFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd_HH-mm-ss"
        return f
    }()
}
