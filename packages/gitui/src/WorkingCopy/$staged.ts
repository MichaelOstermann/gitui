import { memo } from "@monstermann/signals"
import { WorkingCopy } from "."

export const $staged = memo(() => {
    return WorkingCopy.$all().filter(s => s.isStaged)
})
