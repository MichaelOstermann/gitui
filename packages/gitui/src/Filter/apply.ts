import fuzzysort from "fuzzysort"
import { Filter } from "."

export function apply<T extends PropertyKey, U extends Record<T, string>>(list: U[], key: T): U[] {
    const filter = Filter.$value()
    if (!filter) return list
    return list
        .map(s => ({
            s,
            score: fuzzysort.single(filter, s[key])?.score ?? 0,
        }))
        .filter(v => v.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(v => v.s)
}
