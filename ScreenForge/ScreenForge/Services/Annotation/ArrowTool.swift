import AppKit

struct ArrowToolHandler {
    static func createArrow(from start: CGPoint, to end: CGPoint, color: NSColor, lineWidth: CGFloat) -> ArrowAnnotation {
        ArrowAnnotation(start: start, end: end, color: color, lineWidth: lineWidth)
    }
}
