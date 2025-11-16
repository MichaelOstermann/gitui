import { $ } from "bun"

export async function fetch(): Promise<string[]> {
    return (await $`git tag`.text()).split("\n").filter(line => !!line).reverse()
}
