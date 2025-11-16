import type { RemoteBranch } from "."
import { signal } from "@monstermann/signals"

export const $remote = signal<RemoteBranch[]>([])
