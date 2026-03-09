import AppKit

@MainActor
final class TimedCaptureService {
    private let captureService = ScreenCaptureService.shared

    func captureAfterDelay(seconds: Int, mode: CaptureMode, rect: CGRect? = nil) async throws -> CaptureResult {
        try await Task.sleep(nanoseconds: UInt64(seconds) * 1_000_000_000)

        switch mode {
        case .fullscreen:
            return try await captureService.captureFullscreen()
        case .area:
            guard let rect else {
                throw NSError(domain: "ScreenForge", code: -1, userInfo: [NSLocalizedDescriptionKey: "Area rect required"])
            }
            return try await captureService.captureArea(rect: rect)
        default:
            return try await captureService.captureFullscreen()
        }
    }
}
