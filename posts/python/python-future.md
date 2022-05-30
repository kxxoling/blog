# Python ``__future__`` 库

Python 虽然强调一件事只有一种显而易见的解决方案，但是仍然提供了诸多可以
hack 的地方，比如我想要在 Python 中写出 ``def ... end`` 这样函数声明可以这样：

```python
__builtin__.end = None

def fun():
    pass
end
```

这是因为 Python 中的内建函数都存在于 ``__builtin__`` 库中，而 ``__builtin__``
库会随 Python 解释器的初始化载入，我们这里对 ``__builtin__`` 库打了一个简单的
MonkeyPatch ，这样在代码中使用 ``end`` 的效果就等同于 ``None``。

那么，如果我想要在 Python 2.x 中使用类似 Python 3 中的 ``print()`` 函数怎么办？
和上面类似，实现一个 ``print()`` 函数再将其赋给 ``__builtin__.print`` ？
不幸的是 Python 中禁止这样做，你将会得到语法错误的提示。

不过 Python 对这样的情况提供了另一套解决方案—— ``__future__`` 库，从 ``__future__``
中 import 的函数将会替代 ``__builtin__`` ：

```python
from __future__ import print_function
help(print)
```

参考链接：[官方文档](https://docs.python.org/2/library/__future__.html)

