import { Stashes } from "."

export function isOnStash(): boolean {
    return !!Stashes.list.selectedLine()
}
