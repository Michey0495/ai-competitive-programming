import SwiftUI

struct CloudSettingsTab: View {
    @EnvironmentObject var viewModel: SettingsViewModel

    var body: some View {
        Form {
            Section("S3-Compatible Storage") {
                TextField("Endpoint URL", text: $viewModel.cloudEndpoint)
                TextField("Bucket", text: $viewModel.cloudBucket)
                TextField("Access Key", text: $viewModel.cloudAccessKey)
                SecureField("Secret Key", text: $viewModel.cloudSecretKey)
                TextField("Region", text: $viewModel.cloudRegion)
            }
        }
        .formStyle(.grouped)
        .padding()
    }
}
