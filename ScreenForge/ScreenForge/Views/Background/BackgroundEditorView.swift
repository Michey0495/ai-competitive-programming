import SwiftUI

struct BackgroundEditorView: View {
    let image: CGImage
    @State private var selectedPreset = BackgroundPreset.presets[0]
    let onApply: (CGImage) -> Void
    let onCancel: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Text("Background")
                .font(.headline)

            // Preview
            if let preview = BackgroundService.shared.applyBackground(to: image, preset: selectedPreset) {
                Image(nsImage: NSImage(cgImage: preview, size: NSSize(width: preview.width / 2, height: preview.height / 2)))
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxHeight: 300)
                    .cornerRadius(8)
            }

            // Preset grid
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(BackgroundPreset.presets) { preset in
                        VStack(spacing: 4) {
                            RoundedRectangle(cornerRadius: 8)
                                .fill(presetColor(preset))
                                .frame(width: 60, height: 40)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(selectedPreset.id == preset.id ? Color.blue : Color.clear, lineWidth: 2)
                                )

                            Text(preset.name)
                                .font(.caption2)
                        }
                        .onTapGesture {
                            selectedPreset = preset
                        }
                    }
                }
            }

            HStack {
                Button("Cancel") { onCancel() }
                    .keyboardShortcut(.escape)
                Spacer()
                Button("Apply") {
                    if let result = BackgroundService.shared.applyBackground(to: image, preset: selectedPreset) {
                        onApply(result)
                    }
                }
                .buttonStyle(.borderedProminent)
                .keyboardShortcut(.return)
            }
        }
        .padding()
        .frame(width: 500)
    }

    private func presetColor(_ preset: BackgroundPreset) -> some ShapeStyle {
        switch preset.type {
        case .gradient(let colors, _):
            return AnyShapeStyle(LinearGradient(colors: colors.map { Color(nsColor: $0) }, startPoint: .topLeading, endPoint: .bottomTrailing))
        case .solid(let color):
            return AnyShapeStyle(Color(nsColor: color))
        case .transparent:
            return AnyShapeStyle(Color.gray.opacity(0.2))
        case .image:
            return AnyShapeStyle(Color.gray)
        }
    }
}
