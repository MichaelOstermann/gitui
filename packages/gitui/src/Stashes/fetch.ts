import type { Stash } from "."
import { $ } from "bun"

export async function fetch(): Promise<Stash[]> {
    const result = await $`git stash list --pretty="(%gd)(%cr)(%s)"`.text()
    const stashes = result
        .split("\n")
        .map((line) => {
            const [_, id, timeago, message] = line.match(/\(stash@\{(.+?)\}\)\((.+?)\)\((.+?)\)/) ?? []
            if (!id || !timeago || !message) return undefined
            return { id, message, timeago }
        })
        .filter(l => !!l)
    return stashes
}
