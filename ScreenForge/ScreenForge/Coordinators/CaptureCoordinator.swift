import AppKit
import ScreenCaptureKit

@MainActor
final class CaptureCoordinator {
    private let captureService = ScreenCaptureService.shared
    private let historyManager: HistoryManager
    private var areaOverlay: AreaSelectionOverlay?
    private var windowOverlay: WindowSelectionOverlay?
    private var quickAccessToolbar: QuickAccessToolbarWindow?
    private var annotationViewModel = AnnotationViewModel()
    private var editorWindow: NSWindow?
    private var lastCaptureResult: CaptureResult?
    private let scrollingCaptureService = ScrollingCaptureService()
    private let timedCaptureService = TimedCaptureService()
    private var countdownOverlay: CountdownOverlay?

    init(historyManager: HistoryManager) {
        self.historyManager = historyManager
    }

    func startCapture(mode: CaptureMode) {
        switch mode {
        case .area:
            startAreaCapture()
        case .window:
            startWindowCapture()
        case .fullscreen:
            captureFullscreen()
        case .scrolling:
            startAreaCapture(scrolling: true)
        case .timed(let seconds):
            startTimedCapture(seconds: seconds)
        }
    }

    private func startAreaCapture(scrolling: Bool = false) {
        let overlay = AreaSelectionOverlay()
        overlay.onSelectionComplete = { [weak self] rect in
            guard let self else { return }
            Task {
                if scrolling {
                    await self.performScrollingCapture(rect: rect)
                } else {
                    await self.performAreaCapture(rect: rect)
                }
            }
        }
        overlay.onCancel = { [weak self] in
            self?.areaOverlay = nil
        }
        areaOverlay = overlay
        overlay.show()
    }

    private func startWindowCapture() {
        let overlay = WindowSelectionOverlay()
        overlay.onWindowSelected = { [weak self] window in
            guard let self else { return }
            Task {
                await self.performWindowCapture(window)
            }
        }
        overlay.onCancel = { [weak self] in
            self?.windowOverlay = nil
        }
        windowOverlay = overlay
        overlay.show()
    }

    private func captureFullscreen() {
        Task {
            do {
                let result = try await captureService.captureFullscreen()
                handleCaptureResult(result)
            } catch {
                showError(error)
            }
        }
    }

    private func performAreaCapture(rect: CGRect) async {
        do {
            let result = try await captureService.captureArea(rect: rect)
            handleCaptureResult(result)
        } catch {
            showError(error)
        }
        areaOverlay = nil
    }

    private func performWindowCapture(_ window: SCWindow) async {
        do {
            let result = try await captureService.captureWindow(window)
            handleCaptureResult(result)
        } catch {
            showError(error)
        }
        windowOverlay = nil
    }

    private func performScrollingCapture(rect: CGRect) async {
        do {
            let result = try await scrollingCaptureService.captureScrolling(rect: rect)
            handleCaptureResult(result)
        } catch {
            showError(error)
        }
        areaOverlay = nil
    }

    private func startTimedCapture(seconds: Int) {
        let countdown = CountdownOverlay()
        countdown.onCountdownComplete = { [weak self] in
            guard let self else { return }
            Task {
                do {
                    let result = try await self.captureService.captureFullscreen()
                    self.handleCaptureResult(result)
                } catch {
                    self.showError(error)
                }
            }
        }
        countdownOverlay = countdown
        countdown.start(seconds: seconds)
    }

    private func handleCaptureResult(_ result: CaptureResult) {
        lastCaptureResult = result

        let copyToClipboard = UserDefaults.standard.bool(forKey: AppConstants.UserDefaultsKeys.copyToClipboard)
        if copyToClipboard {
            ClipboardService.shared.copyImage(result.image)
        }

        if UserDefaults.standard.bool(forKey: AppConstants.UserDefaultsKeys.playSound) {
            NSSound(named: "Tink")?.play()
        }

        let showQuickAccess = UserDefaults.standard.object(forKey: AppConstants.UserDefaultsKeys.showQuickAccess) as? Bool ?? true
        if showQuickAccess {
            showQuickAccessToolbar(for: result)
        } else {
            saveResult(result)
        }
    }

