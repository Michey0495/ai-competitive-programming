import Foundation

struct HistoryItem: Identifiable, Codable {
    let id: UUID
    let fileURL: URL
    let thumbnailURL: URL?
    let type: ItemType
    let timestamp: Date
    let pixelSize: CGSize?
    let duration: TimeInterval?

    enum ItemType: String, Codable {
        case screenshot
        case recording
        case gif
    }

    init(fileURL: URL, thumbnailURL: URL? = nil, type: ItemType, pixelSize: CGSize? = nil, duration: TimeInterval? = nil) {
        self.id = UUID()
        self.fileURL = fileURL
        self.thumbnailURL = thumbnailURL
        self.type = type
        self.timestamp = Date()
        self.pixelSize = pixelSize
        self.duration = duration
    }
}
