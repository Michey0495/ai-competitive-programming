import AppKit

protocol AnnotationElement: AnyObject {
    var id: UUID { get }
    var bounds: CGRect { get set }
    var color: NSColor { get set }
    var lineWidth: CGFloat { get set }
    func draw(in context: CGContext)
    func hitTest(point: CGPoint) -> Bool
}

class ArrowAnnotation: AnnotationElement {
    let id = UUID()
    var bounds: CGRect
    var color: NSColor
    var lineWidth: CGFloat
    var startPoint: CGPoint
    var endPoint: CGPoint

    init(start: CGPoint, end: CGPoint, color: NSColor = .systemRed, lineWidth: CGFloat = 3) {
        self.startPoint = start
        self.endPoint = end
        self.color = color
        self.lineWidth = lineWidth
        self.bounds = CGRect(
            x: min(start.x, end.x), y: min(start.y, end.y),
            width: abs(end.x - start.x), height: abs(end.y - start.y)
        )
    }

    func draw(in context: CGContext) {
        context.setStrokeColor(color.cgColor)
        context.setLineWidth(lineWidth)
        context.setLineCap(.round)
        context.move(to: startPoint)
        context.addLine(to: endPoint)
        context.strokePath()

        let angle = atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x)
        let arrowLength: CGFloat = 15
        let arrowAngle: CGFloat = .pi / 6
        let p1 = CGPoint(
            x: endPoint.x - arrowLength * cos(angle - arrowAngle),
            y: endPoint.y - arrowLength * sin(angle - arrowAngle)
        )
        let p2 = CGPoint(
            x: endPoint.x - arrowLength * cos(angle + arrowAngle),
            y: endPoint.y - arrowLength * sin(angle + arrowAngle)
        )
        context.setFillColor(color.cgColor)
        context.move(to: endPoint)
        context.addLine(to: p1)
        context.addLine(to: p2)
        context.closePath()
        context.fillPath()
    }

    func hitTest(point: CGPoint) -> Bool {
        let expandedBounds = bounds.insetBy(dx: -10, dy: -10)
        return expandedBounds.contains(point)
    }
}

class ShapeAnnotation: AnnotationElement {
    enum ShapeType { case rectangle, ellipse, line }

    let id = UUID()
    var bounds: CGRect
    var color: NSColor
    var lineWidth: CGFloat
    var shapeType: ShapeType
    var filled: Bool

    init(bounds: CGRect, shapeType: ShapeType, color: NSColor = .systemRed, lineWidth: CGFloat = 2, filled: Bool = false) {
        self.bounds = bounds
        self.shapeType = shapeType
        self.color = color
        self.lineWidth = lineWidth
        self.filled = filled
    }

    func draw(in context: CGContext) {
        context.setStrokeColor(color.cgColor)
        context.setLineWidth(lineWidth)

        switch shapeType {
        case .rectangle:
            if filled {
                context.setFillColor(color.withAlphaComponent(0.3).cgColor)
                context.fill(bounds)
            }
            context.stroke(bounds)
        case .ellipse:
            if filled {
                context.setFillColor(color.withAlphaComponent(0.3).cgColor)
                context.fillEllipse(in: bounds)
            }
            context.strokeEllipse(in: bounds)
        case .line:
            context.move(to: CGPoint(x: bounds.minX, y: bounds.minY))
            context.addLine(to: CGPoint(x: bounds.maxX, y: bounds.maxY))
            context.strokePath()
        }
    }

    func hitTest(point: CGPoint) -> Bool {
        bounds.insetBy(dx: -5, dy: -5).contains(point)
    }
}

class TextAnnotation: AnnotationElement {
    let id = UUID()
    var bounds: CGRect
    var color: NSColor
    var lineWidth: CGFloat
    var text: String
    var fontSize: CGFloat
    var fontName: String

