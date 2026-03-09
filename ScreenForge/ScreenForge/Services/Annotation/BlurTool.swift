import AppKit

struct BlurToolHandler {
    static func createBlur(bounds: CGRect, type: BlurAnnotation.BlurType = .gaussian, intensity: CGFloat = 10) -> BlurAnnotation {
        BlurAnnotation(bounds: bounds, blurType: type, intensity: intensity)
    }
}
