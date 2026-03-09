import AppKit

final class RecordingRegionOverlay: NSWindow {
    private var selectionView: AreaSelectionView!
    var onRegionSelected: ((CGRect) -> Void)?
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
        collectionBehavior = [.canJoinAllSpaces]
        isReleasedWhenClosed = false

        selectionView = AreaSelectionView(frame: NSRect(origin: .zero, size: screen.frame.size))
        selectionView.onSelectionComplete = { [weak self] rect in
            self?.orderOut(nil)
            self?.onRegionSelected?(rect)
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
        }
        makeKeyAndOrderFront(nil)
        selectionView.resetSelection()
    }
}