    init(text: String, position: CGPoint, color: NSColor = .systemRed, fontSize: CGFloat = 16, fontName: String = "Helvetica-Bold") {
        self.text = text
        self.color = color
        self.fontSize = fontSize
        self.fontName = fontName
        self.lineWidth = 0
        let font = NSFont(name: fontName, size: fontSize) ?? .systemFont(ofSize: fontSize, weight: .bold)
        let attrs: [NSAttributedString.Key: Any] = [.font: font]
        let size = (text as NSString).size(withAttributes: attrs)
        self.bounds = CGRect(origin: position, size: size)
    }

    func draw(in context: CGContext) {
        let font = NSFont(name: fontName, size: fontSize) ?? .systemFont(ofSize: fontSize, weight: .bold)
        let attrs: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: color
        ]
        let nsString = text as NSString
        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: false)
        nsString.draw(at: bounds.origin, withAttributes: attrs)
        NSGraphicsContext.restoreGraphicsState()
    }

    func hitTest(point: CGPoint) -> Bool {
        bounds.contains(point)
    }
}

class BlurAnnotation: AnnotationElement {
    enum BlurType { case gaussian, pixelate }

    let id = UUID()
    var bounds: CGRect
    var color: NSColor
    var lineWidth: CGFloat
    var blurType: BlurType
    var intensity: CGFloat

    init(bounds: CGRect, blurType: BlurType = .gaussian, intensity: CGFloat = 10) {
        self.bounds = bounds
        self.blurType = blurType
        self.color = .clear
        self.lineWidth = 0
        self.intensity = intensity
    }

    func draw(in context: CGContext) {
        context.saveGState()
        context.clip(to: bounds)
        context.setFillColor(NSColor.black.withAlphaComponent(0.3).cgColor)
        context.fill(bounds)
        context.restoreGState()

        context.setStrokeColor(NSColor.systemGray.withAlphaComponent(0.5).cgColor)
        context.setLineDash(phase: 0, lengths: [4, 4])
        context.setLineWidth(1)
        context.stroke(bounds)
    }

    func hitTest(point: CGPoint) -> Bool {
        bounds.contains(point)
    }
}

class HighlightAnnotation: AnnotationElement {
    let id = UUID()
    var bounds: CGRect
    var color: NSColor
    var lineWidth: CGFloat

    init(bounds: CGRect, color: NSColor = .systemYellow) {
        self.bounds = bounds
        self.color = color
        self.lineWidth = 0
    }

    func draw(in context: CGContext) {
        context.setFillColor(color.withAlphaComponent(0.35).cgColor)
        context.fill(bounds)
    }

    func hitTest(point: CGPoint) -> Bool {
        bounds.contains(point)
    }
}

class NumberedStepAnnotation: AnnotationElement {
    let id = UUID()
    var bounds: CGRect
    var color: NSColor
    var lineWidth: CGFloat
    var number: Int

    init(center: CGPoint, number: Int, color: NSColor = .systemRed) {
        self.number = number
        self.color = color
        self.lineWidth = 0
        let size: CGFloat = 32
        self.bounds = CGRect(x: center.x - size / 2, y: center.y - size / 2, width: size, height: size)
    }

    func draw(in context: CGContext) {
        context.setFillColor(color.cgColor)
        context.fillEllipse(in: bounds)

        let font = NSFont.systemFont(ofSize: 16, weight: .bold)
        let attrs: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: NSColor.white
        ]
        let text = "\(number)" as NSString
        let textSize = text.size(withAttributes: attrs)
        let textOrigin = CGPoint(
            x: bounds.midX - textSize.width / 2,
            y: bounds.midY - textSize.height / 2
        )
        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: false)
        text.draw(at: textOrigin, withAttributes: attrs)
        NSGraphicsContext.restoreGraphicsState()
    }

    func hitTest(point: CGPoint) -> Bool {
        let dx = point.x - bounds.midX
        let dy = point.y - bounds.midY
        let radius = bounds.width / 2
        return dx * dx + dy * dy <= radius * radius
    }
}
