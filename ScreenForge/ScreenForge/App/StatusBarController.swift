import AppKit
import SwiftUI

final class StatusBarController {
    private var statusItem: NSStatusItem!
    private let captureCoordinator: CaptureCoordinator
    private let recordingCoordinator: RecordingCoordinator
    private let historyManager: HistoryManager

    init(captureCoordinator: CaptureCoordinator, recordingCoordinator: RecordingCoordinator, historyManager: HistoryManager) {
        self.captureCoordinator = captureCoordinator
        self.recordingCoordinator = recordingCoordinator
        self.historyManager = historyManager
        setupStatusItem()
    }

    private func setupStatusItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        if let button = statusItem.button {
            button.image = NSImage(systemSymbolName: "camera.viewfinder", accessibilityDescription: "ScreenForge")
            button.image?.size = NSSize(width: 18, height: 18)
        }
        statusItem.menu = buildMenu()
    }

    private func buildMenu() -> NSMenu {
        let menu = NSMenu()

        menu.addItem(menuItem("Capture Area", action: #selector(captureArea), key: "4", modifiers: [.command, .shift]))
        menu.addItem(menuItem("Capture Window", action: #selector(captureWindow), key: "5", modifiers: [.command, .shift]))
        menu.addItem(menuItem("Capture Fullscreen", action: #selector(captureFullscreen), key: "6", modifiers: [.command, .shift]))
        menu.addItem(NSMenuItem.separator())
        menu.addItem(menuItem("Scrolling Capture", action: #selector(captureScrolling), key: "7", modifiers: [.command, .shift]))
        menu.addItem(menuItem("Timed Capture (5s)", action: #selector(captureTimed), key: "8", modifiers: [.command, .shift]))
        menu.addItem(menuItem("OCR Capture", action: #selector(captureOCR), key: "9", modifiers: [.command, .shift]))

        menu.addItem(NSMenuItem.separator())

        let recordItem = menuItem("Start Recording", action: #selector(toggleRecording), key: "r", modifiers: [.command, .shift])
        menu.addItem(recordItem)
        menu.addItem(menuItem("Record GIF", action: #selector(recordGIF), key: "g", modifiers: [.command, .shift]))

        menu.addItem(NSMenuItem.separator())
        menu.addItem(menuItem("History", action: #selector(showHistory), key: "h", modifiers: [.command, .shift]))
        menu.addItem(NSMenuItem.separator())

        menu.addItem(menuItem("Settings...", action: #selector(openSettings), key: ",", modifiers: [.command]))
        menu.addItem(NSMenuItem.separator())
        menu.addItem(menuItem("Quit ScreenForge", action: #selector(quitApp), key: "q", modifiers: [.command]))

        return menu
    }

    private func menuItem(_ title: String, action: Selector, key: String, modifiers: NSEvent.ModifierFlags) -> NSMenuItem {
        let item = NSMenuItem(title: title, action: action, keyEquivalent: key)
        item.keyEquivalentModifierMask = modifiers
        item.target = self
        return item
    }

    @objc private func captureArea() {
        captureCoordinator.startCapture(mode: .area)
    }

    @objc private func captureWindow() {
        captureCoordinator.startCapture(mode: .window)
    }

    @objc private func captureFullscreen() {
        captureCoordinator.startCapture(mode: .fullscreen)
    }

    @objc private func captureScrolling() {
        captureCoordinator.startCapture(mode: .scrolling)
    }

    @objc private func captureTimed() {
        captureCoordinator.startCapture(mode: .timed(seconds: 5))
    }

    @objc private func captureOCR() {
        captureCoordinator.startCapture(mode: .area)
    }

    @objc private func toggleRecording() {
        if recordingCoordinator.isRecording {
            recordingCoordinator.stopRecording()
        } else {
            recordingCoordinator.startRecording(mode: .mp4)
        }
    }

    @objc private func recordGIF() {
        if recordingCoordinator.isRecording {
            recordingCoordinator.stopRecording()
        } else {
            recordingCoordinator.startRecording(mode: .gif)
        }
    }

    @objc private func showHistory() {
        let panel = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: 400, height: 600),
            styleMask: [.titled, .closable, .resizable, .utilityWindow],
            backing: .buffered,
            defer: false
        )
        panel.title = "History"
        panel.contentView = NSHostingView(rootView: HistoryPanelView(historyManager: historyManager))
        panel.center()
        panel.makeKeyAndOrderFront(nil)
    }

    @objc private func openSettings() {
        NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    @objc private func quitApp() {
        NSApp.terminate(nil)
    }
}
