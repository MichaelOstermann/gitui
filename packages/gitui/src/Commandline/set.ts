import { batch } from "@monstermann/signals"
import { Input } from "@monstermann/signals-tui"
import { Commandline } from "."

export function set(text: string): void {
    batch(() => {
        Input.set(Commandline.input, text)
        Input.focus(Commandline.input)
    })
}
