import { memo } from "@monstermann/signals"
import { WorkingCopy } from "."

export const $unstaged = memo(() => {
    return WorkingCopy.$all().filter(s => !s.isStaged)
})
