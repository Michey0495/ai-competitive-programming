import AppKit
import ScreenCaptureKit

final class WindowSelectionOverlay: NSWindow {
    private var selectionView: WindowSelectionView!
    var onWindowSelected: ((SCWindow) -> Void)?
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

        selectionView = WindowSelectionView(frame: NSRect(origin: .zero, size: screen.frame.size))
        selectionView.onWindowSelected = { [weak self] window in
            self?.orderOut(nil)
            self?.onWindowSelected?(window)
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
        selectionView.loadWindows()
    }
}

final class WindowSelectionView: NSView {
    var onWindowSelected: ((SCWindow) -> Void)?
    var onCancel: (() -> Void)?

    private var windows: [SCWindow] = []
    private var highlightedWindow: SCWindow?

    override var acceptsFirstResponder: Bool { true }

    func loadWindows() {
        Task { @MainActor in
            do {
                windows = try await WindowListService.shared.getWindows()
            } catch {
                windows = []
            }
            window?.makeFirstResponder(self)
        }
    }

    override func draw(_ dirtyRect: NSRect) {
        NSColor.black.withAlphaComponent(0.2).setFill()
        dirtyRect.fill()

        if let highlighted = highlightedWindow, let screen = NSScreen.main {
            let frame = highlighted.frame
            let viewRect = CGRect(
                x: frame.origin.x,
                y: screen.frame.height - frame.maxY,
                width: frame.width,
                height: frame.height
            )

            // Highlight overlay
            NSColor.systemBlue.withAlphaComponent(0.15).setFill()
            viewRect.fill()

            // Border
            NSColor.systemBlue.setStroke()
            let path = NSBezierPath(roundedRect: viewRect, xRadius: 8, yRadius: 8)
            path.lineWidth = 3
            path.stroke()

            // Window title label
            if let title = highlighted.title, !title.isEmpty {
                let attrs: [NSAttributedString.Key: Any] = [
                    .font: NSFont.systemFont(ofSize: 13, weight: .medium),
                    .foregroundColor: NSColor.white,
                    .backgroundColor: NSColor.systemBlue.withAlphaComponent(0.8),
                ]
                let textPoint = CGPoint(x: viewRect.minX + 8, y: viewRect.maxY + 4)
                (title as NSString).draw(at: textPoint, withAttributes: attrs)
            }
        }
    }

    override func mouseMoved(with event: NSEvent) {
        let viewPoint = convert(event.locationInWindow, from: nil)
        guard let screen = NSScreen.main else { return }

        let screenPoint = CGPoint(x: viewPoint.x, y: screen.frame.height - viewPoint.y)
        highlightedWindow = windows.first { $0.frame.contains(screenPoint) }
        needsDisplay = true
    }

    override func mouseDown(with event: NSEvent) {
        if let window = highlightedWindow {
            onWindowSelected?(window)
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
            options: [.activeAlways, .mouseMoved],
            owner: self,
            userInfo: nil
        ))
    }
}
