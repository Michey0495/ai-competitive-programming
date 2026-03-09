import AppKit
import ScreenCaptureKit

@MainActor
final class WindowListService {
    static let shared = WindowListService()

    func getWindows() async throws -> [SCWindow] {
        let content = try await SCShareableContent.excludingDesktopWindows(true, onScreenWindowsOnly: true)
        return content.windows.filter { window in
            guard let app = window.owningApplication else { return false }
            guard app.bundleIdentifier != Bundle.main.bundleIdentifier else { return false }
            guard window.frame.width > 50 && window.frame.height > 50 else { return false }
            guard window.isOnScreen else { return false }
            return true
        }
    }

    func getDisplays() async throws -> [SCDisplay] {
        let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: true)
        return content.displays
    }

    func windowAtPoint(_ point: CGPoint) async throws -> SCWindow? {
        let windows = try await getWindows()
        return windows.first { $0.frame.contains(point) }
    }
}
