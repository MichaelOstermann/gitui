import type { Status } from "."
import { signal } from "@monstermann/signals"

export const $all = signal<Status[]>([])
