import type { Status } from "."
import { $ } from "bun"

export async function fetch(): Promise<Status[]> {
    const result = await $`git status --short --untracked`.text()

    const status = result
        .split("\n")
        .filter(line => !!line)
        .flatMap((line) => {
            const idx = line[0] as string
            const wrk = line[1] as string
            const path = line.slice(3)
            const [oldPath, newPath] = path.split(" -> ")
            const result: Status[] = []
            const base: Status = {
                isAdded: false,
                isConflict: false,
                isDeleted: false,
                isModified: false,
                isRenamed: false,
                isStaged: false,
                newPath: newPath || path,
                oldPath: oldPath || path,
                path: newPath || path,
            }

            if (idx === "D" && wrk === "D") {
                result.push({ ...base, isConflict: true, isDeleted: true })
            }
            else if (idx === "A" && wrk === "U") {
                result.push({ ...base, isAdded: true, isConflict: true })
            }
            else if (idx === "U" && wrk === "A") {
                result.push({ ...base, isConflict: true, isDeleted: true })
            }
            else if (idx === "D" && wrk === "U") {
                result.push({ ...base, isConflict: true, isDeleted: true })
            }
            else if (idx === "U" && wrk === "D") {
                result.push({ ...base, isConflict: true, isModified: true })
            }
            else if (idx === "A" && wrk === "A") {
                result.push({ ...base, isAdded: true, isConflict: true })
            }
            else if (idx === "U" && wrk === "U") {
                result.push({ ...base, isConflict: true, isModified: true })
            }
            else {
                if (idx === "D") result.push({ ...base, isDeleted: true, isStaged: true })
                if (wrk === "D") result.push({ ...base, isDeleted: true })
                if (idx === "M") result.push({ ...base, isModified: true, isStaged: true })
                if (wrk === "M") result.push({ ...base, isModified: true })
                if (idx === "R") result.push({ ...base, isRenamed: true, isStaged: true })
                if (wrk === "R") result.push({ ...base, isRenamed: true })
                if (idx === "A") result.push({ ...base, isAdded: true, isStaged: true })
                if (wrk === "A") result.push({ ...base, isAdded: true })
                if (idx === "?" && wrk === "?") result.push({ ...base, isAdded: true })
            }

            return result
        })

    return status
}
