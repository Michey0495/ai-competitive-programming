import AppKit
import SwiftUI
import ScreenCaptureKit

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var statusBarController: StatusBarController!
    private(set) var captureCoordinator: CaptureCoordinator!
    private(set) var recordingCoordinator: RecordingCoordinator!
    private(set) var hotKeyManager: HotKeyManager!
    let settingsViewModel = SettingsViewModel()
    private(set) var historyManager: HistoryManager!

    func applicationDidFinishLaunching(_ notification: Notification) {
        ensureSaveDirectory()

        historyManager = HistoryManager()
        captureCoordinator = CaptureCoordinator(historyManager: historyManager)
        recordingCoordinator = RecordingCoordinator(historyManager: historyManager)
        hotKeyManager = HotKeyManager(captureCoordinator: captureCoordinator, recordingCoordinator: recordingCoordinator)

        statusBarController = StatusBarController(
            captureCoordinator: captureCoordinator,
            recordingCoordinator: recordingCoordinator,
            historyManager: historyManager
        )

        hotKeyManager.registerDefaults()
        PermissionManager.shared.requestScreenCapturePermission()
    }

    private func ensureSaveDirectory() {
        let dir = settingsViewModel.saveDirectory
        if !FileManager.default.fileExists(atPath: dir.path) {
            try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        }
    }
}
