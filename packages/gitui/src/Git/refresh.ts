import { batch } from "@monstermann/signals"
import { Git } from "."
import { Branches } from "../Branches"
import { History } from "../History"
import { Stashes } from "../Stashes"
import { Tags } from "../Tags"
import { WorkingCopy } from "../WorkingCopy"

export async function refresh(): Promise<void> {
    return Git.queue.add(async () => {
        const [branches, history, status, tags, stashes] = await Promise.all([
            Branches.fetch(),
            History.fetch(),
            WorkingCopy.fetch(),
            Tags.fetch(),
            Stashes.fetch(),
        ])

        batch(() => {
            Branches.$local(branches.local)
            Branches.$remote(branches.remote)
            Branches.$current(branches.current)
            History.$commits(history.commits)
            History.$ahead(history.ahead)
            History.$behind(history.behind)
            WorkingCopy.$all(status)
            Tags.$all(tags)
            Stashes.$all(stashes)
        })
    })
}
