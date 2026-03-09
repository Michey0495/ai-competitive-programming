import AppKit

struct CropToolHandler {
    static func crop(image: CGImage, to rect: CGRect) -> CGImage? {
        image.cropping(to: rect)
    }
}
