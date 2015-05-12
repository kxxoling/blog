# Python 如何测试

对于一个开源项目来说，文档和测试都是必不可少的组成部分，没有足够测试和文档覆盖率的
“开源项目”就是一坨垃圾！（才不是在黑某人呢。）当然，对于某些能够做到自文档大神来说，
文档可以是不必要的，但测试依旧是代码质量的保证。

凭借这段时间的积累，稍稍对 Python 测试做一下总结。


## 单元测试

单元测试是测试中的基础，强制性的单元测试有利于避免冗长、耦合代码的出现，也有助于
函数式编程素养的养成，会帮助开发人员认识到函数式编程中“确定性”的重要。

> 函数无论在什么场景下，都会得到同样的结果，这个我们称之为函数的确定性。

Python 自带了 [unittest](https://docs.python.org/2/library/unittest.html) 库，
是 Java JUnit 库的 Python 实现，虽然很好用，但我还是想在这里吐槽一下驼峰式命名的方法。
在 Python 2.7 版本以后，unittest.TestCase 类自带了 ``assertListEquel()`` 等方法，
非常便利，也是我不愿意兼容 Python 2.6 的重要原因。

[unittest2](http://www.voidspace.org.uk/python/articles/unittest2.shtml)
是 unittest 的增强版本，几乎完全兼容 unittest 的接口，升级时只需要将 ``import unittest``
替换为 ``import unittest2`` 即可，提供的新方法更强大也更严谨。


## doctest

使用独立的测试库会降低代码与测试之间的内联性，Python 还提供了一个叫做 [doctest](https://docs.python.org/2/library/doctest.html)
的工具，写法如下：

```python
"""
This is the "example" module.

The example module supplies one function, factorial().  For example ::

    >>> factorial(5)
    120
"""

def factorial(n):
    """Return the factorial of n, an exact integer >= 0.

    If the result is small enough to fit in an int, return an int.
    Else return a long. ::

        >>> [factorial(n) for n in range(6)]
        [1, 1, 2, 6, 24, 120]
        >>> [factorial(long(n)) for n in range(6)]
        [1, 1, 2, 6, 24, 120]
        >>> factorial(30)
        265252859812191058636308480000000L
        >>> factorial(30L)
        265252859812191058636308480000000L
        >>> factorial(-1)
        Traceback (most recent call last):
            ...
        ValueError: n must be >= 0

        Factorials of floats are OK, but the float must be an exact integer:
        >>> factorial(30.1)
        Traceback (most recent call last):
            ...
        ValueError: n must be exact integer
        >>> factorial(30.0)
        265252859812191058636308480000000L

        It must also not be ridiculously large:
        >>> factorial(1e100)
        Traceback (most recent call last):
            ...
        OverflowError: n too large
    """

    import math
    if not n >= 0:
        raise ValueError("n must be >= 0")
    if math.floor(n) != n:
        raise ValueError("n must be exact integer")
    if n+1 == n:  # catch a value like 1e300
        raise OverflowError("n too large")
    result = 1
    factor = 2
    while factor <= n:
        result *= factor
        factor += 1
    return result


if __name__ == "__main__":
    import doctest
    doctest.testmod()
```

doctest 并不提供完整的边界数据测试的支持，因此并不能完全替代单元测试。


## 版本兼容

发布开源库的时候通常要考虑不同版本间兼容性的问题，虽然可以通过 virtualenv 实现环境的模拟，
但毕竟很不方便，[tox](http://tox.readthedocs.org/) 正是解决这一问题的工具。

tox 简化了 virtualenv 的管理，提供了简便的配置。我常用的配置是这样的：

```ini
# 文件 tox.ini 的内容，需要和 setup.py 置于统一目录
[tox]
envlist = py26,py27
[testenv]
deps=      		 # 测试依赖
commands=make test     	# 执行测试的命令
```

当然，除了本地，还有在线的 CI 服务提供兼容性测试，首推 [travis CI](https://travis-ci.org/) 。


## 测试覆盖率

可以用 [coverage](http://nedbatchelder.com/code/coverage/)。


## web 相关的功能测试

对于 web 功能的测试，最简单的可以使用 ``urllib2.get(url)``，然后测试输出的 HTML 结果是否符合预期。
当然针对每一个功能都这样写未免太过低效，因此知名 web 框架大多有专门的测试库提供测试：

* Django 内置了 [django.test](https://docs.djangoproject.com/en/1.8/topics/testing/overview/)
* Tornado 内置了 [tornado.testing](http://tornado.readthedocs.org/en/latest/testing.html)
* Flask 可以使用 [werkzeug.test](http://werkzeug.pocoo.org/docs/0.10/test/#werkzeug.test.Client)
  和第三方的 [Flask-Testing](https://pythonhosted.org/Flask-Testing/)


### Django

#### TestCase

#### Client


### Flask

Flask 在写测试的时候需要主要 ``app_context`` 和 ``request_context`` 中的[陷阱](http://flask.pocoo.org/docs/0.10/appcontext/)。


### Tornado

Tornado 的 tesing 库很简陋，主要是针对自身异步特性封装了一些工具。


### 前端页面测试

可以使用 selenium ，但是针对样式的测试目前并没有完善的解决方案。

