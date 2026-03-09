import Foundation

enum AppConstants {
    static let appName = "ScreenForge"
    static let bundleIdentifier = "com.ghostfee.ScreenForge"
    static let version = "1.0.0"

    enum Defaults {
        static let saveDirectory: URL = {
            let desktop = FileManager.default.urls(for: .desktopDirectory, in: .userDomainMask).first!
            return desktop.appendingPathComponent("ScreenForge", isDirectory: true)
        }()
        static let imageFormat = "png"
        static let videoFormat = "mp4"
        static let jpegQuality: CGFloat = 0.9
        static let copyToClipboard = true
        static let playSound = true
        static let showQuickAccess = true
    }

    enum UI {
        static let overlayCornerRadius: CGFloat = 8
        static let selectionBorderWidth: CGFloat = 1.5
        static let crosshairLength: CGFloat = 20
        static let quickAccessHeight: CGFloat = 48
        static let toolbarIconSize: CGFloat = 20
        static let accentColor = "AccentColor"
    }

    enum Recording {
        static let defaultFPS: Int = 60
        static let defaultBitrate: Int = 8_000_000
        static let gifFPS: Int = 15
        static let gifMaxWidth: Int = 640
        static let webcamSize: CGFloat = 160
    }

    enum HotKeys {
        static let captureArea = "captureArea"
        static let captureWindow = "captureWindow"
        static let captureFullscreen = "captureFullscreen"
        static let captureScrolling = "captureScrolling"
        static let startRecording = "startRecording"
        static let toggleRecording = "toggleRecording"
        static let ocrCapture = "ocrCapture"
    }

    enum UserDefaultsKeys {
        static let saveDirectory = "saveDirectory"
        static let imageFormat = "imageFormat"
        static let copyToClipboard = "copyToClipboard"
        static let playSound = "playSound"
        static let showQuickAccess = "showQuickAccess"
        static let recordingFPS = "recordingFPS"
        static let recordingBitrate = "recordingBitrate"
        static let includeWebcam = "includeWebcam"
        static let recordSystemAudio = "recordSystemAudio"
        static let recordMicrophone = "recordMicrophone"
        static let showMouseClicks = "showMouseClicks"
        static let showKeystrokes = "showKeystrokes"
    }
}
