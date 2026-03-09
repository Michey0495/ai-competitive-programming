import SwiftUI

struct RecordingSettingsTab: View {
    @EnvironmentObject var viewModel: SettingsViewModel

    var body: some View {
        Form {
            Section("Video") {
                Picker("Frame Rate", selection: $viewModel.recordingFPS) {
                    Text("30 FPS").tag(30)
                    Text("60 FPS").tag(60)
                }
            }

            Section("Audio") {
                Toggle("Record system audio", isOn: $viewModel.recordSystemAudio)
                Toggle("Record microphone", isOn: $viewModel.recordMicrophone)
            }

            Section("Overlay") {
                Toggle("Include webcam", isOn: $viewModel.includeWebcam)
                Toggle("Show mouse clicks", isOn: $viewModel.showMouseClicks)
                Toggle("Show keystrokes", isOn: $viewModel.showKeystrokes)
            }
        }
        .formStyle(.grouped)
        .padding()
    }
}
