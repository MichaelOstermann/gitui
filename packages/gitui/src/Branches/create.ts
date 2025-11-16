import { $ } from "bun"

export function create(name: string): $.ShellPromise {
    return $`git checkout -b ${name}`.quiet()
}
