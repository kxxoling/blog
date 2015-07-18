# Python 文件的编码声明

初学 Python 时可能不适应需要手动注释文件编码的写法，根据 [PEP 263] 所定义，
必须在 Python 文件的前两行，按照下面的写法注明文件的编码：

```python
# coding=<encoding name>
```

或者：

```python
# -*- coding: <encoding name> -*-
```

或者：

```python
# vim: set fileencoding=<encoding name> :
```

如果不定义文件的编码 Python 解释器会将其视为 ASCII 编码的文件，通常都建议将文件标注为 UTF-8 编码。
像这样：

```python
# coding=utf8
```

如果不使用 UTF-8 编码会怎样呢？[这篇文章](http://www.keakon.net/2014/12/07/我有特别的 Python 加密技巧)
中介绍了一种有趣的用法（不一定支持 Python 3）：

```python
# -*- coding: rot_13 -*-
cevag 'uryyb jbeyq!'.rapbqr('rot_13')
```

相当于

```python
# -*- coding: utf-8 -*-
print 'uryyb jbeyq!'.encode('rot_13')
```

会打印出 ``hello world!`` 。

Dropbox 很久之前开源的 [pyxl](https://github.com/dropbox/pyxl) 提供了一种更实用的用法：

```python
# coding: pyxl
print <html><body>Hello World!</body></html>
```

相当于

```python
import html
print (
    html.head().appendChild(
        html.body().appendChild(
            html.text("Hello World!"))))
```

这里通过自己定义的编码格式 pyxl （需要安装 pyxl Python 库），在 Python 代码中直接编写 HTML。

此外，还有一个 [interpy] 库同样非常实用，它能提供 Ruby 中一样的字符串拼接语法：

```python
# coding: interpy
word = 'world'
print "Hello, #{word}!"
```

[interpy] 的作者 Syrus 在 [StackOverflow](http://stackoverflow.com/a/21015867/2836912)
上介绍了其实现原理，整理如下：

## Python 如何将源码文件编译为比特码

### 加载源文件

Python 解释器首先会阅读并存储源文件内容，由于文件的编码格式可能千奇百怪，所以 Python
首先会对它进行解码，“魔法”就发生在这里：

如果没有找到编码声明，Python 会将其当作 ASCII（Python 2 及以下版本）或者 UTF-8
（Python 3）编码。Python 2 环境下，如果文件内容中存在 Unicode 字符，你首先需要在文件头部
声明编码类型，否则 Python 将文件当作 ASCII 编码格式进行解码就会发生错误。


### 解码文件内容

在这个阶段我们可以注册一个定制的 ``codec`` （包括编码器和解码器），如 [interpy 中]所做，
并（通过 ``# coding: codec_name`` ）告诉 Python 解释器应该用哪个 ``codec`` 。

当然，我们还需要注册 ``codec`` ，而且需要在 import 发生之前运行。可以通过[路径设置文件] （.pth）
达到这一目的，它会先于所有非 ``__main__`` 模块执行。


### 转换文件内容

Python [调用了我们定制的 codec](https://github.com/SyrusAkbary/interpy/blob/master/interpy/codec/register.py#L25)
之后，输出就任由我们控制了。

不过怎样理解 Python 文件语法（token）呢？可以调用 [Python tokenizer] 并按照我们需要修改 token。

[interpy] 的例子非常简单，只是简单地[替换掉了文本中的字符串]。


### 发送解码后的内容

解码完成后，就可以再将其返回给 Python 编译器，编译器会将其编译为字节码。


[PEP 263]: https://www.python.org/dev/peps/pep-0263/
[interpy 中]: https://github.com/SyrusAkbary/interpy/blob/master/interpy/codec/register.py#L54
[路径设置文件]: https://github.com/SyrusAkbary/interpy/blob/master/interpy.pth
[Python tokenizer]: https://github.com/SyrusAkbary/interpy/blob/master/interpy/codec/tokenizer.py#L87
[interpy]: https://github.com/SyrusAkbary/interpy/
[替换掉了文本中的字符串]: https://github.com/SyrusAkbary/interpy/blob/master/interpy/codec/tokenizer.py#L98

