# Python functools 模块

functools 是 Python 中很简单但也很重要的模块，主要是一些 Python 高阶函数相关的函数。
该模块的内容并不多，看[官方文档](https://docs.python.org/2/library/functools.html)
也就知道了。

说到高阶函数，这是函数式编程范式中很重要的一个概念，简单地说，
就是一个可以接受函数作为参数或者以函数作为返回值的函数，因为 Python 中函数是一类对象，
因此很容易支持这样的函数式特性。

functools 模块中函数只有 ``cmp_to_key``、``partial``、``reduce``、``total_ordering``、
``update_wrapper``、``wraps`` 这几个：


## 被发配边疆的 ``reduce``

这个 ``functools.reduce`` 就是 Python 2 内建库中的 ``reduce``，它之所以出现在这里就是因为
Guido 的独裁，他并不喜欢函数式编程中的“map-reduce”概念，因此打算将 ``map`` 和 ``reduce``
两个函数移出内建函数库，最后在社区的强烈反对中将 ``map`` 函数保留在了内建库中，
但是 Python 3 内建的 ``map`` 函数返回的是一个迭代器对象，而 Python 2 中会 eagerly
生成一个 list，使用时要多加注意。


## 偏函数 ``partial``

函数式编程中有个很重要的概念叫做柯里化，简单地（虽然并不准确）说，就是这样地效果：

```python
def add(x, y):
    return x + y

add_y = add(num_y)  # add_y 是一个函数
add_y(num_x)        # 结果是 num_x+num_y
```

当然，上面只是伪代码，在 Python 中你可以使用 ``partial`` 函数实现类似的效果：


```python
from functools import partial

def add(x, y):
    return x + y

add_y = partial(add, 3)  # add_y 是一个函数
add_y(4)                 # 结果是 7
```


## 装饰器相关

说到“接受函数为参数，以函数为返回值”，在 Python 中最常用的当属装饰器了。
functools 库中装饰器相关的函数是 ``update_wrapper``、``wraps``，还搭配
``WRAPPER_ASSIGNMENTS`` 和 ``WRAPPER_UPDATES`` 两个常量使用，作用就是消除 Python
装饰器的一些负面作用。

### ``wraps``

例：

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@decorator
def add(x, y):
    return x + y

add     # <function __main__.wrapper>
```

可以看到被装饰的函数的名称，也就是函数的 ``__name__`` 属性变成了 ``wrapper``，
这就是装饰器带来的副作用，实际上``add`` 函数整个变成了 ``decorator(add)``，而
``wraps`` 装饰器能消除这些副作用：

```python
def decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@decorator
def add(x, y):
    return x + y

add     # <function __main__.add>
```

会更正的属性定义在 ``WRAPPER_ASSIGNMENTS`` 中：

```python
>>> functools.WRAPPER_ASSIGNMENTS
('__module__', '__name__', '__doc__')
>>> functools.WRAPPER_UPDATES
('__dict__',)
```

### ``update_wrapper``

``update_wrapper`` 的作用与 ``wraps`` 类似，不过功能更加强大，换句话说，``wraps``
其实是 ``update_wrapper`` 的特殊化，实际上 ``wraps(wrapped)`` 相当于 ``partial(update_wrapper,
wrapped=wrapped, **kwargs)``。

因此，上面的代码可以用 ``update_wrapper`` 重写如下：

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return update_wrapper(wrapper, func)
```


## 用于比较的 ``cmp_to_key`` 和 ``total_ordering``

### ``cmp_to_key``

``cmp_to_key`` 是 Python 2.7 中新增的函数，用于将比较函数转换为 key 函数，
这样就可以应用在接受 key 函数为参数的函数中，比如 ``sorted``、``max`` 等等。
例如：

```python
sorted(range(5), key=cmp_to_key(lambda x, y: y-x))      # [4, 3, 2, 1, 0]
```

### ``total_ordering``

``total_ordering`` 同样是 Python 2.7 中新增函数，用于简化比较函数的写法。如果你已经定义了
``__eq__`` 方法，以及 ``__lt__``、``__le__``、``__gt__`` 或者 ``__ge__()`` 其中之一，
即可自动生成其它比较方法。官方示例：

```python
@total_ordering
class Student:
    def __eq__(self, other):
        return ((self.lastname.lower(), self.firstname.lower()) ==
                (other.lastname.lower(), other.firstname.lower()))
    def __lt__(self, other):
        return ((self.lastname.lower(), self.firstname.lower()) <
                (other.lastname.lower(), other.firstname.lower()))

dir(Student)    # ['__doc__', '__eq__', '__ge__', '__gt__', '__le__', '__lt__', '__module__']
```

