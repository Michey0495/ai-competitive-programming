import AppKit

final class FileOutputService {
    static let shared = FileOutputService()

    var outputDirectory: URL {
        let dir = UserDefaults.standard.url(forKey: AppConstants.UserDefaultsKeys.saveDirectory)
            ?? AppConstants.Defaults.saveDirectory
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir
    }

    var imageFormat: String {
        UserDefaults.standard.string(forKey: AppConstants.UserDefaultsKeys.imageFormat)
            ?? AppConstants.Defaults.imageFormat
    }

    func save(image: CGImage, format: String? = nil) throws -> URL {
        let fmt = format ?? imageFormat
        let fileName = "ScreenForge_\(Self.dateFormatter.string(from: Date())).\(fmt)"
        let url = outputDirectory.appendingPathComponent(fileName)

        guard let data = imageData(from: image, format: fmt) else {
            throw NSError(domain: "ScreenForge", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to create image data"])
        }

        try data.write(to: url)
        return url
    }

    func save(nsImage: NSImage, format: String? = nil) throws -> URL {
        guard let cgImage = nsImage.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
            throw NSError(domain: "ScreenForge", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to convert NSImage"])
        }
        return try save(image: cgImage, format: format)
    }

    private func imageData(from cgImage: CGImage, format: String) -> Data? {
        let nsImage = NSImage(cgImage: cgImage, size: NSSize(width: cgImage.width, height: cgImage.height))
        guard let tiffData = nsImage.tiffRepresentation,
              let bitmap = NSBitmapImageRep(data: tiffData) else { return nil }

        switch format.lowercased() {
        case "png":
            return bitmap.representation(using: .png, properties: [:])
        case "jpg", "jpeg":
            return bitmap.representation(using: .jpeg, properties: [.compressionFactor: AppConstants.Defaults.jpegQuality])
        case "tiff":
            return bitmap.representation(using: .tiff, properties: [:])
        default:
            return bitmap.representation(using: .png, properties: [:])
        }
    }

    private static let dateFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd_HH-mm-ss"
        return f
    }()
}
