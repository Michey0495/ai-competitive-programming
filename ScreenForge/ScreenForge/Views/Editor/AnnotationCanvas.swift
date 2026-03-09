import AppKit

final class AnnotationCanvas: NSView {
    private let image: CGImage
    private let engine: AnnotationEngine
    private var dragStart: CGPoint?
    private var isDragging = false

    init(image: CGImage, engine: AnnotationEngine) {
        self.image = image
        self.engine = engine
        super.init(frame: .zero)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError()
    }

    override var isFlipped: Bool { true }

    override func draw(_ dirtyRect: NSRect) {
        guard let context = NSGraphicsContext.current?.cgContext else { return }

        let imageRect = CGRect(x: 0, y: 0, width: bounds.width, height: bounds.height)
        context.draw(image, in: imageRect)

        for element in engine.elements {
            context.saveGState()
            element.draw(in: context)
            context.restoreGState()
        }

        if let selected = engine.selectedElement {
            context.setStrokeColor(NSColor.systemBlue.cgColor)
            context.setLineDash(phase: 0, lengths: [4, 4])
            context.setLineWidth(1)
            context.stroke(selected.bounds.insetBy(dx: -4, dy: -4))
        }
    }

    override func mouseDown(with event: NSEvent) {
        let point = convert(event.locationInWindow, from: nil)
        dragStart = point

        if let element = engine.elementAt(point: point) {
            engine.selectedElement = element
        } else {
            engine.selectedElement = nil
        }

        needsDisplay = true
    }

    override func mouseDragged(with event: NSEvent) {
        let point = convert(event.locationInWindow, from: nil)
        isDragging = true
        needsDisplay = true
        _ = point // used during mouseUp for element creation
    }

    override func mouseUp(with event: NSEvent) {
        guard let start = dragStart else { return }
        let end = convert(event.locationInWindow, from: nil)

        if isDragging {
            let rect = CGRect(
                x: min(start.x, end.x), y: min(start.y, end.y),
                width: abs(end.x - start.x), height: abs(end.y - start.y)
            )

            guard rect.width > 3 || rect.height > 3 else {
                isDragging = false
                dragStart = nil
                return
            }

            let element: AnnotationElement
            switch engine.currentTool {
            case .arrow:
                element = ArrowToolHandler.createArrow(from: start, to: end, color: engine.currentColor, lineWidth: engine.currentLineWidth)
            case .rectangle:
                element = ShapeToolHandler.createShape(bounds: rect, type: .rectangle, color: engine.currentColor, lineWidth: engine.currentLineWidth)
            case .ellipse:
                element = ShapeToolHandler.createShape(bounds: rect, type: .ellipse, color: engine.currentColor, lineWidth: engine.currentLineWidth)
            case .line:
                element = ShapeToolHandler.createShape(bounds: rect, type: .line, color: engine.currentColor, lineWidth: engine.currentLineWidth)
            case .blur:
                element = BlurToolHandler.createBlur(bounds: rect)
            case .pixelate:
                element = BlurToolHandler.createBlur(bounds: rect, type: .pixelate)
            case .highlight:
                element = HighlightToolHandler.createHighlight(bounds: rect, color: engine.currentColor)
            case .text:
                element = TextToolHandler.createText("Text", at: start, color: engine.currentColor)
            case .numberedStep:
                element = NumberedStepToolHandler.createStep(center: start, number: engine.nextStepNumber(), color: engine.currentColor)
            case .crop:
                isDragging = false
                dragStart = nil
                return
            }

            engine.addElement(element)
        } else {
            // Single click
            if engine.currentTool == .numberedStep {
                let element = NumberedStepToolHandler.createStep(center: start, number: engine.nextStepNumber(), color: engine.currentColor)
                engine.addElement(element)
            }
        }

        isDragging = false
        dragStart = nil
        needsDisplay = true
    }

    override func keyDown(with event: NSEvent) {
        if event.keyCode == 51 || event.keyCode == 117 { // Delete/Backspace
            if let selected = engine.selectedElement {
                engine.removeElement(selected)
                needsDisplay = true
            }
        }
    }

    override var acceptsFirstResponder: Bool { true }
}
