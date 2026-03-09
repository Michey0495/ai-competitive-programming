import AppKit

struct ShapeToolHandler {
    static func createShape(bounds: CGRect, type: ShapeAnnotation.ShapeType, color: NSColor, lineWidth: CGFloat, filled: Bool = false) -> ShapeAnnotation {
        ShapeAnnotation(bounds: bounds, shapeType: type, color: color, lineWidth: lineWidth, filled: filled)
    }
}
