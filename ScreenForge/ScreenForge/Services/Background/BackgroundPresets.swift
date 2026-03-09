import Foundation

extension BackgroundPreset {
    static func preset(named id: String) -> BackgroundPreset? {
        presets.first { $0.id == id }
    }
}
