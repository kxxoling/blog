# git hook 简单介绍

hook，直译过来是“钩子”，通常是用于在某事件发生或者完成后添加自定义的动态事件/任务。在使用 git 时，我们也可以通过 git hook 来完成一些自动测试、集成、构建等流程工作。如果 git hook 执行失败将终止后续操作。

## 有哪些可用的 git hook

在项目的 `.git/hooks` 目录中会有很多 `hook-name.sample` 的文件，提供了常见 hook 的 shell 脚本模板，当然我们也可以使用 Python、Ruby 等其它脚本语言编写 hook，不过不要忘记在脚本首行加上 shebang 声明，并赋予可执行权限。

根据 hook 执行的位置，可以分为“客户端 hook”和“服务器端 hook”，客户端 hook 在开发者本地环境运行，服务器端 hook 则运行在项目的托管服务器上，通常是在接收提交时触发。

### 客户端 hook

#### ``git commit`` 相关 hook

- `pre-commit`：提交前执行，可以使用 ``git commit --no-verify`` 命令跳过该 hook。
- `prepare-commit-msg`：在启动提交信息编辑器之前执行，用于定制提交时出现信息。可以结合提交模板使用，动态地插入信息。
- `commit-msg`：
- `post-commit`：提交过程完成后运行的 hook，不接收任何参数。

#### ``git am`` 相关 hook

``git am`` 用于应用（apply）来自邮箱（mailbox）的 patch，``am`` 正是 “apply mailbox” 的缩写。``am`` 流程会检测 3 个 hook：

- `pre-applypatch`：运行于应用补丁**后**、产生 commit 前。因此更合理的命名可能应该是 ``post-applypatch-pre-commit``。
- `applypatch-msg`：它接收单个参数：包含请求合并信息的临时文件的名字。 如果脚本返回非零值，Git 将放弃该补丁。 你可以用该脚本来确保提交信息符合格式，或直接用脚本修正格式错误。
- `post-applypatch`：应用补丁并产生提交之后。

#### 其它客户端 hook

- `pre-rebase`：运行于 ``git rebase`` 之前，官方的例子中是用于禁止对已推送的 commit 进行 rebase 操作，这样可以防止于线上的代码库发生冲突。
- `post-checkout`：``checkout`` 命令执行完成之后会调用的 hook，通常用于自动调整运行环境。
- `post-merge`：运行于合并操作完成之后。
- `pre-auto-gc`：在运行 ``git gc --auto`` 命令前执行，可以用于提醒即将进行垃圾回收，或者现在是否应当进行垃圾回收。
- `post-rewrite`：运行于重写提交信息的命令之前，比如 ``git commit --amend`` 之前。
- `pre-push`：在 push 操作前执行。

#### 服务器端 hook

- ``pre-receive``：接收到来自客户端的推送时最先调用的 hook，可以用户阻止“non-fast-forward” 的更新，或者进行文件访问控制。
- ``update``：类似 ``pre-receive``，不过在同时推送多个分支时 ``pre-receive`` 仅仅运行一次，``update`` 会每个分支执行一次。
- `post-update`：运行于整个接收服务完成之后。


参考：

- [自定义-Git-Git-钩子](https://git-scm.com/book/zh/v2/自定义-Git-Git-钩子)
