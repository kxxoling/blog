# Emacs 入门

Emacs 是 Unix 世界最流行的编辑器之一，负有“神之编辑器”之盛名，学习它的理由毋须多言。但是对于新手来说，它的学习难度也是相当之大（说不难的都是忽悠，虽然可能是善意的谎言），但是掌握了它对于编程、编辑器甚至操作系统的理解都有帮助，因此我建议任何打算长期以编程为业的程序员都尝试一下。


## Vim 还是 Emacs

这是一个长久的话题，也是程序员之间经久不衰的爆点之一（可能仅次于什么是最好的编程语言），对此我的建议是先学 Vim（因为 Vim 的入门相对简单一些，可以不必深入）再学 Emacs 然后再决定长期坚守在哪一阵营。

Vim 和 Emacs 孰优孰劣可能难争高下，但是 Emacs 的配置语言 Emacs Lisp 和 VimLang 之间则几乎没有可比性，Emacs Lisp（简称 Elisp）在完备和强大方面都要远胜后者。Elisp 强大的可编程性使得常常有人开发出强大的 Emacs 插件，也使得 Emacs 被它的拥趸们称为“Emacs OS”。当然 VimL 也可以开发出强大的功能，或者与 Python、Lua 之类的脚本交互，但这会带来一些额外的问题，这里不做多谈。

> Emacs 作为操作系统来说启动速度还是相当快的！


## Emacs 布道

这里主要是一些布道内容，用于展示 Emacs 的强大：

