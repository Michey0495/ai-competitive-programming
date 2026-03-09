import SwiftUI

struct AnnotationEditorView: View {
    @ObservedObject var viewModel: AnnotationViewModel
    let onSave: (CGImage) -> Void
    let onCancel: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            ToolbarView(engine: viewModel.engine)
                .padding(.horizontal)
                .padding(.vertical, 8)
                .background(.ultraThinMaterial)

            Divider()

            if let image = viewModel.originalImage {
                AnnotationCanvasRepresentable(
                    image: image,
                    engine: viewModel.engine
                )
            }

            Divider()

            HStack {
                Button("Cancel") {
                    viewModel.cancelEditing()
                    onCancel()
                }
                .keyboardShortcut(.escape)

                Spacer()

                Button("Undo") { viewModel.engine.undo() }
                    .disabled(!viewModel.engine.canUndo)
                    .keyboardShortcut("z")

                Button("Redo") { viewModel.engine.redo() }
                    .disabled(!viewModel.engine.canRedo)
                    .keyboardShortcut("z", modifiers: [.command, .shift])

                Spacer()

                Button("Save") {
                    if let result = viewModel.finishEditing() {
                        onSave(result)
                    }
                }
                .keyboardShortcut(.return)
                .buttonStyle(.borderedProminent)
            }
            .padding()
            .background(.ultraThinMaterial)
        }
    }
}

struct AnnotationCanvasRepresentable: NSViewRepresentable {
    let image: CGImage
    let engine: AnnotationEngine

    func makeNSView(context: Context) -> AnnotationCanvas {
        let canvas = AnnotationCanvas(image: image, engine: engine)
        return canvas
    }

    func updateNSView(_ nsView: AnnotationCanvas, context: Context) {
        nsView.needsDisplay = true
    }
}
