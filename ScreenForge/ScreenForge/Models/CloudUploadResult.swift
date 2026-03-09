import Foundation

struct CloudUploadResult {
    let publicURL: URL
    let deleteURL: URL?
    let expiresAt: Date?
}
