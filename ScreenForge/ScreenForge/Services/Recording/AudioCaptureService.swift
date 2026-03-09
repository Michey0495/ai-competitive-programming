import AVFoundation

final class AudioCaptureService {
    var isSystemAudioEnabled = true
    var isMicrophoneEnabled = false

    func configureAudio(for config: inout [String: Any]) {
        if isMicrophoneEnabled {
            config[AVFormatIDKey] = kAudioFormatMPEG4AAC
            config[AVSampleRateKey] = 48000
            config[AVNumberOfChannelsKey] = 2
            config[AVEncoderBitRateKey] = 128000
        }
    }
}
