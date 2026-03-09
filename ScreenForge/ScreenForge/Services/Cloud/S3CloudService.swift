import Foundation

final class S3CloudService: CloudServiceProtocol {
    var endpoint: String = ""
    var bucket: String = ""
    var accessKey: String = ""
    var secretKey: String = ""
    var region: String = "us-east-1"

    var isConfigured: Bool {
        !endpoint.isEmpty && !bucket.isEmpty && !accessKey.isEmpty && !secretKey.isEmpty
    }

    func upload(fileURL: URL) async throws -> CloudUploadResult {
        guard isConfigured else {
            throw NSError(domain: "ScreenForge", code: -1, userInfo: [NSLocalizedDescriptionKey: "S3 not configured"])
        }

        let data = try Data(contentsOf: fileURL)
        let key = "\(UUID().uuidString)/\(fileURL.lastPathComponent)"
        let urlString = "\(endpoint)/\(bucket)/\(key)"

        guard let url = URL(string: urlString) else {
            throw NSError(domain: "ScreenForge", code: -2, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])
        }

        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.httpBody = data
        request.setValue("application/octet-stream", forHTTPHeaderField: "Content-Type")

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw NSError(domain: "ScreenForge", code: -3, userInfo: [NSLocalizedDescriptionKey: "Upload failed"])
        }

        let publicURL = URL(string: "\(endpoint)/\(bucket)/\(key)")!
        return CloudUploadResult(publicURL: publicURL, deleteURL: url, expiresAt: nil)
    }

    func delete(deleteURL: URL) async throws {
        var request = URLRequest(url: deleteURL)
        request.httpMethod = "DELETE"
        let _ = try await URLSession.shared.data(for: request)
    }
}
