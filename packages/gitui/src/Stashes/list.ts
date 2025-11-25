import type { Text } from "@monstermann/signals-tui"
import type { Stash } from "."
import { memo } from "@monstermann/signals"
import { Key, Line, List, Table, Term, text } from "@monstermann/signals-tui"
import { Commandline } from "../Commandline"
import { Filter } from "../Filter"
import { Sidebar } from "../Sidebar"
import { Stashes } from "../Stashes"

const table = Table.create({
    col: memo(() => Sidebar.list.right() + 2),
    data: memo<Stash[]>(() => Filter.apply(Stashes.$all(), "message")),
    height: Sidebar.list.height,
    width: memo(() => Term.width() - 80),
    columns: [
        { name: "id", reserved: true },
        { name: "message" },
        { align: "right", name: "timeago" },
    ],
    getBodyCell({ col, data }) {
        return data[col]
    },
    renderBodyCell({ col, content }) {
        if (col === "id") return [text(content, { fg: "magenta" })]
        if (col === "message") return [text(content)]
        if (col === "timeago") return [text(content, { fg: "yellow" })]
        return []
    },
})

export const list = List.create<{ data: Stash, line: Text[] }>({
    col: table.col,
    height: table.height,
    lines: table.lines,
    row: table.row,
    width: table.width,
    onKeypress(event) {
        Key.onShortcuts(event, {
            "<bs>": () => {
                if (Stashes.isOnStash()) {
                    Commandline.set(`:git stash drop stash@{${Stashes.stash()?.id}}`)
                    event.stopPropagation()
                }
            },
            "a": () => {
                if (Stashes.isOnStash()) {
                    Commandline.set(`:git stash apply stash@{${Stashes.stash()?.id}}`)
                    event.stopPropagation()
                }
            },
            "p": () => {
                if (Stashes.isOnStash()) {
                    Commandline.set(`:git stash pop stash@{${Stashes.stash()?.id}}`)
                    event.stopPropagation()
                }
            },
        })
    },
    renderLine({ data, isSelected }) {
        return isSelected
            ? Line.mergeStyle(data.line, { bg: "black" })
            : data.line
    },
})
