import AppKit

final class PinWindow: NSWindow {
    init(image: NSImage) {
        let size = NSSize(
            width: min(image.size.width, 600),
            height: min(image.size.height, 400)
        )
        super.init(
            contentRect: NSRect(origin: .zero, size: size),
            styleMask: [.titled, .closable, .resizable, .miniaturizable],
            backing: .buffered,
            defer: false
        )

        level = .floating
        title = "Pinned Screenshot"
        isReleasedWhenClosed = false
        isMovableByWindowBackground = true
        titlebarAppearsTransparent = true
        titleVisibility = .hidden
        collectionBehavior = [.canJoinAllSpaces]

        let imageView = NSImageView(frame: NSRect(origin: .zero, size: size))
        imageView.image = image
        imageView.imageScaling = .scaleProportionallyUpOrDown
        imageView.autoresizingMask = [.width, .height]

        contentView = imageView
        center()
    }
}
