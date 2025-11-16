import { effect, memo, watch } from "@monstermann/signals"
import { Key, List } from "@monstermann/signals-tui"
import { WorkingCopy } from "."
import { Diff } from "../Diff"
import { Git } from "../Git"

export const diff = Diff.createList({
    col: memo(() => WorkingCopy.list.right() + 2),
    height: WorkingCopy.list.height,
    lines: memo(() => {
        const diff = WorkingCopy.$diff()
        if (!diff) return []
        return diff.flatMap((file) => {
            return file.hunks.flatMap(hunk => [hunk, ...hunk.changes])
        })
    }),
    onKeypress(event) {
        const status = WorkingCopy.status()
        const d = diff.selectedLine()
        if (!d || !status) return
        Key.onShortcuts(event, {
            "<bs>": async () => {
                event.stopPropagation()
                // TODO confirm
                await Diff.discard(d, status)
                await Git.refresh()
            },
            "<cr>": async () => {
                event.stopPropagation()
                await Diff.toggle(d, status)
                await Git.refresh()
            },
            "s": async () => {
                event.stopPropagation()
                await Diff.toggle(d, status)
                await Git.refresh()
            },
        })
    },
})

effect(() => {
    const status = WorkingCopy.status()
    if (!status) return WorkingCopy.$diff(undefined)
    WorkingCopy
        .fetchDiff(status)
        .then((diff) => {
            if (WorkingCopy.status() !== status) return
            WorkingCopy.$diff(diff)
        })
})

watch(
    () => WorkingCopy.status()?.path,
    () => List.selectFirst(diff),
)
