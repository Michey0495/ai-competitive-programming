import AppKit

struct BackgroundPreset: Identifiable {
    let id: String
    let name: String
    let type: BackgroundType
    let padding: CGFloat
    let cornerRadius: CGFloat

    enum BackgroundType {
        case gradient(colors: [NSColor], angle: CGFloat)
        case solid(color: NSColor)
        case image(name: String)
        case transparent
    }

    static let presets: [BackgroundPreset] = [
        BackgroundPreset(id: "none", name: "None", type: .transparent, padding: 0, cornerRadius: 0),
        BackgroundPreset(id: "ocean", name: "Ocean", type: .gradient(colors: [.systemBlue, .systemTeal], angle: 45), padding: 64, cornerRadius: 12),
        BackgroundPreset(id: "sunset", name: "Sunset", type: .gradient(colors: [.systemOrange, .systemPink], angle: 135), padding: 64, cornerRadius: 12),
        BackgroundPreset(id: "forest", name: "Forest", type: .gradient(colors: [.systemGreen, .systemTeal], angle: 90), padding: 64, cornerRadius: 12),
        BackgroundPreset(id: "purple_haze", name: "Purple Haze", type: .gradient(colors: [.systemPurple, .systemPink], angle: 45), padding: 64, cornerRadius: 12),
        BackgroundPreset(id: "midnight", name: "Midnight", type: .gradient(colors: [.black, .systemIndigo], angle: 180), padding: 64, cornerRadius: 12),
        BackgroundPreset(id: "aurora", name: "Aurora", type: .gradient(colors: [.systemGreen, .systemCyan, .systemBlue], angle: 120), padding: 64, cornerRadius: 12),
        BackgroundPreset(id: "lava", name: "Lava", type: .gradient(colors: [.systemRed, .systemOrange, .systemYellow], angle: 45), padding: 64, cornerRadius: 12),
        BackgroundPreset(id: "slate", name: "Slate", type: .solid(color: NSColor(white: 0.15, alpha: 1)), padding: 64, cornerRadius: 12),
        BackgroundPreset(id: "snow", name: "Snow", type: .solid(color: NSColor(white: 0.95, alpha: 1)), padding: 64, cornerRadius: 12),
        BackgroundPreset(id: "candy", name: "Candy", type: .gradient(colors: [.systemPink, .magenta, .systemPurple], angle: 60), padding: 64, cornerRadius: 12),
        BackgroundPreset(id: "steel", name: "Steel", type: .gradient(colors: [.systemGray, .darkGray, .lightGray], angle: 90), padding: 64, cornerRadius: 12),
    ]
}
