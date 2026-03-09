import AppKit

struct TextToolHandler {
    static func createText(_ text: String, at position: CGPoint, color: NSColor, fontSize: CGFloat = 16) -> TextAnnotation {
        TextAnnotation(text: text, position: position, color: color, fontSize: fontSize)
    }
}
