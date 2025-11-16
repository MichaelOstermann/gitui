import type { ListOptions, Text } from "@monstermann/signals-tui"
import type { DiffFile, DiffHunk, DiffLine } from "."
import { Line, List, text } from "@monstermann/signals-tui"
import { Diff } from "."

export function createList<T extends DiffFile | DiffHunk | DiffLine>(
    options: Omit<ListOptions<T>, "renderLine">,
): List<T> {
    return List.create({
        ...options,
        renderLine({ data, isSelected, list }) {
            let line: Text[] = []

            if (data.type === "hunk") {
                line.push(text(data.content, { fg: "yellow" }))
            }

            else if (data.type === "addition") {
                line.push(text(data.content.slice(1), { fg: "green" }))
            }

            else if (data.type === "deletion") {
                line.push(text(data.content.slice(1), { fg: "red" }))
            }

            else if (data.type === "file") {
                const file = Diff.parseFile(data)
                if (file.from === file.to) line.push(text(file.to || "", { fg: "blue" }))
                else line.push(text(`${file.from} -> ${file.to}`, { fg: "blue" }))
            }

            else {
                line.push(text(data.content.slice(1)))
            }

            line = Line.fillRight(line, list.width())

            if (isSelected) line = Line.mergeStyle(line, { bg: "black" })

            return line
        },
    })
}
