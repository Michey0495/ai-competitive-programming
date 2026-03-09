import SwiftUI
import ScreenCaptureKit

@MainActor
final class CaptureViewModel: ObservableObject {
    @Published var isCapturing = false
    @Published var lastResult: CaptureResult?
    @Published var errorMessage: String?
    @Published var selectedMode: CaptureMode = .area

    let captureService = ScreenCaptureService.shared
    let windowListService = WindowListService.shared

    func captureFullscreen() async {
        isCapturing = true
        defer { isCapturing = false }

        do {
            lastResult = try await captureService.captureFullscreen()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func captureArea(rect: CGRect) async {
        isCapturing = true
        defer { isCapturing = false }

        do {
            lastResult = try await captureService.captureArea(rect: rect)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func captureWindow(_ window: SCWindow) async {
        isCapturing = true
        defer { isCapturing = false }

        do {
            lastResult = try await captureService.captureWindow(window)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
