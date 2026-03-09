import AppKit
import ScreenCaptureKit

@MainActor
final class ScrollingCaptureService {
    private let captureService = ScreenCaptureService.shared
    private var frames: [CGImage] = []

    func captureScrolling(rect: CGRect, scrollAmount: CGFloat = 100, maxScrolls: Int = 20) async throws -> CaptureResult {
        frames.removeAll()

        for i in 0..<maxScrolls {
            let result = try await captureService.captureArea(rect: rect)
            frames.append(result.cgImage)

            if i < maxScrolls - 1 {
                simulateScroll(at: CGPoint(x: rect.midX, y: rect.midY), amount: scrollAmount)
                try await Task.sleep(nanoseconds: 300_000_000)
            }
        }

        let stitched = try stitchFrames(frames)
        let nsImage = NSImage(cgImage: stitched, size: NSSize(width: stitched.width, height: stitched.height))
        return CaptureResult(image: nsImage, cgImage: stitched, captureMode: .scrolling, captureRect: rect)
    }

    private func simulateScroll(at point: CGPoint, amount: CGFloat) {
        let event = CGEvent(scrollWheelEvent2Source: nil, units: .pixel, wheelCount: 1, wheel1: Int32(-amount), wheel2: 0, wheel3: 0)
        event?.location = point
        event?.post(tap: .cghidEventTap)
    }

    private func stitchFrames(_ frames: [CGImage]) throws -> CGImage {
        guard let first = frames.first else {
            throw NSError(domain: "ScreenForge", code: -1, userInfo: [NSLocalizedDescriptionKey: "No frames captured"])
        }

        guard frames.count > 1 else { return first }

        let width = first.width
        var totalHeight = first.height
        var offsets: [Int] = [0]

        for i in 1..<frames.count {
            let overlap = findOverlap(top: frames[i - 1], bottom: frames[i])
            let newContent = frames[i].height - overlap
            if newContent <= 10 { break }
            totalHeight += newContent
            offsets.append(totalHeight - frames[i].height)
        }

        let colorSpace = first.colorSpace ?? CGColorSpace(name: CGColorSpace.sRGB)!
        guard let context = CGContext(
            data: nil, width: width, height: totalHeight,
            bitsPerComponent: first.bitsPerComponent,
            bytesPerRow: 0, space: colorSpace,
            bitmapInfo: first.bitmapInfo.rawValue
        ) else {
            throw NSError(domain: "ScreenForge", code: -2, userInfo: [NSLocalizedDescriptionKey: "Failed to create stitch context"])
        }

        for (i, frame) in frames.enumerated() {
            if i >= offsets.count { break }
            let y = totalHeight - offsets[i] - frame.height
            context.draw(frame, in: CGRect(x: 0, y: y, width: frame.width, height: frame.height))
        }

        guard let result = context.makeImage() else {
            throw NSError(domain: "ScreenForge", code: -3, userInfo: [NSLocalizedDescriptionKey: "Failed to stitch image"])
        }
        return result
    }

    private func findOverlap(top: CGImage, bottom: CGImage) -> Int {
        let stripHeight = 40
        let width = min(top.width, bottom.width)

        guard let topData = top.dataProvider?.data as Data?,
              let bottomData = bottom.dataProvider?.data as Data? else { return 0 }

        let topBytesPerRow = top.bytesPerRow
        let bottomBytesPerRow = bottom.bytesPerRow

        for offset in stride(from: 0, to: min(bottom.height, top.height / 2), by: 2) {
            var match = true
            for row in 0..<min(stripHeight, bottom.height - offset) {
                let topRowStart = (top.height - offset - stripHeight + row) * topBytesPerRow
                let bottomRowStart = row * bottomBytesPerRow
                guard topRowStart >= 0, topRowStart + width * 4 <= topData.count,
                      bottomRowStart + width * 4 <= bottomData.count else { continue }

                var diff = 0
                for col in stride(from: 0, to: width * 4, by: 16) {
                    if topData[topRowStart + col] != bottomData[bottomRowStart + col] {
                        diff += 1
                    }
                }
                if diff > width / 8 {
                    match = false
                    break
                }
            }
            if match { return offset + stripHeight }
        }
        return 0
    }
}
