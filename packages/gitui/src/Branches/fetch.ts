import type { LocalBranch, RemoteBranch } from "."
import { $ } from "bun"

export async function fetch(): Promise<{ current: string, local: LocalBranch[], remote: RemoteBranch[] }> {
    const localStr = await $`git for-each-ref --format="%(refname:short) %(upstream:short) %(upstream:trackshort)" refs/heads`.text()
    const remoteStr = await $`git for-each-ref --format="%(refname:short)" refs/remotes`.text()
    const currentStr = await $`git symbolic-ref --short HEAD`.text()

    const local = localStr
        .split("\n")
        .filter(line => !!line)
        .map<LocalBranch>((line) => {
            const [refname, upstream, trackshort] = line.split(" ") as [string, string, string]
            return {
                isAhead: trackshort === ">" || trackshort === "<>",
                isBehind: trackshort === "<" || trackshort === "<>",
                isLocal: true,
                name: refname,
                remote: upstream.split("/")[0] || "",
                upstream: upstream || "",
            }
        })

    const remote = remoteStr
        .split("\n")
        .filter(line => !!line)
        .map<RemoteBranch>((upstream) => {
            const [remote, name] = upstream.split("/") as [string, string]
            return {
                isLocal: false,
                name,
                remote,
                upstream,
            }
        })
        .filter(branch => !!branch.name)

    const current = currentStr.trim()

    return {
        current,
        local,
        remote,
    }
}
