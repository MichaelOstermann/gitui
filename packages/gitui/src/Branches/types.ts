export type LocalBranch = {
    isAhead: boolean
    isBehind: boolean
    isLocal: true
    name: string
    remote: string
    upstream: string
}

export type RemoteBranch = {
    isLocal: false
    name: string
    remote: string
    upstream: string
}

export type Branch =
    | LocalBranch
    | RemoteBranch
