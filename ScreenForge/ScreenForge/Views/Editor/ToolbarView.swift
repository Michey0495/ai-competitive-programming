import SwiftUI

struct ToolbarView: View {
    @ObservedObject var engine: AnnotationEngine

    var body: some View {
        HStack(spacing: 12) {
            ForEach(AnnotationEngine.AnnotationToolType.allCases, id: \.rawValue) { tool in
                Button {
                    engine.currentTool = tool
                } label: {
                    Image(systemName: iconName(for: tool))
                        .font(.system(size: 16))
                        .frame(width: 32, height: 32)
                        .background(engine.currentTool == tool ? Color.accentColor.opacity(0.2) : Color.clear)
                        .cornerRadius(6)
                }
                .buttonStyle(.plain)
                .help(tool.rawValue.capitalized)
            }

            Divider()
                .frame(height: 24)

            ColorPicker("", selection: Binding(
                get: { Color(nsColor: engine.currentColor) },
                set: { engine.currentColor = NSColor($0) }
            ))
            .labelsHidden()

            Slider(value: $engine.currentLineWidth, in: 1...10, step: 1)
                .frame(width: 80)
                .help("Line Width")
        }
    }

    private func iconName(for tool: AnnotationEngine.AnnotationToolType) -> String {
        switch tool {
        case .arrow: return "arrow.up.right"
        case .rectangle: return "rectangle"
        case .ellipse: return "circle"
        case .line: return "line.diagonal"
        case .text: return "textformat"
        case .blur: return "drop.fill"
        case .pixelate: return "square.grid.3x3"
        case .highlight: return "highlighter"
        case .numberedStep: return "number.circle"
        case .crop: return "crop"
        }
    }
}
