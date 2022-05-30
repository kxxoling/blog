# Quine 是什么

根据[维基百科][0]解释，Quine 是指输出结果和自身源码一致的程序。
该名称来自哲学家 Quine（奎恩），中文可译为“自产生程序”。
有说法认为能够直接读取自己源码、读入使用者输入或空白的程式一般都不视为 Quine。

## 从最简单开始

严格意义上来说，对于脚本语言，一个空白的脚本文件就是一个 Quine 程序。复杂一点我们也可以读取并打印源文件自身：

```python
print open(__file__).read()
```


## 复杂一点

由于 Python 的缩进要求，很难手写出一个符合 PEP8 规范的 Quine 程序，但 Python 并不禁止单行代码。
[StackOverflow](http://stackoverflow.com/questions/6223285/shortest-python-quine)
上给了一个简单的例子：

```python
_='_=%r;print _%%_';print _%_

```

因为 ``print`` 会自动在输出结尾增加一个空行，因此代码中也需要匹配一个空行。
不过上面的代码并不支持 Python 3，StackOverflow 同页还有一个支持 Python 3 的版本：

```
print(lambda x:x+`(x,)`)('print(lambda x:x+`(x,)`)',)

```

[0]: https://en.wikipedia.org/wiki/Quine_(computing) "Quine"

