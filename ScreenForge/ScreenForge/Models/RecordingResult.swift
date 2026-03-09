import Foundation

struct RecordingResult {
    let fileURL: URL
    let mode: RecordingMode
    let duration: TimeInterval
    let resolution: CGSize
    let timestamp: Date

    init(fileURL: URL, mode: RecordingMode, duration: TimeInterval, resolution: CGSize) {
        self.fileURL = fileURL
        self.mode = mode
        self.duration = duration
        self.resolution = resolution
        self.timestamp = Date()
    }
}
