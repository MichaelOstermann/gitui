import type { Status } from "."
import { $ } from "bun"
import { Diff } from "../Diff"

export async function fetchDiff(status: Status): Promise<Diff> {
    let result: string

    if (status.isStaged)
        result = await $`git diff -p --patience --no-color --staged -- ${status.path}`.text()
    else if (status.isAdded && !status.isStaged)
        result = await $`git diff -p --patience --no-color --no-index -- /dev/null ${status.path} || true`.text()
    else if (!status.isStaged)
        result = await $`git diff -p --patience --no-color -- ${status.path}`.text()
    else
        result = await $`git diff -p --patience --no-color ${status.path}`.text()

    return Diff.parse(result)
}