    private func showQuickAccessToolbar(for result: CaptureResult) {
        let toolbar = QuickAccessToolbarWindow()
        toolbar.onAction = { [weak self] action in
            guard let self else { return }
            switch action {
            case .save:
                saveResult(result)
            case .copy:
                ClipboardService.shared.copyImage(result.image)
            case .annotate:
                openAnnotationEditor(for: result)
            case .pin:
                openPinWindow(for: result)
            case .ocr:
                performOCR(on: result)
            case .background:
                openBackgroundEditor(for: result)
            case .cloud:
                uploadToCloud(result)
            case .close:
                break
            }
        }
        quickAccessToolbar = toolbar
        toolbar.show(for: result)
    }

    private func saveResult(_ result: CaptureResult) {
        do {
            let url = try FileOutputService.shared.save(image: result.cgImage)
            let item = HistoryItem(fileURL: url, type: .screenshot, pixelSize: result.pixelSize)
            historyManager.add(item)
        } catch {
            showError(error)
        }
    }

    private func openAnnotationEditor(for result: CaptureResult) {
        annotationViewModel.startEditing(image: result.cgImage)

        let editorView = AnnotationEditorView(
            viewModel: annotationViewModel,
            onSave: { [weak self] editedImage in
                guard let self else { return }
                do {
                    let url = try FileOutputService.shared.save(image: editedImage)
                    let item = HistoryItem(fileURL: url, type: .screenshot, pixelSize: NSSize(width: editedImage.width, height: editedImage.height))
                    historyManager.add(item)
                    ClipboardService.shared.copyImageFromCG(editedImage)
                } catch {
                    showError(error)
                }
                editorWindow?.close()
            },
            onCancel: { [weak self] in
                self?.editorWindow?.close()
            }
        )

        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 800, height: 600),
            styleMask: [.titled, .closable, .resizable, .miniaturizable],
            backing: .buffered,
            defer: false
        )
        window.title = "Annotation Editor"
        window.contentView = NSHostingView(rootView: editorView)
        window.center()
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        editorWindow = window
    }

    private func openPinWindow(for result: CaptureResult) {
        let pinWindow = PinWindow(image: result.image)
        pinWindow.makeKeyAndOrderFront(nil)
    }

    private func performOCR(on result: CaptureResult) {
        Task {
            do {
                let text = try await OCRService.shared.recognizeText(in: result.cgImage)
                ClipboardService.shared.copyText(text)
                showNotification(title: "Text Copied", body: String(text.prefix(100)))
            } catch {
                showError(error)
            }
        }
    }

    private func openBackgroundEditor(for result: CaptureResult) {
        let view = BackgroundEditorView(
            image: result.cgImage,
            onApply: { [weak self] editedImage in
                guard let self else { return }
                do {
                    let url = try FileOutputService.shared.save(image: editedImage)
                    let item = HistoryItem(fileURL: url, type: .screenshot)
                    historyManager.add(item)
                    ClipboardService.shared.copyImageFromCG(editedImage)
                } catch {
                    showError(error)
                }
                editorWindow?.close()
            },
            onCancel: { [weak self] in
                self?.editorWindow?.close()
            }
        )

        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 520, height: 500),
            styleMask: [.titled, .closable],
            backing: .buffered,
            defer: false
        )
        window.title = "Background"
        window.contentView = NSHostingView(rootView: view)
        window.center()
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        editorWindow = window
    }

    private func uploadToCloud(_ result: CaptureResult) {
        Task {
            do {
                let url = try FileOutputService.shared.save(image: result.cgImage)
                let cloud = S3CloudService()
                let uploadResult = try await cloud.upload(fileURL: url)
                ClipboardService.shared.copyText(uploadResult.publicURL.absoluteString)
                showNotification(title: "Uploaded", body: "Link copied to clipboard")
            } catch {
                showError(error)
            }
        }
    }

    private func showError(_ error: Error) {
        let alert = NSAlert()
        alert.messageText = "Capture Error"
        alert.informativeText = error.localizedDescription
        alert.alertStyle = .warning
        alert.runModal()
    }

    private func showNotification(title: String, body: String) {
        let notification = NSUserNotification()
        notification.title = title
        notification.informativeText = body
        NSUserNotificationCenter.default.deliver(notification)
    }
}

import SwiftUI
