import SwiftUI

@MainActor
final class RecordingViewModel: ObservableObject {
    @Published var isRecording = false
    @Published var recordingDuration: TimeInterval = 0
    @Published var lastResult: RecordingResult?
    @Published var errorMessage: String?
    @Published var includeWebcam = false
    @Published var includeSystemAudio = true
    @Published var includeMicrophone = false
    @Published var showMouseClicks = true
    @Published var showKeystrokes = false

    private var timer: Timer?

    func startTimer() {
        recordingDuration = 0
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            Task { @MainActor in
                self?.recordingDuration += 1
            }
        }
    }

    func stopTimer() {
        timer?.invalidate()
        timer = nil
    }

    var formattedDuration: String {
        let minutes = Int(recordingDuration) / 60
        let seconds = Int(recordingDuration) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}
