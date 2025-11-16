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
            const result: Status[] = []
            const base: Status = {
                isAdded: false,
                isConflict: false,
                isDeleted: false,
                isModified: false,
                isRenamed: false,
                isStaged: false,
                path,
            }

            const isConflict = "ADUU".includes(idx) && "ADUU".includes(wrk)

            if (isConflict) {
                const isDeleted = idx === "D" || wrk === "D"
                const isAdded = idx === "A" || wrk === "A"
                const isModified = idx === "U" || wrk === "U"
                result.push({ ...base, isAdded, isConflict: true, isDeleted, isModified })
            }
            else {
                if (idx === "D") result.push({ ...base, isDeleted: true, isStaged: true })
                if (wrk === "D") result.push({ ...base, isDeleted: true, isStaged: false })
                if (idx === "M") result.push({ ...base, isModified: true, isStaged: true })
                if (wrk === "M") result.push({ ...base, isModified: true, isStaged: false })
                if (idx === "R") result.push({ ...base, isRenamed: true, isStaged: true })
                if (wrk === "R") result.push({ ...base, isRenamed: true, isStaged: false })
                if (idx === "A") result.push({ ...base, isAdded: true, isStaged: true })
                if (wrk === "A") result.push({ ...base, isAdded: true, isStaged: false })
                if (idx === "?" && wrk === "?") result.push({ ...base, isAdded: true, isStaged: false })
            }

            return result
        })

    return status
}
