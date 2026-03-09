import Foundation

enum CaptureMode: Equatable {
    case area
    case window
    case fullscreen
    case scrolling
    case timed(seconds: Int)

    var displayName: String {
        switch self {
        case .area: return "Area"
        case .window: return "Window"
        case .fullscreen: return "Fullscreen"
        case .scrolling: return "Scrolling"
        case .timed(let s): return "Timed (\(s)s)"
        }
    }
}
