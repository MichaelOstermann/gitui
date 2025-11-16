import type { Status } from "."
import { $ } from "bun"
import { Git } from "../Git"

export async function toggle(status: Status): Promise<void> {
    if (status.isConflict) return
    return Git.queue.add(async () => {
        if (status.isStaged) await $`git restore --staged ${status.path}`.quiet()
        else await $`git add ${status.path}`.quiet()
    })
}
