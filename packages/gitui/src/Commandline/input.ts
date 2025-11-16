import { effect, memo } from "@monstermann/signals"
import { Input, Key, Term } from "@monstermann/signals-tui"
import { $ } from "bun"
import parse from "yargs-parser"
import { Filter } from "../Filter"
import { Git } from "../Git"
import { Statusbar } from "../Statusbar"

export const input = Input.create({
    row: memo(() => Term.height() - 2),
    onKeypress(event) {
        Key.onShortcuts(event, {
            "<cr>": async () => {
                event.stopPropagation()
                const value = input.value()
                Input.blur(input)

                if (isInteractiveGitCommand(value.slice(1))) {
                    Term.stopCapturingInput()
                    Term.exitAlternateScreen()
                    await Bun.spawn(value.slice(1).split(" "), {
                        stdio: ["inherit", "inherit", "inherit"],
                    }).exited
                    Term.enterAlternateScreen()
                    Term.startCapturingInput()
                }
                else if (value.startsWith(":")) {
                    Statusbar.spinner.start()
                    const out = await $`${{ raw: value.slice(1) }}`.text()
                    await Git.refresh()
                    Statusbar.spinner.stop()
                    Statusbar.log(out.split("\n").join(" "))
                }
            },
            "<esc>": () => {
                event.stopPropagation()
                Input.reset(input)
                Input.blur(input)
            },
        })
    },
})

effect(() => {
    const value = input.value()
    if (!value.startsWith("/")) Filter.$value("")
    else Filter.$value(value.slice(1))
})

function isInteractiveGitCommand(input: string): boolean {
    const parsed = parse(input)
    const tokens = parsed._

    if (tokens[0] !== "git") return false
    const cmd = tokens[1]

    const has = (flag: string) => flag in parsed
    const hasValue = (flag: string) => typeof parsed[flag] === "string" && parsed[flag].length > 0

    const hasInteractiveFlag = has("i") || has("interactive") || has("p") || has("patch")
    const hasSuppressor = has("no-edit") || has("no-message") || hasValue("m") || hasValue("message")

    const editorCommands = new Set<string | number | undefined>(["commit", "merge", "tag", "revert", "rebase", "stash"])
    if (editorCommands.has(cmd)) {
        if (has("i") || has("interactive") || has("edit-todo")) return true
        if (!hasSuppressor) return true
    }

    const alwaysInteractive = [
        ["add", ["-i", "-p"]],
        ["checkout", ["-p"]],
        ["restore", ["-p"]],
        ["stash", ["-p", "-i"]],
        ["clean", ["-i"]],
        ["rebase", ["-i", "--edit-todo"]],
        ["bisect", []],
        ["mergetool", []],
        ["citool", []],
        ["config", ["--edit"]],
    ] as const

    for (const [c, flags] of alwaysInteractive) {
        if (cmd !== c) continue
        if (flags.length === 0) return true
        if (flags.some(f => tokens.includes(f))) return true
    }

    if (hasInteractiveFlag) return true

    return false
}
