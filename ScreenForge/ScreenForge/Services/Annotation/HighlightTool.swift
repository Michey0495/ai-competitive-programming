import AppKit

struct HighlightToolHandler {
    static func createHighlight(bounds: CGRect, color: NSColor = .systemYellow) -> HighlightAnnotation {
        HighlightAnnotation(bounds: bounds, color: color)
    }
}
