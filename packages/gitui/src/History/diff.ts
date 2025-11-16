import { effect, memo, watch } from "@monstermann/signals"
import { List } from "@monstermann/signals-tui"
import { History } from "."
import { Diff } from "../Diff"

export const diff = Diff.createList({
    col: memo(() => History.list.right() + 2),
    height: History.list.height,
    lines: memo(() => {
        const diff = History.$diff()
        if (!diff) return []
        return diff.flatMap((file) => {
            return [file, ...file.hunks.flatMap(hunk => [hunk, ...hunk.changes])]
        })
    }),
})

effect(() => {
    const c = History.commit()
    if (!c) return History.$diff(undefined)
    History
        .fetchDiff(c)
        .then((diff) => {
            if (History.commit() !== c) return
            History.$diff(diff)
        })
})

watch(
    () => History.commit(),
    () => List.selectFirst(diff),
)
