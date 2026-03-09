import SwiftUI
import AVFoundation

struct VideoTrimmerView: View {
    let videoURL: URL
    @State private var startTime: Double = 0
    @State private var endTime: Double = 1
    @State private var duration: Double = 1
    @State private var currentTime: Double = 0
    let onTrim: (CMTime, CMTime) -> Void
    let onCancel: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Text("Trim Video")
                .font(.headline)

            // Timeline
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    // Track background
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color.secondary.opacity(0.2))
                        .frame(height: 40)

                    // Selected range
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color.accentColor.opacity(0.3))
                        .frame(
                            width: max(0, geo.size.width * CGFloat((endTime - startTime) / duration)),
                            height: 40
                        )
                        .offset(x: geo.size.width * CGFloat(startTime / duration))

                    // Start handle
                    trimHandle(position: startTime, width: geo.size.width)
                        .gesture(
                            DragGesture()
                                .onChanged { value in
                                    let newTime = Double(value.location.x / geo.size.width) * duration
                                    startTime = max(0, min(newTime, endTime - 0.1))
                                }
                        )

                    // End handle
                    trimHandle(position: endTime, width: geo.size.width)
                        .gesture(
                            DragGesture()
                                .onChanged { value in
                                    let newTime = Double(value.location.x / geo.size.width) * duration
                                    endTime = max(startTime + 0.1, min(newTime, duration))
                                }
                        )
                }
            }
            .frame(height: 40)

            HStack {
                Text(formatTime(startTime))
                    .font(.caption.monospacedDigit())
                Spacer()
                Text("Duration: \(formatTime(endTime - startTime))")
                    .font(.caption.monospacedDigit())
                Spacer()
                Text(formatTime(endTime))
                    .font(.caption.monospacedDigit())
            }

            HStack {
                Button("Cancel") { onCancel() }
                    .keyboardShortcut(.escape)
                Spacer()
                Button("Trim") {
                    onTrim(
                        CMTime(seconds: startTime, preferredTimescale: 600),
                        CMTime(seconds: endTime, preferredTimescale: 600)
                    )
                }
                .buttonStyle(.borderedProminent)
                .keyboardShortcut(.return)
            }
        }
        .padding()
        .frame(width: 500)
        .task {
            let asset = AVAsset(url: videoURL)
            if let d = try? await asset.load(.duration) {
                duration = CMTimeGetSeconds(d)
                endTime = duration
            }
        }
    }

    private func trimHandle(position: Double, width: CGFloat) -> some View {
        RoundedRectangle(cornerRadius: 2)
            .fill(Color.accentColor)
            .frame(width: 8, height: 48)
            .offset(x: width * CGFloat(position / duration) - 4)
    }

    private func formatTime(_ seconds: Double) -> String {
        let mins = Int(seconds) / 60
        let secs = Int(seconds) % 60
        let ms = Int((seconds.truncatingRemainder(dividingBy: 1)) * 10)
        return String(format: "%d:%02d.%d", mins, secs, ms)
    }
}
