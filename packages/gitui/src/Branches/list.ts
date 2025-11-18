import type { Text } from "@monstermann/signals-tui"
import type { Commit } from "../History"
import { effect, memo, watch } from "@monstermann/signals"
import { Line, List, Table, Term, text } from "@monstermann/signals-tui"
import { Branches } from "."
import { Filter } from "../Filter"
import { History } from "../History"
import { Sidebar } from "../Sidebar"

const table = Table.create({
    col: memo(() => Sidebar.list.right() + 2),
    data: memo<Commit[]>(() => Filter.apply(Branches.$commits(), "message")),
    height: Sidebar.list.height,
    width: memo(() => Term.width() - 80),
    columns: [
        { name: "ahead-behind", reserved: true },
        { name: "hash", reserved: true },
        { name: "message" },
        { align: "right", name: "date" },
        { align: "right", name: "author" },
    ],
    getBodyCell({ col, data }) {
        if (col === "ahead-behind") {
            const isAhead = History.$ahead().includes(data.hash)
            const isBehind = History.$behind().includes(data.hash)
            if (isAhead) return " "
            if (isBehind) return " "
            return ""
        }
        if (col === "author") return authorName(data.author)
        return data[col]
    },
    renderBodyCell({ col, content, data }) {
        if (col === "ahead-behind") {
            const isAhead = History.$ahead().includes(data.hash)
            const isBehind = History.$behind().includes(data.hash)
            if (isAhead) return [text(content, { fg: "green" })]
            if (isBehind) return [text(content, { fg: "red" })]
            return [text(content)]
        }
        if (col === "hash") return [text(content, { fg: "magenta" })]
        if (col === "message") return [text(content)]
        if (col === "date") return [text(content, { fg: "yellow" })]
        if (col === "author") return [text(content, { fg: "cyan" })]
        return []
    },
})

export const list = List.create<{ data: Commit, line: Text[] }>({
    col: table.col,
    height: table.height,
    lines: table.lines,
    row: table.row,
    width: table.width,
    renderLine({ data, isSelected }) {
        return isSelected
            ? Line.mergeStyle(data.line, { bg: "black" })
            : data.line
    },
})

function authorName(name: string): string {
    return (name.match(/[A-Z]/g) ?? []).join("")
}

effect(() => {
    const branch = Sidebar.branch()
    if (!branch) return Branches.$commits([])
    Branches
        .fetchCommits(branch)
        .then((diff) => {
            if (Sidebar.branch() !== branch) return
            Branches.$commits(diff)
        })
})

watch(
    () => Sidebar.branch(),
    () => List.selectFirst(list),
)
