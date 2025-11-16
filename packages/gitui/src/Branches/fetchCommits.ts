import type { Branch } from "."
import type { Commit } from "../History"
import { $ } from "bun"

export async function fetchCommits(branch: Branch): Promise<Commit[]> {
    const name = branch.isLocal ? branch.name : branch.upstream
    const result = await $`git log ${name} --pretty="(%h)(%cd)(%an)(%s)" --date=format:"%D %T"`.text()
    return result
        .split("\n")
        .map((line) => {
            const [_, hash, date, author, message] = line.match(/\((.+?)\)\((.+?)\)\((.+?)\)\((.+?)\)/) ?? []
            if (!hash || !date || !author || !message) return undefined
            return { author, date, hash, message }
        })
        .filter(l => !!l)
}
