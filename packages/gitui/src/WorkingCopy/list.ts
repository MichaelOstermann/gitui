import type { Text } from "@monstermann/signals-tui"
import type { Status } from "."
import { memo } from "@monstermann/signals"
import { Key, Line, List, Str, Term, text } from "@monstermann/signals-tui"
import { WorkingCopy } from "."
import { Commandline } from "../Commandline"
import { Filter } from "../Filter"
import { Git } from "../Git"
import { Sidebar } from "../Sidebar"

type ListViewItem =
    | { isSelectable: boolean, title: string, type: "Section" }
    | { status: Status, type: "Status" }

const iconSize = 3
const maxWidth = memo(() => Term.width() - 80)
const width = memo(() => WorkingCopy.$all().reduce((acc, status) => {
    return Math.max(acc, Str.width(status.path) + iconSize)
}, 0))

export const list = List.create<ListViewItem>({
    col: memo(() => Sidebar.list.right() + 2),
    height: Sidebar.list.height,
    width: memo(() => Math.min(width(), maxWidth())),
    lines: memo(() => {
        const list: ListViewItem[] = []

        list.push({ isSelectable: false, title: "Unstaged", type: "Section" })
        for (const status of Filter.apply(WorkingCopy.$unstaged(), "path"))
            list.push({ status, type: "Status" })

        list.push({ isSelectable: false, title: "Staged", type: "Section" })
        for (const status of Filter.apply(WorkingCopy.$staged(), "path"))
            list.push({ status, type: "Status" })

        return list
    }),
    async onKeypress(event) {
        const line = list.selectedLine()
        if (line?.type !== "Status") return
        Key.onShortcuts(event, {
            "<bs>": () => {
                if (WorkingCopy.isOnStatus()) {
                    const s = WorkingCopy.status()!
                    const cmd = (() => {
                        if (s.isConflict) return `git restore --source=HEAD -- ${s.path}`
                        else if (s.isModified && s.isStaged) return `git restore --staged --worktree --source=HEAD -- ${s.path}`
                        else if (s.isModified && !s.isStaged) return `git restore --source=HEAD -- ${s.path}`
                        else if (s.isAdded && s.isStaged) return `git rm -f -- ${s.path}`
                        else if (s.isAdded && !s.isStaged) return `trash ${s.path}`
                        else if (s.isDeleted && s.isStaged) return `git restore --staged --worktree --source=HEAD -- ${s.path}`
                        else if (s.isDeleted && !s.isStaged) return `git restore --source=HEAD -- ${s.path}`
                        return undefined
                    })()
                    if (cmd) {
                        Commandline.set(`:${cmd}`)
                        event.stopPropagation()
                    }
                }
            },
            "<cr>": () => {
                event.stopPropagation()
                WorkingCopy.toggle(line.status)
                Git.refresh()
            },
            "<s-s>": () => {
                event.stopPropagation()
                const cmd = WorkingCopy.$unstaged().length
                    ? ":git add -A"
                    : ":git reset"
                Commandline.set(cmd)
            },
            "s": () => {
                event.stopPropagation()
                WorkingCopy.toggle(line.status)
                Git.refresh()
            },
        })
    },
    renderLine({ data, isSelected, list }) {
        const width = list.width()
        let line: Text[] = []

        if (data.type === "Section") {
            line.push(text(data.title, { fg: "blue" }))
            line = Line.fillRight(line, width)
            line = Line.truncateLeft(line, width)
        }

        else if (data.type === "Status") {
            const status = data.status
            line.push(text(status.path))
            line = Line.fillRight(line, width - iconSize)
            line = Line.truncateLeft(line, width - iconSize)
            if (status.isConflict) line.unshift(text("  "))
            else if (status.isAdded) line.unshift(text("  ", { fg: "green" }))
            else if (status.isModified) line.unshift(text("  ", { fg: "yellow" }))
            else if (status.isDeleted) line.unshift(text("  ", { fg: "red" }))
            else if (status.isRenamed) line.unshift(text("  ", { fg: "cyan" }))
            if (status.isConflict) line = Line.mergeStyle(line, { fg: "red" })
        }

        if (isSelected) line = Line.mergeStyle(line, { bg: "black" })

        return line
    },
})
