import SwiftUI

struct ShortcutsSettingsTab: View {
    var body: some View {
        Form {
            Section("Capture") {
                shortcutRow("Capture Area", shortcut: "⌘⇧4")
                shortcutRow("Capture Window", shortcut: "⌘⇧5")
                shortcutRow("Capture Fullscreen", shortcut: "⌘⇧6")
                shortcutRow("Scrolling Capture", shortcut: "⌘⇧7")
                shortcutRow("Timed Capture", shortcut: "⌘⇧8")
                shortcutRow("OCR Capture", shortcut: "⌘⇧9")
            }

            Section("Recording") {
                shortcutRow("Toggle Recording", shortcut: "⌘⇧R")
                shortcutRow("Record GIF", shortcut: "⌘⇧G")
            }

            Section("Other") {
                shortcutRow("History", shortcut: "⌘⇧H")
            }
        }
        .formStyle(.grouped)
        .padding()
    }

    private func shortcutRow(_ label: String, shortcut: String) -> some View {
        HStack {
            Text(label)
            Spacer()
            Text(shortcut)
                .font(.system(.body, design: .monospaced))
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.secondary.opacity(0.15))
                .cornerRadius(6)
        }
    }
}
