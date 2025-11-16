import { effect, memo, watch } from "@monstermann/signals"
import { List } from "@monstermann/signals-tui"
import { Stashes } from "."
import { Diff } from "../Diff"

export const diff = Diff.createList({
    col: memo(() => Stashes.list.right() + 2),
    height: Stashes.list.height,
    lines: memo(() => {
        const diff = Stashes.$diff()
        if (!diff) return []
        return diff.flatMap((file) => {
            return [file, ...file.hunks.flatMap(hunk => [hunk, ...hunk.changes])]
        })
    }),
})

effect(() => {
    const s = Stashes.stash()
    if (!s) return Stashes.$diff(undefined)
    Stashes
        .fetchDiff(s.id)
        .then((diff) => {
            if (Stashes.stash() !== s) return
            Stashes.$diff(diff)
        })
})

watch(
    () => Stashes.stash()?.id,
    () => List.selectFirst(diff),
)
