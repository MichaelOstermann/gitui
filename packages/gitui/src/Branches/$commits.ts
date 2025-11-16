import type { Commit } from "../History"
import { signal } from "@monstermann/signals"

export const $commits = signal<Commit[]>([])
