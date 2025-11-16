import { memo } from "@monstermann/signals"
import { Box, Term } from "@monstermann/signals-tui"

export const box = Box.create({
    col: memo(() => Term.width() - 34),
    height: 35,
    row: memo(() => Term.height() - 35),
    width: 34,
})
