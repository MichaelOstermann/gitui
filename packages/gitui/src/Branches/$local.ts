import type { LocalBranch } from "."
import { signal } from "@monstermann/signals"

export const $local = signal<LocalBranch[]>([])
