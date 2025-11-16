import type { Stash } from "."
import { signal } from "@monstermann/signals"

export const $all = signal<Stash[]>([])
