import AppKit
import CoreImage

final class AnnotationRenderer {
    static let shared = AnnotationRenderer()
    private let ciContext = CIContext()

    func render(image: CGImage, elements: [AnnotationElement]) -> CGImage? {
        let width = image.width
        let height = image.height
        let colorSpace = image.colorSpace ?? CGColorSpace(name: CGColorSpace.sRGB)!

        guard let context = CGContext(
            data: nil, width: width, height: height,
            bitsPerComponent: image.bitsPerComponent,
            bytesPerRow: 0, space: colorSpace,
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else { return nil }

        context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))

        let scaleX = CGFloat(width) / CGFloat(width) // 1:1 if same coord space
        let scaleY = CGFloat(height) / CGFloat(height)
        context.scaleBy(x: scaleX, y: scaleY)

        for element in elements {
            if let blur = element as? BlurAnnotation {
                applyBlur(blur, to: image, context: context, imageSize: CGSize(width: width, height: height))
            } else {
                element.draw(in: context)
            }
        }

        return context.makeImage()
    }

    private func applyBlur(_ blur: BlurAnnotation, to image: CGImage, context: CGContext, imageSize: CGSize) {
        let ciImage = CIImage(cgImage: image)
        let filterName: String
        var params: [String: Any] = [kCIInputImageKey: ciImage]

        switch blur.blurType {
        case .gaussian:
            filterName = "CIGaussianBlur"
            params[kCIInputRadiusKey] = blur.intensity
        case .pixelate:
            filterName = "CIPixellate"
            params[kCIInputScaleKey] = blur.intensity
        }

        guard let filter = CIFilter(name: filterName, parameters: params),
              let output = filter.outputImage else { return }

        let cropRect = CGRect(
            x: blur.bounds.origin.x,
            y: imageSize.height - blur.bounds.maxY,
            width: blur.bounds.width,
            height: blur.bounds.height
        )

        let croppedBlur = output.cropped(to: cropRect)
        if let blurredCG = ciContext.createCGImage(croppedBlur, from: cropRect) {
            context.draw(blurredCG, in: blur.bounds)
        }
    }
}
