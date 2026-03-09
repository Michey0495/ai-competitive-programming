import SwiftUI

struct GeneralSettingsTab: View {
    @EnvironmentObject var viewModel: SettingsViewModel

    var body: some View {
        Form {
            Section("Output") {
                HStack {
                    Text("Save to:")
                    Spacer()
                    Text(viewModel.saveDirectory.path)
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                    Button("Choose...") {
                        chooseSaveDirectory()
                    }
                }

                Picker("Image Format", selection: $viewModel.imageFormat) {
                    Text("PNG").tag("png")
                    Text("JPEG").tag("jpg")
                    Text("TIFF").tag("tiff")
                }
            }

            Section("Behavior") {
                Toggle("Copy to clipboard after capture", isOn: $viewModel.copyToClipboard)
                Toggle("Play sound effect", isOn: $viewModel.playSound)
                Toggle("Show Quick Access toolbar", isOn: $viewModel.showQuickAccess)
            }

            Section("Startup") {
                Toggle("Launch at login", isOn: .constant(false))
            }
        }
        .formStyle(.grouped)
        .padding()
    }

    private func chooseSaveDirectory() {
        let panel = NSOpenPanel()
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        panel.canCreateDirectories = true
        panel.allowsMultipleSelection = false

        if panel.runModal() == .OK, let url = panel.url {
            viewModel.saveDirectory = url
        }
    }
}
