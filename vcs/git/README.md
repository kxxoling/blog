# git 入门

git 是 Linux 之父 Linux 开发的开源的分布式版本控制系统，通常用于代码的版本控制。和 SVN
这样依赖中心服务器的版本控制系统不同的是，git 是分布式的，因此被称为分布式版本控制系统。


## 基本概念

- 代码仓库：一般是指正在使用 git 的项目及其所有记录版本。
- 提交：提交是 git 版本控制的最小单位，每个提交都有一个 UUID 作为区分，以及提交信息作为注释。
- HEAD：当前代码库所位于的提交。
- 分支：如果你用过别的版本控制系统，那么你一定听说过分支，你（或者你的团队）可以在不同的分支上
  独立地开发多个特性，并在合适的时候将它们合并在一起。
- upstream：你的分支需要有对应的上游分支才能直接 push。
- 暂存区：已修改但未提交的代码需要先添加到暂存区才能提交。


## 基本命令

| git xxx 命令  | 作用
|---------------|----------
| status 		| 显示 repo 当前状态
| commit 		| 提交代码
| push 			| 推送代码
| fetch 		| 拉取代码
| merge 		| 合并代码
| pull 			| 拉去并合并代码
| rebase 		| 衍合／变基。将某次提交后的所有提交按照需要应用到指定提交上。
| config 		| 设置
| tag 			| 打标签
| checkout 	    | 检出某次提交或者某个分支
| clone 		| 克隆代码库到本地
| add           | 将变动添加到暂存区


## 文件状态

git 对 repo 的管理以文件为对象，在使用过程中一个文件会存在以下常见状态变化：

- untracked：未添加。在仓库目录刚创建的尚未添加至 repo 的文件状态即是 untracked。也可以把已存在于 repo 中的文件从中删去，这时文件的状态也会回到了 untracked。
- unmodified：新文件添加进来后并没有对照的历史版本，状态即 unmodified。
- modified：unmodified 的文件发生修改、变动后其状态会改变为 modified。
- staged：暂存状态。通过 add 命令记录待提交的文件，文件的状态会变味暂存状态。
- commited：暂存文件提交后其状态即是 commited，当然也是 unmodified。

![git 文件状态转换图解](/images/git/git-status.jpg)


## 最简单的流程

1.从远程 clone 代码仓库：``git clone https://github.com/kxxoling/blog.git``
- 将本地 master 分支与远程 master 分支关联起来：``git remote add origin master``
- 修改代码（比如创建文件 a.txt）：``touch a.txt``
- 将改动添加到暂存区：``git add a.txt``
- 提交改动：``git commit -m "添加了 a.txt``
- 上传到原仓库：``git push``


## rebase 和 cherry-pick


## 常用命令

添加 upstream：

    git upstream add origin <git repo addr>

删除远程分支：

    git push -d
    
清除无用代码／文件：

    git clean -f     # 删除 untracked 状态的文件
    git clean -fd    # 删除 untracked 状态的文件和目录
    git clean -nfd   # 列出所有会删除的文件和目录（并不执行删除）
    
## reset、revert、checkout 的区别

| 命令\作用对象 |  文件                    | commit
|---------------|--------------------------|-------------------
| reset         | 清除文件的未提交改动     | 丢弃私有分支中某次提交之后的所有提交，或者丢失未提交的改动
| checkout      | 放弃工作目录中的所有改动 | 切换分支，或者检出某个版本的文件快照
| revert        |                          | 将公共分支的代码强制覆盖为某个版本的代码


## 其它常用命令

### 折叠显示 diff 信息

我常用的方法是通过管道将 git diff 结果传递给 less，实际上 git 内置了分页（pager）的支持，
diff 的时候加上 ``-s`` 参数即可设置 less 作为 pager，全局设置命令：

    git config core.pager 'less -r'

### clone 特定分支

项目很大或者网络很差的时候你可能只打算 clone 其中某一个分支：

    git clone REPO_URI[ TARGET_FOLDER][ -b/--branch SOME_BRANCH]

``REPO_URI`` 可以是 git 协议、HTTP/HTTPS 或者 SSH 协议的资源地址。

### 比较某个文件和远程分支上的区别


    git diff local_branch remote_branch file_path


### 列出已删除的文件（并恢复）

### 从版本库历史中寻找特定代码

```sh
git rev-list --all | (
    while read revision; do
        git grep -F 'Your search string' $revision
    done
)
```

### 应用不相关的 git 仓库中的 patch

首先将那个不相关的版本库作为一个远程版本库添加进来，并 fetch 其改动，然后
cherry-pick 你需要的那条提交记录。

### 设置一个新的 master 分支


### 修改特定的 commit

这种情况下，你可以使用 ``git rebase``，例如，你想要修改 bbc643cd commit，运行下面的命令：

    git rebase bbc643cd^ --interactive

在默认的编辑器中选择并修改你期望修改的，然后保存修改并输入：

    git add
    <
    filepattern
    >

现在你就可以使用

    git commit --amend

来修改commit，之后使用

    git rebase --continue

返回之前最新的commit。

### ignore 已存在在代码库中文件的后续改动

    git update-index --assume-unchanged

### 从不相干的 repo 中提取 commit

    git --git-dir=SOME_REPO/.git format-patch -k -1 --stdout | git am -3 -k

这行命令首先从仓库 SOME_REPO 中提取 patch 并输出到 stdout，在使用 ``git am`` 命令在当前 repo 中应用 commit。

### 

## 参考链接 & 推荐阅读

* [12 个 git 实战建议和技巧](http://www.csdn.net/article/2012-12-11/2812673-12-git-tips)
* [How to undo (almost) anything with Git](https://github.com/blog/2019-how-to-undo-almost-anything-with-git)

