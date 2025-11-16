import type { Commit } from "."
import { signal } from "@monstermann/signals"

export const $commits = signal<Commit[]>([])
