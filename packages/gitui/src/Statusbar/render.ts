import type { Text } from "@monstermann/signals-tui"
import { Term, text } from "@monstermann/signals-tui"
import { Statusbar } from "."
import { spinner } from "./spinner"

export function render(): void {
    const line: Text[] = []
    if (spinner.isRunning()) {
        line.push(spinner.text())
        line.push(text(" "))
    }
    if (Statusbar.log()) line.push(text(Statusbar.log()))
    Term.drawLine(Term.height() - 1, 0, line)
}
