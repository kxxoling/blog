# 开始学习 Ruby 啦！

## 原因

在做 Python web 开发的过程中发现有不少库都借鉴自 Ruby，比如 Plim 与 Slim，
factory_boy 与 factory_girl ，gunicorn 与 unicorn 等等。
所以在需要看源码的情况下，直接看 Ruby 实现可能会比看 Python 的更好。
当然，这里并不是说 Ruby （在这些方面）领先 Python 很多，语言之间的互相借鉴
本就是非常常见的，同样也有很多从 Python 移植到 Ruby 的应用，
比如 IPython 与 SciRuby 等等。

此外，在最近做系统管理、运维的过程中发现，Ruby 的运维工具也非常丰富，
借由 GitHub 的传播影响力非常巨大，学会了 Ruby 肯定有助于使用 Puppet、
Boxen、Vagrant、Compass 这些常用的开发、运维工具。

从语言方面来说，Ruby 与 Python 在设计方面还是有很多不同之处，
学会 Ruby 也有助于理解函数式编程范式。另外 Ruby 和 OC 的面向对象中都深刻着
SmallTalk 的影子，学会 Ruby 后应该也有助于掌握 iOS 开发吧。

当然，还有一点也很重要：手里刚好有两本 Ruby 相关的优秀书籍：

* 《七周七语言》：从语言设计的角度讲 Ruby
* 《松本行弘的程序世界》：Ruby 之父讲编程的边边角角

也算是诱因之一吧～


## 安装 Ruby

虽然最新的 OS X 中都预装了 Ruby，其提供的却是 Ruby 2.0.0 ，并且无法和 IRuby/SciRuby
很好地合作，但并不推荐将其卸载，因为并不清除有哪些系统应用是依赖于它的。

使用 Homebrew 安装 Ruby：

```sh
$ brew install ruby
...
$ ruby -v
ruby 2.2.2p95 (2015-04-13 revision 50295) [x86_64-darwin14]
```

## REPL 环境

REPL 环境对于学习一门新编程语言的帮助是非常明显的，所以 REPL 工具的好坏非常重要！
Ruby 虽然已经自带了 ``irb`` ，但鉴于其智能程度实在难有作为。
除 ``irb`` 外，Ruby 也有一些其它的 REPL 工具，但强大程度仅相当于 Python 的 BPython。
与 IPython 同源的 SciRuby 是个非常好的选择（IRuby 已废弃，代码库已合并进 SciRuby）。
虽然尚未找到能匹敌 ptIPython 的工具，SciRuby + Jupyter Notebook 也足够使用了。

### 安装

通过 IPython 来提供 Jupyter Notebook：

```sh
pip install ipython +notebook
```

安装 SciRuby 完整版：

```sh
gem install sciruby-full
```

（可能在安装 nmatrix 的时候出现编译错误，这时候主要功能基本已经安装完成了，
运行 ``iruby register --force`` 强制注册 Homebrew 安装的 Ruby 即可。）

不清楚需要什么的情况下还是安装完整版靠谱些。


## Python to Ruby

Ruby 官方教程中有一章 [Python 到 Ruby 的快速对比](https://www.ruby-lang.org/en/documentation/ruby-from-other-languages/to-ruby-from-python/)：

### 相同点

* 没有行终止符（通常是 ``;``）；
* 多行文本用三个引号；
* 列表用方括号，字典（Ruby 中成为 hash）用花括号；
* 列表可以嵌套，列表相加的操作相当于 ``.extend()``；
* 强类型 & 动态类型；
* 万物皆对象，变量只是对象的引用；
* Exception 只有关键字不一样；
* 嵌入式文档（Ruby 中叫做 rdoc）。

### Ruby 和 Python 不同之处

* 字符串是可变的；
* 允许定义常量；
* 双引号与单引号不完全一样，前者中允许转义字符和字符串格式化，后者行为和
  Python 原生字符串类似。
* 不允许直接引用属性，只允许方法调用；
* 调用方法时可以吗没有圆括号；
* Ruby 中需要显式声明 public、private、protected ，没有下划线规定；
* Ruby 不支持多继承，只支持 MixIn；
* 允许修改内置函数、对象；
* true、 false、 nil 对应 Python 中的 True、False、None ；
* false 和 nil 相当于 false，其它，包括 ``0`` ``0.0`` ``[]`` ``{}`` ，都是真值；
* ``elsif`` 对应 ``elif``；
* ``require`` 对应 ``import``；
* 代码上方的普通注释会被整理为文档，在 Python 中是下方的 docstring ；
* 不支持手动回收变量（Python 中可以手动 ``del``）。

