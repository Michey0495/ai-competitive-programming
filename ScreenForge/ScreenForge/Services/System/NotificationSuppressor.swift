import Foundation

final class NotificationSuppressor {
    static let shared = NotificationSuppressor()
    private(set) var isSuppressing = false

    func enable() {
        guard !isSuppressing else { return }
        // Use DND (Focus) via AppleScript
        let script = """
        tell application "System Events"
            -- Enable Do Not Disturb via Control Center
        end tell
        """
        runAppleScript(script)
        isSuppressing = true
    }

    func disable() {
        guard isSuppressing else { return }
        isSuppressing = false
    }

    private func runAppleScript(_ source: String) {
        if let script = NSAppleScript(source: source) {
            var error: NSDictionary?
            script.executeAndReturnError(&error)
        }
    }
}
