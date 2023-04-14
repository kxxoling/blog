# Tmux 简易配置

[Tmux] 名字取自“Terminal Multiplexer”，读作“T-马克思”，是一个能够终端窗口中提供多终端会话
管理的应用，它可以在后台保持多个终端会话的运行，并在合适的时候 attach 或者 detach 会话，
以达到保持和切换会话的作用。

Tmux 的竞争对手有 GNU Screen，我没有过 Screen 的使用经验，但是根据搜索的结果 BSD 协议的
Tmux 似乎要更加自由和强大。


## Tmux  Prefix （prefix）

Tmux 使用 Prefix 以将自身的快捷键与其它应用区分，运行 Tmux 快捷键时首先按下这个 Prefix
（默认是 ``Ctrl-b`` 组合键），松手后紧接着按下对应操作的快捷键。

比如，如果我想要列出所有的 Tmux 会话（对应快捷键是 ``s``）需要这样：

1. 按下 ``Ctrl-b`` 组合键（默认 Prefix ）；
*  放开 ``Ctrl-b``；
*  按下 ``s`` 键。

Tmux 配置文件的默认地址是 ``~/.tmux.conf``，每次启动 Tmux 时都会加载该文件。


### 修改 Prefix（ Prefix ）

Tmux 的配置未见位置是 ``~/.tmux.conf``，修改 Tmux  Prefix 首先需要取消绑定原有的的 Prefix ；
再设置新的 Prefix，这里以 ``Ctrl-w`` 为例：

```conf
unbind C-b
set -g prefix C-w
```

### 绑定快捷键

Tmux 快捷键绑定的命令是 ``bind 快捷键 作用``，即可将“作用”绑定在 ``Prefix ＋快捷键`` 上，
下面这行配置会将“重新加载”配置文件的操作绑定在快捷键 ``R`` 上：

```conf
bind R source-file ~/.tmux.conf \; display-message "Config reloaded..."
```


## Tmux 特性

### Pane（面板）

如果你用过 Vim 之类的编辑器肯定不会对 Pane 概念感到陌生，Tmux 也支持类似的概念，
支持横向和纵向切割面板功能。

功能                    | 命令
------------------------|----------------
水平切割（上下两半）    | ``Prefix + "``
竖直切割（左右）        | ``Prefix + %``
调整面板宽度／高度      | ``Prefix - 方向键``


### 窗口（window）

窗口的层级要高于面板，作用类似于标签页，默认会在终端的底部显示窗口列表。

功能            | 命令
----------------|---------------
创建新窗口      | ``Prefix + c``
重命名窗口      | ``Prefix + $``
切换到某个窗口  | ``Prefix + 窗口 ID``


### 会话（session）

会话的层级更高于窗口，在终端输入 ``tmux`` 会创建并进入一个新的会话，你可以使用会话来区分
使用者或者任务。

功能                | 命令
--------------------|---------------
创建并进入新会话    | ``tmux``
进入未关闭的会话    | ``tmux attach 会话名``
退出但保留当前会话  | ``Prefix + d``
列出所有会话        | ``Prefix + s ``
重命名当前会话      | ``Prefix + $``


## 类 Vim 的文字选择和复制方式

### 选中和复制文字

你需要添加以下配置：

```ini
# （进入复制模式后）输入 'v' 开始选择
bind-key -t vi-copy v begin-selection
# 将选中文字添加到系统的剪贴板中
bind-key -t vi-copy y copy-pipe "reattach-to-user-namespace pbcopy"
```

## 结对编程

tmux 有个特性，不管多少人连进同一个 tmux 会话，他们看到和操作的都是同一个东西，会话的长宽取决于输出的长款的最小值，因此可以用来进行结对编程练习。


## Tmate 与远程会话共享

首先你需要安装 [Tmate](https://tmate.io/)：

```sh
brew install tmate
```

Ubuntu：

```sh
sudo apt-get install software-properties-common && \
sudo add-apt-repository ppa:tmate.io/archive    && \
sudo apt-get update                             && \
sudo apt-get install tmate
```

输入 ``tmate`` 将会创建一个公开的远程会话（会话的底部会出现提示“[tmate] Remote session: ssh [some hash]@ny.tmate.io”），将 ssh 的地址发送给你的朋友就可以分享你的会话了！


## Vim 兼容问题

### 主题冲突问题

如果你跟我一样使用 Vim 作为编辑器，可能同样会遇到输出黑块的问题。解决方案是在 Vim 的配置文件中加入：

```vim
if exists('$TMUX')
  set term=screen-256color
endif
```

## UI 定制

UI 上，Tmux 也具有不错的定制性，个人比较喜欢 [Powerline Blue](https://github.com/jimeh/tmux-themepack/blob/master/powerline/block/blue.tmuxtheme) 主题。

## 关闭终端时自动保存和恢复会话

## 参考链接

* 官网：[Tmux]
* [Tmux 快捷键 & 便条]
* [A Tmux crash course: tips and tweaks]
* [持久保存 Tmux 会话]


[Tmux]: https://tmux.github.io/
[Tmux 快捷键 & 便条]: https://gist.github.com/MohamedAlaa/2961058
[Tmuxinator]: https://github.com/tmuxinator/tmuxinator
[A Tmux crash course: tips and tweaks]: http://tangosource.com/blog/a-tmux-crash-course-tips-and-tweaks/
[持久保存 Tmux 会话]: https://linuxtoy.org/archives/tmux-resurrect-and-continuum.html
[tmux-resurrect]: https://github.com/tmux-plugins/tmux-resurrect
[tmux-continuum]: https://github.com/tmux-plugins/tmux-continuum
[tmux-open]: https://github.com/tmux-plugins/tmux-open

