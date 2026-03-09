import AVFoundation
import AppKit

@MainActor
final class WebcamService: NSObject {
    private var captureSession: AVCaptureSession?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    private(set) var webcamWindow: NSWindow?
    private(set) var isActive = false

    func start(size: CGFloat = AppConstants.Recording.webcamSize) {
        guard !isActive else { return }

        let session = AVCaptureSession()
        session.sessionPreset = .medium

        guard let camera = AVCaptureDevice.default(for: .video),
              let input = try? AVCaptureDeviceInput(device: camera) else { return }

        session.addInput(input)

        let layer = AVCaptureVideoPreviewLayer(session: session)
        layer.videoGravity = .resizeAspectFill
        layer.cornerRadius = size / 2
        layer.masksToBounds = true

        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: size, height: size),
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )
        window.level = .floating
        window.isOpaque = false
        window.backgroundColor = .clear
        window.hasShadow = true
        window.isMovableByWindowBackground = true
        window.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        window.ignoresMouseEvents = false

        let contentView = NSView(frame: NSRect(x: 0, y: 0, width: size, height: size))
        contentView.wantsLayer = true
        contentView.layer?.cornerRadius = size / 2
        contentView.layer?.masksToBounds = true
        contentView.layer?.borderColor = NSColor.white.withAlphaComponent(0.3).cgColor
        contentView.layer?.borderWidth = 2
        layer.frame = contentView.bounds
        contentView.layer?.addSublayer(layer)
        window.contentView = contentView

        if let screen = NSScreen.main {
            let x = screen.frame.maxX - size - 20
            let y = screen.frame.minY + 20
            window.setFrameOrigin(NSPoint(x: x, y: y))
        }

        window.orderFront(nil)
        session.startRunning()

        self.captureSession = session
        self.previewLayer = layer
        self.webcamWindow = window
        self.isActive = true
    }

    func stop() {
        captureSession?.stopRunning()
        captureSession = nil
        webcamWindow?.close()
        webcamWindow = nil
        previewLayer = nil
        isActive = false
    }
}
