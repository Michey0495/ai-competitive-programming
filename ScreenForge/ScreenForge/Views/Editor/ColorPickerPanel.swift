import SwiftUI

struct ColorPickerPanel: View {
    @Binding var selectedColor: Color
    @Binding var lineWidth: CGFloat

    private let presetColors: [Color] = [
        .red, .orange, .yellow, .green, .blue, .purple, .pink, .white, .black
    ]

    var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 8) {
                ForEach(presetColors, id: \.self) { color in
                    Circle()
                        .fill(color)
                        .frame(width: 24, height: 24)
                        .overlay(
                            Circle()
                                .stroke(selectedColor == color ? Color.white : Color.clear, lineWidth: 2)
                        )
                        .onTapGesture {
                            selectedColor = color
                        }
                }
                ColorPicker("", selection: $selectedColor)
                    .labelsHidden()
            }

            HStack {
                Text("Width")
                    .font(.caption)
                Slider(value: $lineWidth, in: 1...10, step: 0.5)
                Text("\(Int(lineWidth))px")
                    .font(.caption)
                    .frame(width: 30)
            }
        }
        .padding(12)
        .background(.ultraThinMaterial)
        .cornerRadius(12)
    }
}
