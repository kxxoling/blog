# 闪烁的 git 提交信息

git 闪烁消息效果由特殊字符实现，该特殊字符可以在 Vim 等编辑器中输入，但同时需要终端支持。


## 制作方式

首先，输入 ``git commit`` 进入默认编辑器修改 commit 信息，进入 Vim 的插入模式，
输入 ``Ctrl + v``，放手后再按 ``Esc`` 键即可得到形如 ``^[`` 的字符（*实际上并不是*）；
紧接着再输入 ``[5m``，之后再输入 commit 信息（这里假设内容为 ``COMMIT_MESSAGE``）；
输入后再如同前面输入类似 ``^[`` 的字符，在输入 ``[0m``。

最后得到的结果形如：``^[[5mCOMMIT_MESSAGE^[[0m``。

如果你的终端支持，即可在 ``git log`` 中看到闪烁的 commit 信息。

参考：[How to Make a Blinking Commit Message]

[How to Make a Blinking Commit Message]: http://blog.annharter.com/2015/08/12/blinking-commits.html

