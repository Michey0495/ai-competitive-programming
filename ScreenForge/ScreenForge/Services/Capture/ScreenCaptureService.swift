import AppKit
import ScreenCaptureKit

@MainActor
final class ScreenCaptureService {
    static let shared = ScreenCaptureService()

    func captureFullscreen(displayID: CGDirectDisplayID? = nil) async throws -> CaptureResult {
        let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: true)
        let display = if let displayID {
            content.displays.first { $0.displayID == displayID } ?? content.displays.first!
        } else {
            content.displays.first!
        }

        let filter = SCContentFilter(display: display, excludingWindows: [])
        let config = SCStreamConfiguration()
        config.width = display.width
        config.height = display.height
        config.scaleFactor = 2
        config.captureResolution = .best
        config.showsCursor = false

        let cgImage = try await SCScreenshotManager.captureImage(contentFilter: filter, configuration: config)
        let nsImage = NSImage(cgImage: cgImage, size: NSSize(width: display.width, height: display.height))

        return CaptureResult(image: nsImage, cgImage: cgImage, captureMode: .fullscreen, displayID: display.displayID)
    }

    func captureArea(rect: CGRect, displayID: CGDirectDisplayID? = nil) async throws -> CaptureResult {
        let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: true)
        let display = if let displayID {
            content.displays.first { $0.displayID == displayID } ?? content.displays.first!
        } else {
            content.displays.first!
        }

        let filter = SCContentFilter(display: display, excludingWindows: [])
        let config = SCStreamConfiguration()
        config.sourceRect = rect
        config.width = Int(rect.width * 2)
        config.height = Int(rect.height * 2)
        config.scaleFactor = 2
        config.captureResolution = .best
        config.showsCursor = false

        let cgImage = try await SCScreenshotManager.captureImage(contentFilter: filter, configuration: config)
        let nsImage = NSImage(cgImage: cgImage, size: rect.size)

        return CaptureResult(image: nsImage, cgImage: cgImage, captureMode: .area, captureRect: rect, displayID: display.displayID)
    }

    func captureWindow(_ window: SCWindow) async throws -> CaptureResult {
        let filter = SCContentFilter(desktopIndependentWindow: window)
        let config = SCStreamConfiguration()
        config.width = Int(CGFloat(window.frame.width) * 2)
        config.height = Int(CGFloat(window.frame.height) * 2)
        config.scaleFactor = 2
        config.captureResolution = .best
        config.showsCursor = false
        config.ignoreShadow = false

        let cgImage = try await SCScreenshotManager.captureImage(contentFilter: filter, configuration: config)
        let nsImage = NSImage(cgImage: cgImage, size: window.frame.size)

        return CaptureResult(image: nsImage, cgImage: cgImage, captureMode: .window, captureRect: window.frame)
    }
}
