---
title: Beyond Merge
date: "2019-05-01T16:31:03.284Z"
language: "en"
---

Everyone who has spent some time working with git irremediably knows about 
merging. Suppose we have a branch called A coming from master. The merge 
command brings the changes carried in A into master.

```bash
71a621b (HEAD -> master) (A) A file updated
2dc6065 (A) new A file
76a1097 Demo file updated
a31e004 README updated
44d4c5b New README file
ee42779 New demo file
```

It does works fine, changes are placed ahead in the master branch.

```bash
1———2———3———A1———A2
```

The log reflects an incremental order of commits, or put in other words, 
the commits are shown in the same order were added. A timeline of changes.

When these modifications have happened at the same time in a B branch, which 
is not as rarely as it seems, the merge strategy cannot do a fast-forward 
update (bring changes ahead).

```bash
057a856 (HEAD -> master) Merge branch 'B'
71a621b (A) A file updated
1ac6aff (B) B file updated
2dc6065 (A) new A file
d657116 (B) new B file
76a1097 Demo file updated
a31e004 README updated
44d4c5b New README file
ee42779 New demo file
```

Because changes did happened in the same time frame, the merge command makes 
use of a recursive strategy interlacing A and B commits.

```bash
1———2———3———B1———A1———B2———A2
```

Interlaced commits don’t keep proper track of branching blocks. There is a way 
to prevent this scenario once a feature is completed. Instead of merging the 
whole bunch of commits, a better option is pushing the changes into master (or 
develop) as a unique commit with a descriptive message. This approach improves 
readability and traceability of the git log.

Perhaps for personal or one-man sized projects is not too important (it is better 
to keep at good habits, though) having a strict sorted timeline of events. But 
when comes to big teams where each feature needs to be perfectly isolated and 
tagged an unsorted log history would make the difference between mayhem and 
harmony.

For those newbies in git (and whose did not find much time to dive into) 
there’s more than only merging. Let’s go beyond merge.

## Rebase

Unlike merge, rebase allows to do the merge based on a feature branch keeping 
track of those related commits blocks in the same slot.

```bash
1———2———3———A1———A2———B1———A2
```

While the origin branch’s history 
keeps linear, the new feature commits are placed just ahead, maintaining a 
more coherent log.

A convenient way to prevent conflicts while working on a feature branch is to 
bring frequently the latest changes from origin branch.

```git
> git rebase <origin-branch> 
```

Having a the next branching state.

```bash
        B1———B2
       /
A1———A2———A3———A4
```

`rebase` permits removing momentarily the current commits (the ones that are not 
present in the origin branch), put in place the new changes and install on top 
feature commits again.

```bash
                  B1———B2
                 /
A1———A2———A3———A4
```

While updating the branch is intended to be carried out as often as possible, 
sometimes the differences between both branches are too complex that conflicts 
arise. As with merge conflicts must be resolved but interactevely. `rebase` let 
us decide what to do in case of conflicts: fix them and continue or abort. Below
there's a list with the most used options.

```bash
git rebase --continue # follow rebase
git rebase --skip     # jump current conflict
git rebase —-abort    # stop rebase and leave things as thet were
git rebase --quit     # like abort but keeping the committed changes
```

## Forcing push for rebased branches

It can happen when rebasing, sometimes, the remote repository rejects new 
changes because of the rebase itself. The rejection message will read something 
about our local branch is behind the remote one.

When the rebase is executed, the new changes are put in the middle of the 
commits stack, desynchronising with the remote picture. In this particular 
case, the message is confusing, it will ask you to updated from remote branch 
which, obviously, we don’t want.

In order to solve this problem, the push command can be forced by passing the 
`--force` option.

```bash
git push --force
```

Never, ever, force a push on a collaborative branch. It will destroy 
modifications being carried out by other repository members and you will 
become a hatred object among colleagues. Use `--force` only with your own 
branches.

To prevent possible overwritings on the remote branch, there is the 
`--force-with-lease` option. Whilst the `--force` option will push changes no 
matter what, `--force-with-lease` won’t allow any update if some other 
collaborator has added changes to the remote branch. So, remember, always is 
preferable using this option.

```bash
git push --force-with-lease
```

## Choosing commits

While working in a branch we don't pay much attention how the the commit 
history looks like. In fact we are focused on development. But when the current 
work is already completed, is time to sort the log. We don't want to look like
we're suffering Diogenes syndrome, accumulating all those non-useful commits.

```bash
259aff2 (HEAD -> A) body edit
7a48555 wip: body content
71a621b A file updated
2dc6065 new A file
d9ad32e (master) A new commit is introduced while previous changes are in stash
13b16a5 Revert "README updated"
76a1097 Demo file updated
a31e004 README updated
44d4c5b New README file
ee42779 New demo file
```

The upper log shows a log history where the master branch (d9ad32e) and the 
local HEAD (259aff2) points to different commits. Except the first commit 
(2dc6065) there are no meaningful descriptions between them. Since each commit 
refers to the same feature, a suitable solution to arrange the log is to use 
`rebase` to join them into one commit. 

`rebase` is not only an alternative to the merge command. Actually, the command 
is meant to rewrite the project history. With that notion in mind, `rebase` is 
able to be used in the same branch. Instead of specifying a branch name, a 
previous commit is passed in. Actually a branch name is not more that a 
meaningful name pointing to a commit.

There is more regarding the rebase. It can be executed automatically by default 
or interactively by passing the `-i` option. The Interactive mode gives the 
possibility to rearrange the log by modifying each commit with a specific command.

```bash
g rebase -i d9ad32e
```

After running the previous command, the default editor pops out opening the 
next file. In my case, vim is the default editor but you can set out yours 
by using the git config [core.editor][coreditor] option.

```bash
reword 2dc6065 new A file
fixup 71a621b A file updated
fixup 7a48555 wip: body content
fixup 259aff2 body edit
```

`fixup` or `f` for short, merges in bulk the marked commits with the previously 
picked one. In difference with `squash`, `fixup` don't reuse the provided message.

`reword` allows to rewrite the commit message. `rebase` executes the provided 
actions after saving the file and closing the editor. When the task has been 
completed, the editor jumps again, allowing us to introduce the new commit description. 

Once the rebase has completed, the next log looks like below.

```bash
2569f57 (HEAD -> A) feature A
d9ad32e (master) A new commit is introduced while previous changes are in stash
13b16a5 Revert "README updated"
76a1097 Demo file updated
a31e004 README updated
44d4c5b New README file
ee42779 New demo file
```
## Autosquash (or how to keep a clean log)

Sometimes it happens to have a sudden idea while working on in a total different 
subject. You stop working immediately what you're at and start on that new idea. 
Damn serendipity!

The next steps from a git perspective are (1) saving things up and (2) create a 
new branch. Now, we are able to work in whatever is that brilliant idea. The 
git loop starts: Work. Test things up. Save progress. And back to the beginning
of the loop until the job is done.

Finally we go back to the unfinished branch and start working again in the same loop.

Lots of commits are created during this process. All of them refers to the same
topic. So, why all these commits when actually only one commit will do? Is it not
easier to search in the log for a commit with a one nice and concise message than
looking for a bunch of different commits? Are they in the same slot? Do they got
interlaced among unrelated commits?

All right, we can pick up commits doing a rebase, but why bother when we already
know everything relates to the same piece?

Let’s tackle the *autosquash* feature.

[coreditor]: https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_code_core_editor_code
