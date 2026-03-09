import AVFoundation
import AppKit

final class VideoCompositionService {
    static let shared = VideoCompositionService()

    func trimVideo(inputURL: URL, outputURL: URL, startTime: CMTime, endTime: CMTime) async throws -> URL {
        let asset = AVAsset(url: inputURL)
        let timeRange = CMTimeRange(start: startTime, end: endTime)

        guard let exportSession = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetHEVCHighestQuality) else {
            throw NSError(domain: "ScreenForge", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to create export session"])
        }

        exportSession.outputURL = outputURL
        exportSession.outputFileType = .mp4
        exportSession.timeRange = timeRange

        await exportSession.export()

        if exportSession.status == .failed, let error = exportSession.error {
            throw error
        }

        return outputURL
    }
}