- 玩游戏
  - [2048](https://github.com/sprang/emacs-2048)
  - 贪吃蛇：``M-x snake``。（这是 Emacs 内置游戏，按键解释见后面）
  - 俄罗斯方块：``M-x snake``。（这是 Emacs 内置游戏，按键解释见后面）
- 任务管理 [org-mode](http://orgmode.org/)（建议上 YouTube 搜索大师的 org-mode 展示）
- 浏览网页
  - [WebKit](https://www.emacswiki.org/emacs/WebKit)
  - [偷偷上 Twitter](https://github.com/hayamiz/twittering-mode)
  - 国内论坛
    - [v2ex-mode](https://github.com/aborn/v2ex-mode)
- 在线聊天（妈妈再也不用担心上班聊天被老板发现啦！）
  - Slack：[emacs-slack](https://github.com/yuya373/emacs-slack)
- git 可视化
  - [Magit](https://magit.vc/)：GUI 的简单 + CLI 的强大！
- 内置 Terminal

（看完官网不理解这些插件的强大之处的话，建议上 YouTube 观看大师的使用方式。）

当然，对于作为最基本的编程工具来说，配置得当的 Emacs 也输 IDE 太多。

另外，如果你使用 MacOS 或者 Linux，在日常使用或者使用 Shell（bash/zsh）的过程中可能就已经在不知不觉的使用了 Emacs 的快捷键了，学习 Emacs 也能帮你提升日常工作的效率。


## 在 Emacs 世界中存活下来

Emacs 是一个强大的编辑器，并且自带了完善的自文档特性，但是作为新手在不熟悉 Emacs 基本概念的情况下依然容易迷茫在它的文字海洋中。

### 基本快捷键

Emacs 快捷键基本中的基本是这几个：

- C（Ctrl 或者 control 键）
- M（Meta，PC 中对应 Alt，Mac 上对应 option），Meta 键来自 Solaris，常见 PC 都不具备该键
- S（uper，PC 对应 Win 键，Mac 对应 command）

下面将介绍中将使用快捷键的国际通用简写，比如 ``C-x`` 指同时按下 Ctrl 键和 x 键，``M-x`` 指同时按下 Meta 和 x，``C-G`` 指同时按下 Ctrl Shift 和 g（没有开启 Caps Lock 的情况），``M-x some-long-command`` 指在按下 ``M-x`` 后出现的输入栏中输入 ``some-long-command`` 并按下回车。这里的 ``some-long-command`` 通常是内置或者自定义的函数，可以在编辑器中直接调用。

在 Emacs 中，快捷键通常都是多个快捷键的组合，在前面的快捷（或组合）通常称为 prefix key，比如最常用的 ``C-x C-c`` 的 prefix key 就是 ``C-x``。相同 prefix key 的快捷键在功能上通常都有相似之处。

由于 Emacs 的快捷键通常都比较长，因此经常会出现前面按键按错了想取消的情况，这时候可以按下 ``C-g``，可以清空快捷键栈。``C-g`` 快捷键的另一重要用处在于结束当前任务，比如某个后台解析任务。另外，如果你的 Emacs 安装了过多插件而硬件性能不够，或者某个后台任务进程不够 nice 导致 Emacs 假死的时候也可以尝试使用 ``C-g``。``C-g`` 在 Emacs 快捷键中属于救星一般的存在。

相对于快捷键功能，Emacs 更多的功能并没有绑定快捷键，这些功能都对应了 Elisp 的函数，你可以按下 ``M-x`` 来运行这些函数。

另外，很多 Emacs 用户都建议在 Emacs 中完成所有任务，对于需要在 Shell 中完成的任务，你可以按下 ``M-!`` 通常也就是 ``Meta-Shift-1``，这样就能在 Emacs 中打开一个终端而不用单独开启 Shell 会话。

### 打开与退出

你可以直接输入 ``emcas somefile`` 直接打开文件，也可以启动 Emacs 后输入 ``C-x C-j`` 输入文件地址来打开指定文件。

保存文件命令通常是 ``S-s``，在 macOS 中就是 ``CMD-s``，和大多数 Mac 程序操作一致。

如果你想保存并退出 Emacs，可以输入 ``C-x C-c``，它会提示保存当前 buffer 并在那之后退出 Emacs。


### 学会使用文档

Emacs 强大的自文档也是其优势之一，任何时候你想要查找文档都无需离开 Emacs 自身。查看帮助文档相关命令的快捷键都是以 ``C-h`` 为 prefix 键：

- ``C-h k``：查看某个快捷键（组合）的用处或者绑定的函数。
- ``C-h f``：查看某个函数的作用，以及它绑定的快捷键。
- ``C-h v``：查看某个 Emacs 变量的值。

### Shell 相关命令

正如前面提到的，Emacs 的很多操作/控制命令都被 Shell（Bash/Zsh）所借鉴，并命名之“Emacs 模式”，可以看出 Emacs 究竟由多大的影响力！（很多 Shell 也支持 Vim 模式，不过通常默认都是 Emacs 模式。）

#### 文本编辑命令

- Ctrl + a：移到命令行首
- Ctrl + e：移到命令行尾
- Ctrl + f：按字符前移（右向）
- Ctrl + b：按字符后移（左向）
- Meta + f：按单词前移（右向）
- Meta + b：按单词后移（左向）
- Ctrl + xx：在命令行首和光标之间移动
- Ctrl + u：从光标处删除至命令行首
- Ctrl + k：从光标处删除至命令行尾
- Ctrl + w：从光标处删除至字首
- Meta + d：从光标处删除至字尾
- Ctrl + d：删除光标处的字符
- Ctrl + h：删除光标前的字符
- Ctrl + y：粘贴至光标后
- Meta + c：从光标处更改为首字母大写的单词
- Meta + u：从光标处更改为全部大写的单词
- Meta + l：从光标处更改为全部小写的单词
- Ctrl + t：交换光标处和之前的字符
- Meta + t：交换光标处和之前的单词

#### 控制命令

- Ctrl + r：向后搜索
- Ctrl + g：退出某个模式
- Ctrl + p/n：上下选择


## 配置脚本 Emacs Lisp

Elisp 作为 Lisp 最流行的方言之一，拥有强大的表现能力和灵活性。如果你不曾学习过类似的编程语言也不用担心 Elisp 是一门非常简单、学习曲线非常平坦的编程语言，只需几分钟到几小时（取决与你的编程经验）就可以入门，虽然还不足以读懂高手的配置，但已经足够编写和修改简单的配置脚本了。

另外，Elisp 作为最正统的函数式编程语言之一，对于真正热爱编程的人来说决定是非常值得学习的一门编程语言。

推荐教程：[Learn X language in Y minute.](https://learnxinyminutes.com/docs/elisp/)。文档很短，找个在线 Elisp REPL 环境相信很快就能了解它的基本概念。


## 高手配置

和 Vim 一样，GitHub 上早有开源的高手们的配置了，并且支持灵活的扩展。比如：

- [purcell/emacs.d](https://github.com/purcell/emacs.d) 对流行编程语言都有基本的支持，更高级的功能需要自己扩展。Purcell 的配置的另一个问题是文档太多稀缺，作为新手实在是有点难以下手。
- [redguardtoo/emacs.d](https://github.com/redguardtoo/emacs.d) 国人的 Emacs 配置，fork 自上面的库，内置了中文支持等众多自定义设置。
- [bbatsov/prelude](https://github.com/bbatsov/prelude) 相对全功能，但在试用了一段时间后发现自定义设置和我的个人习惯有较大冲突，遂弃。
- [Spacemacs](http://spacemacs.org/) 结合了 Emacs 和 Vim 的优点，漂亮的 UI 即使不想要任何 Vim 特性也值得你一试。


## 结语

Emacs 强大的功能需要足够的时间去熟悉和掌握，初次学习花上一整天的时间并不奇怪，如果仍然感觉难以入门，那可能是你的背景知识仍不足够，不妨 2、3 年后再来重新学习，很多 Emacs 高手都经历过多次放弃和重新学习 Emacs 的经历。

