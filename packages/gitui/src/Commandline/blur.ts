import { Input } from "@monstermann/signals-tui"
import { Commandline } from "."

export function blur(): void {
    Input.blur(Commandline.input)
}
