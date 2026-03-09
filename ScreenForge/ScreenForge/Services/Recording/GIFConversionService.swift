import AVFoundation
import ImageIO
import UniformTypeIdentifiers

final class GIFConversionService {
    static let shared = GIFConversionService()

    func convertToGIF(videoURL: URL, outputURL: URL, fps: Int = AppConstants.Recording.gifFPS, maxWidth: Int = AppConstants.Recording.gifMaxWidth) async throws -> URL {
        let asset = AVAsset(url: videoURL)
        let duration = try await asset.load(.duration)
        let durationSeconds = CMTimeGetSeconds(duration)

        guard let track = try await asset.loadTracks(withMediaType: .video).first else {
            throw NSError(domain: "ScreenForge", code: -1, userInfo: [NSLocalizedDescriptionKey: "No video track found"])
        }

        let naturalSize = try await track.load(.naturalSize)
        let scale = min(1.0, CGFloat(maxWidth) / naturalSize.width)
        let outputSize = CGSize(width: naturalSize.width * scale, height: naturalSize.height * scale)

        let reader = try AVAssetReader(asset: asset)
        let outputSettings: [String: Any] = [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
            kCVPixelBufferWidthKey as String: Int(outputSize.width),
            kCVPixelBufferHeightKey as String: Int(outputSize.height),
        ]
        let readerOutput = AVAssetReaderTrackOutput(track: track, outputSettings: outputSettings)
        reader.add(readerOutput)
        reader.startReading()

        let totalFrames = Int(durationSeconds * Double(fps))
        let frameDuration = 1.0 / Double(fps)

        guard let destination = CGImageDestinationCreateWithURL(
            outputURL as CFURL,
            UTType.gif.identifier as CFString,
            totalFrames,
            nil
        ) else {
            throw NSError(domain: "ScreenForge", code: -2, userInfo: [NSLocalizedDescriptionKey: "Failed to create GIF destination"])
        }

        let gifProperties: [String: Any] = [
            kCGImagePropertyGIFDictionary as String: [
                kCGImagePropertyGIFLoopCount as String: 0
            ]
        ]
        CGImageDestinationSetProperties(destination, gifProperties as CFDictionary)

        let frameProperties: [String: Any] = [
            kCGImagePropertyGIFDictionary as String: [
                kCGImagePropertyGIFDelayTime as String: frameDuration
            ]
        ]

        var frameCount = 0
        let frameInterval = Int(30.0 / Double(fps))

        while let sampleBuffer = readerOutput.copyNextSampleBuffer() {
            frameCount += 1
            guard frameCount % max(1, frameInterval) == 0 else { continue }

            guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { continue }
            CVPixelBufferLockBaseAddress(imageBuffer, .readOnly)
            defer { CVPixelBufferUnlockBaseAddress(imageBuffer, .readOnly) }

            let ciImage = CIImage(cvPixelBuffer: imageBuffer)
            let context = CIContext()
            guard let cgImage = context.createCGImage(ciImage, from: ciImage.extent) else { continue }

            CGImageDestinationAddImage(destination, cgImage, frameProperties as CFDictionary)
        }

        guard CGImageDestinationFinalize(destination) else {
            throw NSError(domain: "ScreenForge", code: -3, userInfo: [NSLocalizedDescriptionKey: "Failed to finalize GIF"])
        }

        return outputURL
    }
}
