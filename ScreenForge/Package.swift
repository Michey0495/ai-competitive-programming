// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "ScreenForge",
    platforms: [.macOS(.v14)],
    dependencies: [
        .package(url: "https://github.com/soffes/HotKey.git", from: "0.2.0"),
        .package(url: "https://github.com/sindresorhus/KeyboardShortcuts.git", from: "2.0.0"),
    ],
    targets: [
        .executableTarget(
            name: "ScreenForge",
            dependencies: ["HotKey", "KeyboardShortcuts"],
            path: "ScreenForge"
        ),
    ]
)
