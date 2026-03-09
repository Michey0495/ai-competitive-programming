import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var viewModel: SettingsViewModel

    var body: some View {
        TabView {
            GeneralSettingsTab()
                .environmentObject(viewModel)
                .tabItem {
                    Label("General", systemImage: "gear")
                }

            ShortcutsSettingsTab()
                .tabItem {
                    Label("Shortcuts", systemImage: "keyboard")
                }

            RecordingSettingsTab()
                .environmentObject(viewModel)
                .tabItem {
                    Label("Recording", systemImage: "record.circle")
                }

            CloudSettingsTab()
                .environmentObject(viewModel)
                .tabItem {
                    Label("Cloud", systemImage: "icloud")
                }
        }
        .frame(width: 480, height: 360)
    }
}
