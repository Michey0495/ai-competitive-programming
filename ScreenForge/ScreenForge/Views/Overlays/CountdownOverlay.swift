import AppKit

final class CountdownOverlay: NSWindow {
    private var countdownLabel: NSTextField!
    var onCountdownComplete: (() -> Void)?

    init() {
        super.init(
            contentRect: NSRect(x: 0, y: 0, width: 120, height: 120),
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )

        level = .floating
        isOpaque = false
        backgroundColor = .clear
        hasShadow = true
        isReleasedWhenClosed = false

        let container = NSView(frame: NSRect(x: 0, y: 0, width: 120, height: 120))
        container.wantsLayer = true
        container.layer?.backgroundColor = NSColor.black.withAlphaComponent(0.7).cgColor
        container.layer?.cornerRadius = 24

        countdownLabel = NSTextField(labelWithString: "")
        countdownLabel.font = .systemFont(ofSize: 56, weight: .bold)
        countdownLabel.textColor = .white
        countdownLabel.alignment = .center
        countdownLabel.frame = NSRect(x: 0, y: 25, width: 120, height: 70)
        container.addSubview(countdownLabel)

        contentView = container
    }

    func start(seconds: Int) {
        guard let screen = NSScreen.main else { return }
        let x = screen.frame.midX - 60
        let y = screen.frame.midY - 60
        setFrameOrigin(NSPoint(x: x, y: y))
        makeKeyAndOrderFront(nil)

        Task { @MainActor in
            for i in stride(from: seconds, through: 1, by: -1) {
                countdownLabel.stringValue = "\(i)"
                animatePulse()
                try? await Task.sleep(nanoseconds: 1_000_000_000)
            }
            orderOut(nil)
            onCountdownComplete?()
        }
    }

    private func animatePulse() {
        guard let layer = contentView?.layer else { return }
        let animation = CAKeyframeAnimation(keyPath: "transform.scale")
        animation.values = [1.0, 1.1, 1.0]
        animation.duration = 0.3
        layer.add(animation, forKey: "pulse")
    }
}
