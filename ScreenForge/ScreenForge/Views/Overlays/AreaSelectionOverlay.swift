import AppKit

final class AreaSelectionOverlay: NSWindow {
    private var selectionView: AreaSelectionView!
    var onSelectionComplete: ((CGRect) -> Void)?
    var onCancel: (() -> Void)?

    init() {
        let screen = NSScreen.main ?? NSScreen.screens.first!
        super.init(
            contentRect: screen.frame,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )

        level = .screenSaver
        isOpaque = false
        backgroundColor = .clear
        hasShadow = false
        ignoresMouseEvents = false
        collectionBehavior = [.canJoinAllSpaces, .fullScreenPrimary]
        isReleasedWhenClosed = false

        selectionView = AreaSelectionView(frame: screen.frame)
        selectionView.onSelectionComplete = { [weak self] rect in
            self?.orderOut(nil)
            self?.onSelectionComplete?(rect)
        }
        selectionView.onCancel = { [weak self] in
            self?.orderOut(nil)
            self?.onCancel?()
        }

        contentView = selectionView
    }

    func show() {
        if let screen = NSScreen.main {
            setFrame(screen.frame, display: true)
            selectionView.frame = NSRect(origin: .zero, size: screen.frame.size)
        }
        makeKeyAndOrderFront(nil)
        selectionView.resetSelection()
    }
}

final class AreaSelectionView: NSView {
    var onSelectionComplete: ((CGRect) -> Void)?
    var onCancel: (() -> Void)?

    private var startPoint: CGPoint?
    private var currentPoint: CGPoint?
    private var isDragging = false
    private var crosshairPosition: CGPoint?

    override var acceptsFirstResponder: Bool { true }

    override func resetCursorRects() {
        addCursorRect(bounds, cursor: .crosshair)
    }

    func resetSelection() {
        startPoint = nil
        currentPoint = nil
        isDragging = false
        crosshairPosition = nil
        needsDisplay = true
        window?.makeFirstResponder(self)
    }

    override func draw(_ dirtyRect: NSRect) {
        NSColor.black.withAlphaComponent(0.3).setFill()
        dirtyRect.fill()

        if let start = startPoint, let current = currentPoint, isDragging {
            let selectionRect = NSRect(
                x: min(start.x, current.x),
                y: min(start.y, current.y),
                width: abs(current.x - start.x),
                height: abs(current.y - start.y)
            )

            // Clear the selection area
            NSColor.clear.setFill()
            selectionRect.fill(using: .copy)

            // Draw selection border
            NSColor.white.setStroke()
            let borderPath = NSBezierPath(rect: selectionRect)
            borderPath.lineWidth = AppConstants.UI.selectionBorderWidth
            borderPath.stroke()

            // Draw dashed inner border
            NSColor.systemBlue.withAlphaComponent(0.8).setStroke()
            let dashedPath = NSBezierPath(rect: selectionRect.insetBy(dx: 1, dy: 1))
            dashedPath.lineWidth = 1
            dashedPath.setLineDash([4, 4], count: 2, phase: 0)
            dashedPath.stroke()

            // Draw size label
            let sizeText = "\(Int(selectionRect.width)) × \(Int(selectionRect.height))"
            let attrs: [NSAttributedString.Key: Any] = [
                .font: NSFont.monospacedSystemFont(ofSize: 12, weight: .medium),
                .foregroundColor: NSColor.white,
                .backgroundColor: NSColor.black.withAlphaComponent(0.7),
            ]
            let textSize = (sizeText as NSString).size(withAttributes: attrs)
            let textOrigin = CGPoint(
                x: selectionRect.midX - textSize.width / 2,
                y: selectionRect.minY - textSize.height - 8
            )
            (sizeText as NSString).draw(at: textOrigin, withAttributes: attrs)
        }

        if let pos = crosshairPosition, !isDragging {
            drawCrosshair(at: pos)
        }
    }

    private func drawCrosshair(at point: CGPoint) {
        NSColor.white.withAlphaComponent(0.8).setStroke()
        let path = NSBezierPath()
        path.lineWidth = 0.5

        // Horizontal line
        path.move(to: CGPoint(x: 0, y: point.y))
        path.line(to: CGPoint(x: bounds.width, y: point.y))

        // Vertical line
        path.move(to: CGPoint(x: point.x, y: 0))
        path.line(to: CGPoint(x: point.x, y: bounds.height))

        path.stroke()
    }

    override func mouseMoved(with event: NSEvent) {
        crosshairPosition = convert(event.locationInWindow, from: nil)
        needsDisplay = true
    }

    override func mouseDown(with event: NSEvent) {
        startPoint = convert(event.locationInWindow, from: nil)
        isDragging = true
    }

    override func mouseDragged(with event: NSEvent) {
        currentPoint = convert(event.locationInWindow, from: nil)
        needsDisplay = true
    }

    override func mouseUp(with event: NSEvent) {
        guard let start = startPoint else { return }
        let end = convert(event.locationInWindow, from: nil)

        isDragging = false

        let rect = CGRect(
            x: min(start.x, end.x),
            y: min(start.y, end.y),
            width: abs(end.x - start.x),
            height: abs(end.y - start.y)
        )

        guard rect.width > 5 && rect.height > 5 else {
            resetSelection()
            return
        }

        // Convert to screen coordinates (flip Y)
        if let screen = NSScreen.main {
            let screenRect = CGRect(
                x: rect.origin.x,
                y: screen.frame.height - rect.maxY,
                width: rect.width,
                height: rect.height
            )
            onSelectionComplete?(screenRect)
        }
    }

    override func keyDown(with event: NSEvent) {
        if event.keyCode == 53 { // Escape
            onCancel?()
        }
    }

    override func updateTrackingAreas() {
        super.updateTrackingAreas()
        for area in trackingAreas {
            removeTrackingArea(area)
        }
        addTrackingArea(NSTrackingArea(
            rect: bounds,
            options: [.activeAlways, .mouseMoved, .mouseEnteredAndExited],
            owner: self,
            userInfo: nil
        ))
    }
}
