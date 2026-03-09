import AppKit

struct NumberedStepToolHandler {
    static func createStep(center: CGPoint, number: Int, color: NSColor = .systemRed) -> NumberedStepAnnotation {
        NumberedStepAnnotation(center: center, number: number, color: color)
    }
}
