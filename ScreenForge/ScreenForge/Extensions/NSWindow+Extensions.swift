import AppKit

extension NSWindow {
    static func createTransparentOverlay(for screen: NSScreen? = nil) -> NSWindow {
        let targetScreen = screen ?? NSScreen.main ?? NSScreen.screens.first!
        let window = NSWindow(
            contentRect: targetScreen.frame,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )
        window.level = .screenSaver
        window.isOpaque = false
        window.backgroundColor = .clear
        window.hasShadow = false
        window.ignoresMouseEvents = false
        window.collectionBehavior = [.canJoinAllSpaces, .fullScreenPrimary]
        return window
    }

    static func createFloatingPanel(contentRect: NSRect, title: String = "") -> NSPanel {
        let panel = NSPanel(
            contentRect: contentRect,
            styleMask: [.titled, .closable, .resizable, .utilityWindow, .hudWindow],
            backing: .buffered,
            defer: false
        )
        panel.level = .floating
        panel.title = title
        panel.isFloatingPanel = true
        return panel
    }
}
