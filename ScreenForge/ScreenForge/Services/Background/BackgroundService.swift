import AppKit

final class BackgroundService {
    static let shared = BackgroundService()

    func applyBackground(to image: CGImage, preset: BackgroundPreset) -> CGImage? {
        guard case .transparent = preset.type else {} // proceed for all types
        let padding = preset.padding
        let cornerRadius = preset.cornerRadius

        let imgWidth = CGFloat(image.width)
        let imgHeight = CGFloat(image.height)
        let totalWidth = imgWidth + padding * 2
        let totalHeight = imgHeight + padding * 2

        let colorSpace = image.colorSpace ?? CGColorSpace(name: CGColorSpace.sRGB)!
        guard let context = CGContext(
            data: nil,
            width: Int(totalWidth),
            height: Int(totalHeight),
            bitsPerComponent: 8,
            bytesPerRow: 0,
            space: colorSpace,
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else { return nil }

        let fullRect = CGRect(x: 0, y: 0, width: totalWidth, height: totalHeight)

        switch preset.type {
        case .transparent:
            return image

        case .solid(let color):
            context.setFillColor(color.cgColor)
            context.fill(fullRect)

        case .gradient(let colors, let angle):
            drawGradient(context: context, rect: fullRect, colors: colors, angle: angle)

        case .image(let name):
            if let bgImage = NSImage(named: name)?.cgImage(forProposedRect: nil, context: nil, hints: nil) {
                context.draw(bgImage, in: fullRect)
            }
        }

        let imageRect = CGRect(x: padding, y: padding, width: imgWidth, height: imgHeight)

        if cornerRadius > 0 {
            let path = CGPath(roundedRect: imageRect, cornerWidth: cornerRadius, cornerHeight: cornerRadius, transform: nil)
            context.addPath(path)
            context.clip()

            context.setShadow(offset: CGSize(width: 0, height: -4), blur: 20, color: NSColor.black.withAlphaComponent(0.3).cgColor)
        }

        context.draw(image, in: imageRect)

        return context.makeImage()
    }

    private func drawGradient(context: CGContext, rect: CGRect, colors: [NSColor], angle: CGFloat) {
        let cgColors = colors.map { $0.cgColor } as CFArray
        guard let gradient = CGGradient(colorsSpace: CGColorSpace(name: CGColorSpace.sRGB), colors: cgColors, locations: nil) else { return }

        let radians = angle * .pi / 180
        let centerX = rect.midX
        let centerY = rect.midY
        let length = max(rect.width, rect.height)

        let startPoint = CGPoint(
            x: centerX - cos(radians) * length / 2,
            y: centerY - sin(radians) * length / 2
        )
        let endPoint = CGPoint(
            x: centerX + cos(radians) * length / 2,
            y: centerY + sin(radians) * length / 2
        )

        context.drawLinearGradient(gradient, start: startPoint, end: endPoint, options: [.drawsBeforeStartLocation, .drawsAfterEndLocation])
    }
}
