import Carbon
import AppKit

@MainActor
final class HotKeyManager {
    private var hotKeyRefs: [EventHotKeyRef] = []
    private let captureCoordinator: CaptureCoordinator
    private let recordingCoordinator: RecordingCoordinator

    private static var sharedInstance: HotKeyManager?

    init(captureCoordinator: CaptureCoordinator, recordingCoordinator: RecordingCoordinator) {
        self.captureCoordinator = captureCoordinator
        self.recordingCoordinator = recordingCoordinator
        Self.sharedInstance = self
    }

    func registerDefaults() {
        // Cmd+Shift+4: Area capture
        registerHotKey(keyCode: UInt32(kVK_ANSI_4), modifiers: UInt32(cmdKey | shiftKey), id: 1)
        // Cmd+Shift+5: Window capture
        registerHotKey(keyCode: UInt32(kVK_ANSI_5), modifiers: UInt32(cmdKey | shiftKey), id: 2)
        // Cmd+Shift+6: Fullscreen capture
        registerHotKey(keyCode: UInt32(kVK_ANSI_6), modifiers: UInt32(cmdKey | shiftKey), id: 3)
        // Cmd+Shift+R: Toggle recording
        registerHotKey(keyCode: UInt32(kVK_ANSI_R), modifiers: UInt32(cmdKey | shiftKey), id: 4)

        installEventHandler()
    }

    private func registerHotKey(keyCode: UInt32, modifiers: UInt32, id: UInt32) {
        var hotKeyRef: EventHotKeyRef?
        let hotKeyID = EventHotKeyID(signature: OSType(0x5346), // "SF"
                                      id: id)

        let status = RegisterEventHotKey(keyCode, modifiers, hotKeyID,
                                          GetApplicationEventTarget(), 0, &hotKeyRef)

        if status == noErr, let ref = hotKeyRef {
            hotKeyRefs.append(ref)
        }
    }

    private func installEventHandler() {
        var eventType = EventTypeSpec(eventClass: OSType(kEventClassKeyboard),
                                      eventKind: UInt32(kEventHotKeyPressed))

        InstallEventHandler(GetApplicationEventTarget(), { _, event, _ -> OSStatus in
            var hotKeyID = EventHotKeyID()
            GetEventParameter(event, EventParamName(kEventParamDirectObject),
                            EventParamType(typeEventHotKeyID), nil,
                            MemoryLayout<EventHotKeyID>.size, nil, &hotKeyID)

            Task { @MainActor in
                HotKeyManager.sharedInstance?.handleHotKey(id: hotKeyID.id)
            }

            return noErr
        }, 1, &eventType, nil, nil)
    }

    private func handleHotKey(id: UInt32) {
        switch id {
        case 1: captureCoordinator.startCapture(mode: .area)
        case 2: captureCoordinator.startCapture(mode: .window)
        case 3: captureCoordinator.startCapture(mode: .fullscreen)
        case 4:
            if recordingCoordinator.isRecording {
                recordingCoordinator.stopRecording()
            } else {
                recordingCoordinator.startRecording(mode: .mp4)
            }
        default: break
        }
    }

    func unregisterAll() {
        for ref in hotKeyRefs {
            UnregisterEventHotKey(ref)
        }
        hotKeyRefs.removeAll()
    }

    deinit {
        // Cannot call unregisterAll() here due to MainActor isolation
    }
}
