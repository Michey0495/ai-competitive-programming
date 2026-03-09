import AppKit

final class RecordingIndicator: NSWindow {
    private var durationLabel: NSTextField!
    private var timer: Timer?
    private var startTime: Date?

    init() {
        super.init(
            contentRect: NSRect(x: 0, y: 0, width: 140, height: 36),
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )

        level = .floating
        isOpaque = false
        backgroundColor = .clear
        hasShadow = true
        isMovableByWindowBackground = true
        isReleasedWhenClosed = false
        collectionBehavior = [.canJoinAllSpaces]

        let container = NSView(frame: NSRect(x: 0, y: 0, width: 140, height: 36))
        container.wantsLayer = true
        container.layer?.backgroundColor = NSColor.black.withAlphaComponent(0.8).cgColor
        container.layer?.cornerRadius = 18

        let dot = NSView(frame: NSRect(x: 12, y: 12, width: 12, height: 12))
        dot.wantsLayer = true
        dot.layer?.backgroundColor = NSColor.systemRed.cgColor
        dot.layer?.cornerRadius = 6
        container.addSubview(dot)

        // Pulse animation for dot
        let pulse = CABasicAnimation(keyPath: "opacity")
        pulse.fromValue = 1.0
        pulse.toValue = 0.3
        pulse.duration = 1.0
        pulse.autoreverses = true
        pulse.repeatCount = .infinity
        dot.layer?.add(pulse, forKey: "pulse")

        durationLabel = NSTextField(labelWithString: "00:00")
        durationLabel.font = .monospacedSystemFont(ofSize: 14, weight: .medium)
        durationLabel.textColor = .white
        durationLabel.frame = NSRect(x: 32, y: 7, width: 70, height: 22)
        container.addSubview(durationLabel)

        let stopButton = NSButton(frame: NSRect(x: 104, y: 6, width: 28, height: 24))
        stopButton.bezelStyle = .inline
        stopButton.image = NSImage(systemSymbolName: "stop.fill", accessibilityDescription: "Stop")
        stopButton.contentTintColor = .white
        stopButton.isBordered = false
        stopButton.target = self
        stopButton.action = #selector(stopClicked)
        container.addSubview(stopButton)

        contentView = container
    }

    var onStop: (() -> Void)?

    func show() {
        guard let screen = NSScreen.main else { return }
        let x = screen.frame.midX - 70
        let y = screen.frame.maxY - 60
        setFrameOrigin(NSPoint(x: x, y: y))
        makeKeyAndOrderFront(nil)
        startTime = Date()
        startTimer()
    }

    func hide() {
        stopTimer()
        orderOut(nil)
    }

    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            guard let self, let start = self.startTime else { return }
            let elapsed = Date().timeIntervalSince(start)
            let minutes = Int(elapsed) / 60
            let seconds = Int(elapsed) % 60
            self.durationLabel.stringValue = String(format: "%02d:%02d", minutes, seconds)
        }
    }

    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }

    @objc private func stopClicked() {
        onStop?()
    }
}
