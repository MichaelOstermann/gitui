import type { Branch } from "."
import type { Commit } from "../History"
import { $ } from "bun"

export async function fetchCommits(branch: Branch): Promise<Commit[]> {
    const name = branch.isLocal ? branch.name : branch.upstream

    // For local branches with upstream, also fetch unpulled commits
    if (branch.isLocal && branch.upstream) {
        // Fetch commits from both local branch and upstream using merge-base
        // This shows all commits reachable from either branch
        const result = await $`git log ${name} ${branch.upstream} --pretty="(%h)(%cd)(%an)(%s)" --date=format:"%D %T"`.text()
        return result
            .split("\n")
            .map((line) => {
                const [_, hash, date, author, message] = line.match(/\((.+)\)\((.+)\)\((.+)\)\((.+)\)/) ?? []
                if (!hash || !date || !author || !message) return undefined
                return { author, date, hash, message }
            })
            .filter(l => !!l)
    }

    // For remote branches or local branches without upstream, use the original logic
    const result = await $`git log ${name} --pretty="(%h)(%cd)(%an)(%s)" --date=format:"%D %T"`.text()
    return result
        .split("\n")
        .map((line) => {
            const [_, hash, date, author, message] = line.match(/\((.+)\)\((.+)\)\((.+)\)\((.+)\)/) ?? []
            if (!hash || !date || !author || !message) return undefined
            return { author, date, hash, message }
        })
        .filter(l => !!l)
}
