import AppKit

@MainActor
final class ShareCoordinator {
    static let shared = ShareCoordinator()

    func share(items: [Any], from view: NSView? = nil) {
        let picker = NSSharingServicePicker(items: items)
        if let view {
            picker.show(relativeTo: view.bounds, of: view, preferredEdge: .minY)
        }
    }

    func shareImage(_ image: NSImage) {
        let picker = NSSharingServicePicker(items: [image])
        if let window = NSApp.keyWindow, let contentView = window.contentView {
            picker.show(relativeTo: contentView.bounds, of: contentView, preferredEdge: .minY)
        }
    }

    func shareFile(_ url: URL) {
        let picker = NSSharingServicePicker(items: [url])
        if let window = NSApp.keyWindow, let contentView = window.contentView {
            picker.show(relativeTo: contentView.bounds, of: contentView, preferredEdge: .minY)
        }
    }

    func shareURL(_ url: URL) {
        let picker = NSSharingServicePicker(items: [url])
        if let window = NSApp.keyWindow, let contentView = window.contentView {
            picker.show(relativeTo: contentView.bounds, of: contentView, preferredEdge: .minY)
        }
    }
}
