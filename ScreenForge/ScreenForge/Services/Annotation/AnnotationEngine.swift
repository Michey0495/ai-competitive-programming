import AppKit

protocol AnnotationCommand {
    func execute()
    func undo()
}

class AddElementCommand: AnnotationCommand {
    let engine: AnnotationEngine
    let element: AnnotationElement

    init(engine: AnnotationEngine, element: AnnotationElement) {
        self.engine = engine
        self.element = element
    }

    func execute() {
        engine.elements.append(element)
    }

    func undo() {
        engine.elements.removeAll { $0.id == element.id }
    }
}

class RemoveElementCommand: AnnotationCommand {
    let engine: AnnotationEngine
    let element: AnnotationElement
    let index: Int

    init(engine: AnnotationEngine, element: AnnotationElement, index: Int) {
        self.engine = engine
        self.element = element
        self.index = index
    }

    func execute() {
        engine.elements.removeAll { $0.id == element.id }
    }

    func undo() {
        let insertIndex = min(index, engine.elements.count)
        engine.elements.insert(element, at: insertIndex)
    }
}

@MainActor
final class AnnotationEngine: ObservableObject {
    @Published var elements: [AnnotationElement] = []
    @Published var selectedElement: AnnotationElement?
    @Published var currentColor: NSColor = .systemRed
    @Published var currentLineWidth: CGFloat = 3
    @Published var currentTool: AnnotationToolType = .arrow

    private var undoStack: [AnnotationCommand] = []
    private var redoStack: [AnnotationCommand] = []
    private var stepCounter = 0

    enum AnnotationToolType: String, CaseIterable {
        case arrow, rectangle, ellipse, line, text, blur, pixelate, highlight, numberedStep, crop
    }

    func addElement(_ element: AnnotationElement) {
        let cmd = AddElementCommand(engine: self, element: element)
        cmd.execute()
        undoStack.append(cmd)
        redoStack.removeAll()
    }

    func removeElement(_ element: AnnotationElement) {
        guard let index = elements.firstIndex(where: { $0.id == element.id }) else { return }
        let cmd = RemoveElementCommand(engine: self, element: element, index: index)
        cmd.execute()
        undoStack.append(cmd)
        redoStack.removeAll()
    }

    func undo() {
        guard let cmd = undoStack.popLast() else { return }
        cmd.undo()
        redoStack.append(cmd)
    }

    func redo() {
        guard let cmd = redoStack.popLast() else { return }
        cmd.execute()
        undoStack.append(cmd)
    }

    var canUndo: Bool { !undoStack.isEmpty }
    var canRedo: Bool { !redoStack.isEmpty }

    func nextStepNumber() -> Int {
        stepCounter += 1
        return stepCounter
    }

    func clear() {
        elements.removeAll()
        undoStack.removeAll()
        redoStack.removeAll()
        selectedElement = nil
        stepCounter = 0
    }

    func elementAt(point: CGPoint) -> AnnotationElement? {
        elements.reversed().first { $0.hitTest(point: point) }
    }
}
