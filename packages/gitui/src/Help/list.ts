import { Line, List, text } from "@monstermann/signals-tui"
import { box } from "./box"

export const list = List.create({
    col: box.innerCol,
    height: box.innerHeight,
    row: box.innerRow,
    width: box.innerWidth,
    lines: [
        { title: "Global", type: "header" },
        { desc: "Quit", shortcut: "<c-c>", type: "shortcut" },
        { desc: "Toggle Help", shortcut: "?", type: "shortcut" },
        { desc: "Switch Pane", shortcut: "<tab>", type: "shortcut" },
        { desc: "Filter", shortcut: "/", type: "shortcut" },
        { desc: "Command", shortcut: ":", type: "shortcut" },
        { desc: "Fetch", shortcut: "f", type: "shortcut" },
        { desc: "Push", shortcut: "<s-p>", type: "shortcut" },
        { desc: "Pull", shortcut: "p", type: "shortcut" },
        { desc: "Commit", shortcut: "c", type: "shortcut" },
        { desc: "Amend", shortcut: "a", type: "shortcut" },
        { desc: "Hard Reset", shortcut: "r", type: "shortcut" },
        { type: "empty" },
        { title: "Branch", type: "header" },
        { desc: "Checkout", shortcut: "<cr>", type: "shortcut" },
        { desc: "Merge", shortcut: "m", type: "shortcut" },
        { desc: "Delete", shortcut: "<bs>", type: "shortcut" },
        { type: "empty" },
        { title: "Stash", type: "header" },
        { desc: "Pop", shortcut: "p", type: "shortcut" },
        { desc: "Apply", shortcut: "a", type: "shortcut" },
        { desc: "Drop", shortcut: "<bs>", type: "shortcut" },
        { type: "empty" },
        { title: "File", type: "header" },
        { desc: "Toggle Stage", shortcut: "s", type: "shortcut" },
        { desc: "Toggle Stage", shortcut: "<cr>", type: "shortcut" },
        { desc: "Toggle Stage All", shortcut: "<s-s>", type: "shortcut" },
        { desc: "Discard", shortcut: "<bs>", type: "shortcut" },
        { type: "empty" },
        { title: "Diff", type: "header" },
        { desc: "Toggle Stage", shortcut: "s", type: "shortcut" },
        { desc: "Toggle Stage", shortcut: "<cr>", type: "shortcut" },
        { desc: "Discard", shortcut: "<bs>", type: "shortcut" },
    ] as const,
    renderLine({ data }) {
        if (data.type === "empty") return []
        if (data.type === "header") return [text(data.title, { fg: "blue" })]
        let line = [text(data.shortcut, { fg: "magenta" })]
        const desc = text(data.desc)
        line = Line.fillRight(line, 10)
        line.push(desc)
        return line
    },
})
