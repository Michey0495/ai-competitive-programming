import AppKit
import SwiftUI

@MainActor
final class RecordingCoordinator {
    private let historyManager: HistoryManager
    private let recordingService = ScreenRecordingService()
    private let webcamService = WebcamService()
    private let gifConversionService = GIFConversionService.shared
    private var recordingIndicator: RecordingIndicator?
    private var regionOverlay: RecordingRegionOverlay?
    private var currentMode: RecordingMode = .mp4

    var isRecording: Bool { recordingService.isRecording }

    init(historyManager: HistoryManager) {
        self.historyManager = historyManager
    }

    func startRecording(mode: RecordingMode, region: CGRect? = nil) {
        currentMode = mode

        if region == nil {
            // Show region selection overlay
            let overlay = RecordingRegionOverlay()
            overlay.onRegionSelected = { [weak self] rect in
                guard let self else { return }
                self.regionOverlay = nil
                self.beginRecording(mode: mode, region: rect)
            }
            overlay.onCancel = { [weak self] in
                self?.regionOverlay = nil
            }
            regionOverlay = overlay
            overlay.show()
        } else {
            beginRecording(mode: mode, region: region)
        }
    }

    private func beginRecording(mode: RecordingMode, region: CGRect?) {
        let includeWebcam = UserDefaults.standard.bool(forKey: AppConstants.UserDefaultsKeys.includeWebcam)

        recordingService.onRecordingFinished = { [weak self] result in
            guard let self else { return }
            Task { @MainActor in
                self.handleRecordingFinished(result)
            }
        }

        Task {
            do {
                try await recordingService.startRecording(region: region, includeAudio: true)

                if includeWebcam {
                    webcamService.start()
                }

                let indicator = RecordingIndicator()
                indicator.onStop = { [weak self] in
                    self?.stopRecording()
                }
                recordingIndicator = indicator
                indicator.show()
            } catch {
                showError(error)
            }
        }
    }

    func stopRecording() {
        recordingService.stopRecording()
        webcamService.stop()
        recordingIndicator?.hide()
        recordingIndicator = nil
    }

    private func handleRecordingFinished(_ result: RecordingResult) {
        if currentMode == .gif {
            convertToGIF(result: result)
        } else {
            let item = HistoryItem(
                fileURL: result.fileURL,
                type: .recording,
                pixelSize: result.resolution,
                duration: result.duration
            )
            historyManager.add(item)
            ClipboardService.shared.copyFileURL(result.fileURL)
            showNotification(title: "Recording Saved", body: "\(String(format: "%.1f", result.duration))s")
        }
    }

    private func convertToGIF(result: RecordingResult) {
        Task {
            let gifURL = result.fileURL.deletingPathExtension().appendingPathExtension("gif")
            do {
                let url = try await gifConversionService.convertToGIF(videoURL: result.fileURL, outputURL: gifURL)
                let item = HistoryItem(fileURL: url, type: .gif, duration: result.duration)
                historyManager.add(item)
                ClipboardService.shared.copyFileURL(url)
                showNotification(title: "GIF Saved", body: "\(String(format: "%.1f", result.duration))s")

                // Clean up temporary MP4
                try? FileManager.default.removeItem(at: result.fileURL)
            } catch {
                showError(error)
            }
        }
    }

    private func showError(_ error: Error) {
        let alert = NSAlert()
        alert.messageText = "Recording Error"
        alert.informativeText = error.localizedDescription
        alert.alertStyle = .warning
        alert.runModal()
    }

    private func showNotification(title: String, body: String) {
        let notification = NSUserNotification()
        notification.title = title
        notification.informativeText = body
        NSUserNotificationCenter.default.deliver(notification)
    }
}
