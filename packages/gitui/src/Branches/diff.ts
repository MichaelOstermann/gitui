import { effect, memo, watch } from "@monstermann/signals"
import { List } from "@monstermann/signals-tui"
import { Branches } from "."
import { Diff } from "../Diff"

export const diff = Diff.createList({
    col: memo(() => Branches.list.right() + 2),
    height: Branches.list.height,
    lines: memo(() => {
        const diff = Branches.$diff()
        if (!diff) return []
        return diff.flatMap((file) => {
            return [file, ...file.hunks.flatMap(hunk => [hunk, ...hunk.changes])]
        })
    }),
})

effect(() => {
    const c = Branches.commit()
    if (!c) return Branches.$diff(undefined)
    Branches
        .fetchDiff(c)
        .then((diff) => {
            if (Branches.commit() !== c) return
            Branches.$diff(diff)
        })
})

watch(
    () => Branches.commit(),
    () => List.selectFirst(diff),
)
