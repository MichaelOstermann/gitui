import type { Diff } from "../Diff"
import { signal } from "@monstermann/signals"

export const $diff = signal<Diff>()
