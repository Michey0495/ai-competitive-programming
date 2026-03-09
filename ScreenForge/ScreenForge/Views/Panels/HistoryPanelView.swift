import SwiftUI

struct HistoryPanelView: View {
    @ObservedObject var historyManager: HistoryManager

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text("History")
                    .font(.headline)
                Spacer()
                Button("Clear") {
                    historyManager.clear()
                }
                .buttonStyle(.plain)
                .foregroundColor(.secondary)
            }
            .padding()

            Divider()

            if historyManager.items.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "photo.on.rectangle.angled")
                        .font(.system(size: 40))
                        .foregroundColor(.secondary)
                    Text("No captures yet")
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                List {
                    ForEach(historyManager.items) { item in
                        HistoryItemRow(item: item)
                            .contextMenu {
                                Button("Show in Finder") {
                                    NSWorkspace.shared.selectFile(item.fileURL.path, inFileViewerRootedAtPath: "")
                                }
                                Button("Copy to Clipboard") {
                                    if item.type == .screenshot {
                                        if let image = NSImage(contentsOf: item.fileURL) {
                                            ClipboardService.shared.copyImage(image)
                                        }
                                    } else {
                                        ClipboardService.shared.copyFileURL(item.fileURL)
                                    }
                                }
                                Divider()
                                Button("Delete", role: .destructive) {
                                    try? FileManager.default.removeItem(at: item.fileURL)
                                    historyManager.remove(item)
                                }
                            }
                    }
                }
            }
        }
        .frame(minWidth: 350, minHeight: 400)
    }
}

struct HistoryItemRow: View {
    let item: HistoryItem

    var body: some View {
        HStack(spacing: 12) {
            Group {
                if item.type == .screenshot, let image = NSImage(contentsOf: item.fileURL) {
                    Image(nsImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } else {
                    Image(systemName: item.type == .gif ? "photo.circle" : "video.circle")
                        .font(.system(size: 24))
                        .foregroundColor(.secondary)
                }
            }
            .frame(width: 60, height: 40)
            .cornerRadius(4)
            .clipped()

            VStack(alignment: .leading, spacing: 2) {
                Text(item.fileURL.lastPathComponent)
                    .font(.caption)
                    .lineLimit(1)

                HStack(spacing: 8) {
                    Text(item.type.rawValue.uppercased())
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.secondary)

                    if let size = item.pixelSize {
                        Text("\(Int(size.width))×\(Int(size.height))")
                            .font(.system(size: 9))
                            .foregroundColor(.secondary)
                    }

                    if let dur = item.duration {
                        Text(String(format: "%.1fs", dur))
                            .font(.system(size: 9))
                            .foregroundColor(.secondary)
                    }
                }

                Text(item.timestamp, style: .relative)
                    .font(.system(size: 9))
                    .foregroundColor(.secondary)
            }

            Spacer()
        }
        .padding(.vertical, 4)
    }
}
