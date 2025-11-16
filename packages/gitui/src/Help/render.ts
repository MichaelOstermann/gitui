import { $show } from "./$show"
import { box } from "./box"
import { list } from "./list"

export function render() {
    if (!$show()) return
    box.render()
    list.render()
}
