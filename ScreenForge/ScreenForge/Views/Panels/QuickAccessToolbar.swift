import AppKit
import SwiftUI

final class QuickAccessToolbarWindow: NSWindow {
    var onAction: ((QuickAction) -> Void)?

    enum QuickAction {
        case save
        case copy
        case annotate
        case pin
        case ocr
        case background
        case cloud
        case close
    }

    init() {
        super.init(
            contentRect: NSRect(x: 0, y: 0, width: 400, height: 48),
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )

        level = .floating
        isOpaque = false
        backgroundColor = .clear
        hasShadow = true
        isMovableByWindowBackground = true
        isReleasedWhenClosed = false
    }

    func show(for captureResult: CaptureResult) {
        let view = QuickAccessToolbarView { [weak self] action in
            self?.onAction?(action)
            if action == .close || action == .save || action == .copy {
                self?.orderOut(nil)
            }
        }

        contentView = NSHostingView(rootView: view)

        // Position near the capture area or center of screen
        if let screen = NSScreen.main {
            let x = screen.frame.midX - 200
            let y: CGFloat = 80
            setFrameOrigin(NSPoint(x: x, y: y))
        }

        makeKeyAndOrderFront(nil)

        // Auto-dismiss after 8 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 8) { [weak self] in
            if self?.isVisible == true {
                self?.orderOut(nil)
                self?.onAction?(.close)
            }
        }
    }
}

struct QuickAccessToolbarView: View {
    let onAction: (QuickAccessToolbarWindow.QuickAction) -> Void

    var body: some View {
        HStack(spacing: 2) {
            toolButton(icon: "doc.on.clipboard", label: "Copy", action: .copy)
            toolButton(icon: "square.and.arrow.down", label: "Save", action: .save)
            toolButton(icon: "pencil.tip.crop.circle", label: "Annotate", action: .annotate)
            toolButton(icon: "pin", label: "Pin", action: .pin)
            toolButton(icon: "text.viewfinder", label: "OCR", action: .ocr)
            toolButton(icon: "photo.artframe", label: "BG", action: .background)
            toolButton(icon: "icloud.and.arrow.up", label: "Cloud", action: .cloud)

            Divider()
                .frame(height: 28)
                .padding(.horizontal, 4)

            Button {
                onAction(.close)
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.secondary)
                    .frame(width: 28, height: 28)
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(.ultraThickMaterial)
        .cornerRadius(12)
    }

    private func toolButton(icon: String, label: String, action: QuickAccessToolbarWindow.QuickAction) -> some View {
        Button {
            onAction(action)
        } label: {
            VStack(spacing: 2) {
                Image(systemName: icon)
                    .font(.system(size: 16))
                Text(label)
                    .font(.system(size: 9))
            }
            .frame(width: 44, height: 36)
        }
        .buttonStyle(.plain)
    }
}
