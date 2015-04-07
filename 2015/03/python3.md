# Python 3 新特性

本文是对[官方文档](https://docs.python.org/3/whatsnew/3.0.html)的总结，
主要比较对象是 Python 3.0 和 Python 2.6。
原作者是 Python 创始人 Guido van Rossum。


## print 是函数而不再是声明

在 Python 3 中，print 变成了一个内建函数，使用命名参数来实现旧版 print
的大多数功能，具体见 [PEP 3105](http://www.python.org/dev/peps/pep-3105)。

```python
    Old: print "The answer is", 2*2
    New: print("The answer is", 2*2)

    Old: print x,           # 在行尾接上逗号以取消换行
    New: print(x, end=" ")  # 指定行尾接上空格为非换行

    Old: print              # 打印一段空行
    New: print()            # 这里必须当作函数来调用

    Old: print >>sys.stderr, "fatal error"
    New: print("fatal error", file=sys.stderr)

    Old: print (x, y)       # 输出 repr((x, y))
    New: print((x, y))      # 注意：参数应该是 (x, y) 元组
```

除了 `end` 外，你也可以指定分隔符 `sep`：

```python

print("There are <", 2**32, "> possibilities!", sep="")

>>> There are <4294967296> possibilities!
```

注意：

* print() 函数并不支持旧的 print 声明的“softspace”特性，在 Python 2 中 `print "A\n", "B"`
  会输出 “A\nB\n”，而 Python 3 中 `print("A\n", "B")` 会输出 “A\n B\n”。

* 使用 Python 3 自带的转换工具能够自动把 print 声明转换成 print 函数，
  所以一般不会出现问题。


## 使用 view 和迭代器代替列表

Python 3 中很多常见的 API 的返回值都不再是列表了：

* 字典方法 `dict.keys, dict.items, dict.values` 的返回值都是 view 而不再是列表，
  因此 `k = d.keys(); k.sort()` 这样的写法不再有效，你可以改为 `k = sorted(d)`。

* map() 和 filter() 都返回迭代器。如果你真的需要一个 list 类型，可以使用 list()
  函数来：比如 `list(map(...))` ，不过这里更推荐使用列表解析（如果原来的代码中
  使用了 lambda 时尤其推荐），或者将代码修改为不依赖 list。特别要注意 map 可能会
  带来函数的副作用，这时候可以使用 for 循环（创建列表会非常浪费）。

  如果输入的参数长度并不相等，map 会在较短的序列完成的时候中止。为了完全兼容 Python 2，
  你可以使用 `itertools.zip_longest()` 做一层封装：`map(func, *sequences)`
  修改为 `list(map(func, itertools.zip_longest(*sequences)))`

* range() 相当于 Python 2 中的 xrange()，但是并不支持任意大小。

* zip() 会返回一个迭代器。


## 状态比较



## 整数



## Text Vs. Data 与 Unicode Vs. 8-bit



## 语法变化



## 2.6 以后已经支持的变化



## 变化的库



## 新的字符串格式化



## 对于 Exception 的修改



## 其它变化



## 内建部分以及 C API 的修改



## 性能



## 转向 Python 3
