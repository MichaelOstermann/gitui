import type { Commit } from "."
import { $ } from "bun"

export async function fetch(): Promise<{
    ahead: string[]
    behind: string[]
    commits: Commit[]
}> {
    const result = await $`git log --pretty="(%h)(%cd)(%an)(%s)" --date=format:"%D %T"`.text()
    const ahead = await $`git log --pretty="%h" @{u}..HEAD;`.text()
    const behind = await $`git log --pretty="%h" HEAD..@{u};`.text()

    return {
        ahead: ahead.split("\n").filter(l => !!l),
        behind: behind.split("\n").filter(l => !!l),
        commits: result
            .split("\n")
            .map((line) => {
                const [_, hash, date, author, message] = line.match(/\((.+?)\)\((.+?)\)\((.+?)\)\((.+?)\)/) ?? []
                if (!hash || !date || !author || !message) return undefined
                return { author, date, hash, message }
            })
            .filter(l => !!l),
    }
}
