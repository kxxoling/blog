# Python 中的 ``NotImplemented`` 和 ``NotImpementedError``

可能很多 Pythoneer 都没有用过这两个东西，甚至都不了解它们的存在，更不用说区分它们了。现在就让我们来探索一下：

```py
>>> type(NotImplemented)
<type 'NotImplementedType'>
>>> type(NotImplementedError)
type
>>> issubclass(NotImplementedError, Exception)
True
```

``NotImplemented`` 是 Python 内建命名空间内仅有的 6 个常量（Python 中没有真正的常量）之一，其它几个分别是 ``False``、``True``、``None``、``Ellipsis`` 和 ``__debug__``。和 ``Ellipsis`` 一样，``NotImplemented`` 也可以被重新赋值：

```py
NotImplemented = "don't do this"
```

> 其实 Python 2 中 ``True`` 和 ``False`` 也是可以赋值的，比如： ``True, False = False, True``。但是 Python 3 从语法层面禁止这种用法。

两者是什么关系呢？答案是“没啥关系”。


## Python 内部是怎样使用 ``NotImplemented`` 的？

Python 中 ``NotImplemented`` 广泛应用于二元魔术方法中，比如 ``__eq__()``、``__lt__()`` 等等，表示该类型无法和其它类型进行对应的二元运算。例如：

```py
class A(object):
    def __init__(self, value):
        self.value = value

    def __eq__(self, other):
        if isinstance(other, A):
            print('Comparing an A with an A')
            return other.value == self.value
        if isinstance(other, B):
            print('Comparing an A with a B')
            return other.value == self.value
        print('Could not compare A with the other class')
        return NotImplemented
        
class B(object):
    def __init__(self, value):
        self.value = value
    
    def __eq__(self, other):
        raise NotImplementedError
        if isinstance(other, B):
            print('Comparing a B with another B')
            return other.value == self.value
        print('Could not compare B with the other class')
        return NotImplemented

a, b = A(1), B(1)
aa, bb = A(1), B(1)
a == aa  # True
b == bb  # True
a == b   # True
b == a   # True
```

最后一条输出了两行：

```
Could not compare B with the other class
Comparing an A with a B
```

说明 ``==`` 运算符执行时会先寻找 B 的 ``__eq__()`` 方法，遇到 ``NotImplemented`` 返回值则反过来去寻找 A 的 ``__eq__()`` 方法。


## 什么时候该使用 ``NotImplementedError``？

``NotImplementedError`` 是 ``RuntimeError`` 的子类：

```py
issubclass(NotImplementedError, RuntimeError)    # True
```

[官网][NotImplementedError] 的建议是当你需要一个方法必须覆盖才能使用时，其效果类似于 Java 中的接口，用于定义一个未实现的抽象方法。


参考：

- [Python’s `NotImplemented` Type](https://shahriar.svbtle.com/python-notimplemented-type)
- [官方文档][NotImplementedError]


[NotImplementedError]: https://docs.python.org/3.4/library/exceptions.html#NotImplementedError
