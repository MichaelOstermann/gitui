import type { LocalBranch, RemoteBranch } from "../Branches"
import { memo } from "@monstermann/signals"
import { Key, Line, List, Term, Text, text } from "@monstermann/signals-tui"
import { Sidebar } from "."
import { Branches } from "../Branches"
import { Commandline } from "../Commandline"
import { History } from "../History"
import { Stashes } from "../Stashes"
import { Tags } from "../Tags"
import { WorkingCopy } from "../WorkingCopy"

type ListViewItem =
    | { isSelectable: boolean, title: string, type: "Section" }
    | { type: "WorkingCopy" }
    | { type: "History" }
    | { type: "Stashes" }
    | { branch: LocalBranch, type: "LocalBranch" }
    | { branch: RemoteBranch, type: "RemoteBranch" }
    | { tag: string, type: "Tag" }

export const list = List.create<ListViewItem>({
    height: memo(() => Term.height() - 3),
    width: 25,
    lines: memo(() => {
        const list: ListViewItem[] = []

        list.push({ isSelectable: false, title: "Workspace", type: "Section" })
        list.push({ type: "WorkingCopy" })
        list.push({ type: "History" })
        list.push({ type: "Stashes" })

        list.push({ isSelectable: false, title: "Branches", type: "Section" })
        for (const branch of Branches.$local())
            list.push({ branch, type: "LocalBranch" })

        list.push({ isSelectable: false, title: "Remotes", type: "Section" })
        for (const branch of Branches.$remote())
            list.push({ branch, type: "RemoteBranch" })

        list.push({ isSelectable: false, title: "Tags", type: "Section" })
        for (const tag of Tags.$all())
            list.push({ tag, type: "Tag" })

        return list
    }),
    onKeypress(event) {
        Key.onShortcuts(event, {
            "<bs>": () => {
                if (Sidebar.isOnLocalBranch()) {
                    Commandline.set(`:git branch --delete --force ${Sidebar.branch()?.name}`)
                    event.stopPropagation()
                }

                if (Sidebar.isOnRemoteBranch()) {
                    Commandline.set(`:git push --delete ${Sidebar.branch()?.remote} ${Sidebar.branch()?.name}`)
                    event.stopPropagation()
                }
            },
            "<cr>": () => {
                if (Sidebar.isOnLocalBranch()) {
                    Commandline.set(`:git checkout ${Sidebar.branch()?.name}`)
                    event.stopPropagation()
                }

                if (Sidebar.isOnRemoteBranch()) {
                    Commandline.set(`:git checkout --track ${Sidebar.branch()?.upstream}`)
                    event.stopPropagation()
                }
            },
            "m": () => {
                if (Sidebar.isOnLocalBranch()) {
                    Commandline.set(`:git merge ${Sidebar.branch()?.name}`)
                    event.stopPropagation()
                }

                if (Sidebar.isOnRemoteBranch()) {
                    Commandline.set(`:git merge ${Sidebar.branch()?.upstream}`)
                    event.stopPropagation()
                }
            },
        })
    },
    renderLine({ data, isSelected, list }) {
        const width = list.width()
        let line: Text[] = []

        if (data.type === "Section") {
            line.push(text(data.title, { fg: "blue" }))
            line = Line.fillRight(line, width)
            line = Line.truncateRight(line, width)
        }

        else if (data.type === "WorkingCopy") {
            const unstagedCount = new Set(WorkingCopy.$unstaged().map(s => s.path)).size
            const stagedCount = new Set(WorkingCopy.$staged().map(s => s.path)).size
            const hasCount = unstagedCount || stagedCount
            const suffix = hasCount ? text(`${unstagedCount}/${stagedCount}`, { fg: "yellow" }) : text("")
            const suffixWidth = Text.width(suffix)
            line.push(text("Working Copy", { fg: hasCount ? "yellow" : undefined }))
            line = Line.fillRight(line, width - suffixWidth)
            line = Line.truncateRight(line, width - suffixWidth)
            line.push(suffix)
        }

        else if (data.type === "History") {
            const count = History.$commits().length
            const suffix = count ? text(count) : text("")
            const suffixWidth = Text.width(suffix)
            line.push(text("History"))
            line = Line.fillRight(line, width - suffixWidth)
            line = Line.truncateRight(line, width - suffixWidth)
            line.push(suffix)
        }

        else if (data.type === "Stashes") {
            const count = Stashes.$all().length
            const suffix = count ? text(count) : text("")
            const suffixWidth = Text.width(suffix)
            line.push(text("Stashes"))
            line = Line.fillRight(line, width - suffixWidth)
            line = Line.truncateRight(line, width - suffixWidth)
            line.push(suffix)
        }

        else if (data.type === "LocalBranch") {
            const branch = data.branch
            const isCurrent = branch.name === Branches.$current()
            const iconSize = (branch.isAhead ? 2 : 0) + (branch.isBehind ? 2 : 0)
            line.push(text(branch.name, { fg: isCurrent ? "cyan" : undefined }))
            line = Line.fillRight(line, width - iconSize)
            line = Line.truncateRight(line, width - iconSize)
            if (branch.isAhead) line.push(text(" ", { fg: "green" }))
            if (branch.isBehind) line.push(text(" ", { fg: "red" }))
        }

        else if (data.type === "RemoteBranch") {
            line.push(text(data.branch.upstream))
            line = Line.fillRight(line, width)
            line = Line.truncateRight(line, width)
        }

        else if (data.type === "Tag") {
            line.push(text(data.tag))
            line = Line.fillRight(line, width)
            line = Line.truncateRight(line, width)
        }

        if (isSelected) line = Line.mergeStyle(line, { bg: "black" })

        return line
    },
})
