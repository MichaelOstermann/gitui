import type { Status } from "."
import { WorkingCopy } from "."

export function status(): Status | undefined {
    const line = WorkingCopy.list.selectedLine()
    if (line?.type === "Status") return line.status
    return undefined
}
