import { List, Term } from "@monstermann/signals-tui"
import { Branches } from "./Branches"
import { Commandline } from "./Commandline"
import { Git } from "./Git"
import { Help } from "./Help"
import { History } from "./History"
import { Sidebar } from "./Sidebar"
import { Stashes } from "./Stashes"
import { Statusbar } from "./Statusbar"
import { WorkingCopy } from "./WorkingCopy"

Git.refresh()
Term.onFocus(Git.refresh)
Term.onShortcuts({
    "/": () => {
        Commandline.set("/")
    },
    ":": () => {
        Commandline.set(":")
    },
    "<left>": () => {
        if (WorkingCopy.diff.isFocused()) List.focus(WorkingCopy.list)
        else if (Branches.diff.isFocused()) List.focus(Branches.list)
        else if (History.diff.isFocused()) List.focus(History.list)
        else if (Stashes.diff.isFocused()) List.focus(Stashes.list)
        else if (WorkingCopy.list.isFocused()) List.focus(Sidebar.list)
        else if (Branches.list.isFocused()) List.focus(Sidebar.list)
        else if (History.list.isFocused()) List.focus(Sidebar.list)
        else if (Stashes.list.isFocused()) List.focus(Sidebar.list)
    },
    "<right>": () => {
        if (Sidebar.list.isFocused() && Sidebar.isOnWorkingCopy()) List.focus(WorkingCopy.list)
        else if (Sidebar.list.isFocused() && Sidebar.isOnLocalBranch()) List.focus(Branches.list)
        else if (Sidebar.list.isFocused() && Sidebar.isOnRemoteBranch()) List.focus(Branches.list)
        else if (Sidebar.list.isFocused() && Sidebar.isOnHistory()) List.focus(History.list)
        else if (Sidebar.list.isFocused() && Sidebar.isOnStashes()) List.focus(Stashes.list)
        else if (WorkingCopy.list.isFocused()) List.focus(WorkingCopy.diff)
        else if (Branches.list.isFocused()) List.focus(Branches.diff)
        else if (History.list.isFocused()) List.focus(History.diff)
        else if (Stashes.list.isFocused()) List.focus(Stashes.diff)
    },
    "<s-p>": () => {
        Commandline.set(":git push -u origin --tags")
    },
    "<tab>": () => {
        if (Commandline.input.isFocused()) Commandline.blur()
        else if (Sidebar.list.isFocused() && Sidebar.isOnWorkingCopy()) List.focus(WorkingCopy.list)
        else if (Sidebar.list.isFocused() && Sidebar.isOnLocalBranch()) List.focus(Branches.list)
        else if (Sidebar.list.isFocused() && Sidebar.isOnRemoteBranch()) List.focus(Branches.list)
        else if (Sidebar.list.isFocused() && Sidebar.isOnHistory()) List.focus(History.list)
        else if (Sidebar.list.isFocused() && Sidebar.isOnStashes()) List.focus(Stashes.list)
        else if (WorkingCopy.list.isFocused()) List.focus(WorkingCopy.diff)
        else if (Branches.list.isFocused()) List.focus(Branches.diff)
        else if (History.list.isFocused()) List.focus(History.diff)
        else if (Stashes.list.isFocused()) List.focus(Stashes.diff)
        else List.focus(Sidebar.list)
    },
    "?": () => {
        Help.$show(show => !show)
    },
    "a": () => {
        Commandline.set(":git commit --amend")
    },
    "c": () => {
        Commandline.set(":git commit")
    },
    "f": () => {
        Commandline.set(":git fetch --all")
    },
    "p": () => {
        Commandline.set(":git pull")
    },
    "q": () => {
        Term.exit()
    },
    "r": () => {
        Commandline.set(`:git clean -df && git reset HEAD --hard`)
    },
})

Term.onCtrlC(Term.exit)
Term.onExit(Term.enterAlternateScreen())
Term.onExit(Term.startCapturingInput())
Term.render(() => {
    Sidebar.render()
    WorkingCopy.render()
    History.render()
    Stashes.render()
    Branches.render()
    Commandline.render()
    Statusbar.render()
    Help.render()
})
