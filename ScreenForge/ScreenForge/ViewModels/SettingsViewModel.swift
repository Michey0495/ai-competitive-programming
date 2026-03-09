import SwiftUI

@MainActor
final class SettingsViewModel: ObservableObject {
    @AppStorage(AppConstants.UserDefaultsKeys.copyToClipboard) var copyToClipboard = AppConstants.Defaults.copyToClipboard
    @AppStorage(AppConstants.UserDefaultsKeys.playSound) var playSound = AppConstants.Defaults.playSound
    @AppStorage(AppConstants.UserDefaultsKeys.showQuickAccess) var showQuickAccess = AppConstants.Defaults.showQuickAccess
    @AppStorage(AppConstants.UserDefaultsKeys.imageFormat) var imageFormat = AppConstants.Defaults.imageFormat
    @AppStorage(AppConstants.UserDefaultsKeys.recordingFPS) var recordingFPS = AppConstants.Recording.defaultFPS
    @AppStorage(AppConstants.UserDefaultsKeys.includeWebcam) var includeWebcam = false
    @AppStorage(AppConstants.UserDefaultsKeys.recordSystemAudio) var recordSystemAudio = true
    @AppStorage(AppConstants.UserDefaultsKeys.recordMicrophone) var recordMicrophone = false
    @AppStorage(AppConstants.UserDefaultsKeys.showMouseClicks) var showMouseClicks = true
    @AppStorage(AppConstants.UserDefaultsKeys.showKeystrokes) var showKeystrokes = false

    var saveDirectory: URL {
        get {
            UserDefaults.standard.url(forKey: AppConstants.UserDefaultsKeys.saveDirectory) ?? AppConstants.Defaults.saveDirectory
        }
        set {
            UserDefaults.standard.set(newValue, forKey: AppConstants.UserDefaultsKeys.saveDirectory)
            objectWillChange.send()
        }
    }

    // Cloud settings
    @Published var cloudEndpoint = ""
    @Published var cloudBucket = ""
    @Published var cloudAccessKey = ""
    @Published var cloudSecretKey = ""
    @Published var cloudRegion = "us-east-1"
}
