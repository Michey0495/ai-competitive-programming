import Foundation

protocol CloudServiceProtocol {
    func upload(fileURL: URL) async throws -> CloudUploadResult
    func delete(deleteURL: URL) async throws
    var isConfigured: Bool { get }
}
