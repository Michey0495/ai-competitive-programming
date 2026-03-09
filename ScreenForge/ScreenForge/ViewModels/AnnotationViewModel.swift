import SwiftUI

@MainActor
final class AnnotationViewModel: ObservableObject {
    @Published var engine = AnnotationEngine()
    @Published var isEditing = false
    @Published var originalImage: CGImage?
    @Published var editedImage: CGImage?

    func startEditing(image: CGImage) {
        originalImage = image
        editedImage = image
        engine.clear()
        isEditing = true
    }

    func finishEditing() -> CGImage? {
        guard let original = originalImage else { return nil }
        let rendered = AnnotationRenderer.shared.render(image: original, elements: engine.elements)
        isEditing = false
        return rendered
    }

    func cancelEditing() {
        engine.clear()
        isEditing = false
    }
}
