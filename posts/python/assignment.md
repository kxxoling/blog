# Python 中的赋值

很多从 Java、C 语言转向 Python 的程序员对 Python 中的赋值语句感到很神奇或者很困惑，
Python 中赋值的特殊之处有 3 点特殊之处：出 0-127 的数字、部分字符串外都是引用赋值；
和其它支持函数式编程范式的语言一样，支持模式匹配；Python 支持连续赋值。


## 模式匹配

支持函数式编程范式的语言通常也支持模式匹配，例如在 Erlang 中我可以这样赋值：

```erlang
[Head | Tail] = [1, 2, 3, 4]
Head.       % 结果是 1
Tail.       % 结果是 [2, 3, 4]
```

在 Python 中存在着类似的赋值方法——元组解包，解包的模式是 ``var1, var2 = iterable``，
其中 ``iterable`` 的长度必须和左侧变量数目相同，其类型可以是任何可迭代类型：

```python
a, b = [1, 2]
```

或者：

```python
a, _, b = [1, 2, 3]
c, (d, e) = 1, (2, 3)   # c=1, d=2, e=3
```

但是 Python 不支持 ``head, tail = 1, 2, 3`` 这种写法，会出现 ``ValueError: too many
values to unpack`` 问题，而 Erlang、Scala、Haskell 等语言中都是支持的。个人的猜测是
这样的：这类衍生自 Lisp 的语言中 ``[1, 2, 3, 4]`` 这样的列表（或者元组或者其它等价结构
其真实结构都是 ``[1, [2, [3, 4]]]`` 这样，而 Scheme 甚至不存在一类列表对象，只有
类似键值对的 cons，想要当作列表使用就需要创建一个 ``[1, [2, [3, 4]]]`` 这样的对象。

不过 Python 3 中允许类似的写法：

```python
a, *b = [1, 2, 3]           # b 为 [2, 3]
c, *d, e = (1, 2, 3, 4)     # d 为 [2, 3]
l, *m, *n = (1, 2, 3, 4)    # SyntaxError: two starred expressions in assignment
```


## 连续赋值

Python 还支持连等号赋值语句： ``a = b = 1``，相当于 ``b = 1; a = b``。

> 注意，不要与连等比较 ``a == b == c`` 弄混淆了！

通常情况下，我们可以猜出来等号左边的所有变量知都等于等号最右边的值，但是 Python 也允许
这样的写法：

```python
foo, boo, moo = boo[0], moo[0], foo[0] = moo[0], foo[0], boo[0] = [0], [0], [0]
print foo[0] is boo         # True or False
print foo[0][0] is moo      # True or False
print foo[0][0][0] is foo   # True or False
```

上面这段代码出自 [StackOverflow](http://stackoverflow.com/questions/32156515/)，
其输出结果是三个 ``True``。这是因为 Python 的连续赋值是“除最右侧值外，所有变量（组）
的赋值顺序是左边赋给右边，最左侧变量（组）直接取最右侧值”，也就是说上面的代码相当于：

```python
foo, boo, moo = [0], [0], [0]
boo[0], moo[0], foo[0] = foo, boo, moo
moo[0], foo[0], boo[0] = boo[0], moo[0], foo[0]
```

当然，Python 之禅中提到“显胜于隐”，并不推荐这种隐晦的写法，容易隐藏 bug。

