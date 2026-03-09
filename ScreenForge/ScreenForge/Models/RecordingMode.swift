import Foundation

enum RecordingMode: String, CaseIterable {
    case mp4
    case gif

    var fileExtension: String { rawValue }

    var displayName: String {
        switch self {
        case .mp4: return "MP4 Video"
        case .gif: return "GIF"
        }
    }
}
