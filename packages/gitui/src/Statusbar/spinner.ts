import { Spinner } from "@monstermann/signals-tui"

export const spinner = Spinner.create({
    ...Spinner.line,
    style: { fg: "magenta" },
})
