import AppKit

struct CaptureResult {
    let image: NSImage
    let cgImage: CGImage
    let captureMode: CaptureMode
    let captureRect: CGRect?
    let timestamp: Date
    let displayID: CGDirectDisplayID?

    var pixelSize: NSSize {
        NSSize(width: cgImage.width, height: cgImage.height)
    }

    init(image: NSImage, cgImage: CGImage, captureMode: CaptureMode, captureRect: CGRect? = nil, displayID: CGDirectDisplayID? = nil) {
        self.image = image
        self.cgImage = cgImage
        self.captureMode = captureMode
        self.captureRect = captureRect
        self.timestamp = Date()
        self.displayID = displayID
    }
}
