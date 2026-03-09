import CoreGraphics
import AppKit

extension CGImage {
    func toNSImage() -> NSImage {
        NSImage(cgImage: self, size: NSSize(width: width, height: height))
    }

    func scaled(to maxDimension: Int) -> CGImage? {
        let scale = CGFloat(maxDimension) / CGFloat(max(width, height))
        guard scale < 1 else { return self }

        let newWidth = Int(CGFloat(width) * scale)
        let newHeight = Int(CGFloat(height) * scale)

        guard let colorSpace = colorSpace,
              let context = CGContext(
                data: nil, width: newWidth, height: newHeight,
                bitsPerComponent: bitsPerComponent,
                bytesPerRow: 0, space: colorSpace,
                bitmapInfo: bitmapInfo.rawValue
              ) else { return nil }

        context.interpolationQuality = .high
        context.draw(self, in: CGRect(x: 0, y: 0, width: newWidth, height: newHeight))
        return context.makeImage()
    }
}
