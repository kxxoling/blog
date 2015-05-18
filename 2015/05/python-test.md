# Python 项目如何测试

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


## mock

[mock](http://www.voidspace.org.uk/python/mock/) 是一个测试库，提供模拟对象供测试用例使用。
[Python 3 以后](https://docs.python.org/3/library/unittest.mock.html#module-unittest.mock)，
mock 已经加入标准库，调用方法是 ``from unittest import mock``。


## 浏览器

浏览器端的测试自动化最常用的还是 [Selenium](http://www.seleniumhq.org/)，Python 版本的
[文档](https://selenium-python.readthedocs.org/)并不复杂。示例代码：

```python
import unittest
from selenium import webdriver
from django.contrib.auth import get_user_model, authenticate

class LoginTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Firefox()          # 初始化浏览器，也可以选择 Chrome

    def tearDown(self):
        self.browser.quit()                         # 测试结束后关闭浏览器

    def _login(self):
        self.browser.get('http://localhost:8000/login')         # 发送 GET 请求并打开页面

        # 使用浏览器的选择权选中 HTML 元素，复杂的元素选择可以借助 XPath
        username_input = self.browser.find_element_by_id('username')
        password_input = self.browser.find_element_by_id('password')
        submit_button = self.browser.find_element_by_id('submit')

        # 不允许直接修改元素的值，使用传递字符串的方式将字符一个个输入浏览器输入框
        username_input.send_keys('windrunner')
        password_input.send_keys('password')

        submit_button.click()   # 触发点击事件

    def test_login(self):
        self._login()
        self.assertIn('windrunner', self.browser.page_source)   # 断言登录后的页面内容

    def test_logout(self):
        self._login()
        self.assertIn('windrunner', self.browser.page_source)
        self.browser.get('http://localhost:8000/logout')
        self.assertIn('nobody', self.browser.page_source)
        self.assertNotIn('windrunner', self.browser.page_source)
```

使用之后感触最深的是错误提示不够丰富，基本上只能断定页面结果并不符合预期，结果反馈跟 `unittest.TestCase` 简直天壤之别。


### Django

Django 的启动互相之间的依赖严重，大部分文件都不能单独执行，测试时建议使用封装后的工具，
如： `django.test`、`django_nose` 等等。


#### doctest

在 Flask 中测试一个文件的 doctest 只需要运行：``python filename.py``，然而这在 Django 中行不通。
在 Django 中依赖自身的 test 命令：`python manage.py test[ app_name]`，其中 ``app_name`` 若为空
默认测试所有应用。[在 1.6 及以后版本中](https://docs.djangoproject.com/en/1.6/releases/1.6/#new-test-runner)，
需要首先在 `settings.py` 中指定 TEST_RUNNER：

```python
INSTALLED_APPS = (
...
'django_nose',
)
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'
NOSE_ARGS = ['--with-doctest']
```


#### TestCase

Django 的 `TestCase` 类是 `unittest.TestCase` 的子类，因此使用起来非常相似。


#### Fixture

Fixture 是 Django 提供测试数据的一个方式，在使用前需要导出数据：

`python manage.py dumpdata --format=yaml --indent=4 > fixtures_dir/filename.yaml`

支持的数据格式包括 YAML、JSON 等等，个人比较喜欢可读性较高的 YAML，不过，由于 Django。

配合 testserver 命令启动：

`python manage.py testserver fixtures_dir/filename.yaml`

在测试用例中使用：

```python
from django.test import TestCase
from django.contrib.auth import authenticate

class LoginTest(TestCase):
    fixtures = ['mysite.yaml']

    def setUp(self):
        # 导入 fixture 中用户数据，省去创建用户的流程，也免去了清除用户数据的流程。

    def test_has_user(self):
        self.assertIsNotNone(authenticate(username='windrunner', password='password'))
```


#### Client

Client 的使用类似于 requests 库，不过需要先初始化：``client = Client()``，对于表单来说还需要保证开启了 CSRF：
``csrf_enabled_client = Client(enforce_csrf_checks=True)``。

```python
import unittest
from django.test.client import Client

class PageTest(unittest.TestCase):
    def setUp(self):
        self.client = Client()

    def test_home(self):
        res = self.client.get('/')
        self.assertEqual(200, res.status_code)

    def test_login(self):
	"""普通测试。client 实例会自动解决 csrf 问题。"""
        res = self.client.get('/login/')

        self.assertEqual(200, res.status_code)
        self.assertIn('Username', res.content)

        res_post = self.client.post('/login/', {'username': 'windrunner', 'password': 'password', })

        self.assertEqual(200, res_post.status_code)
        self.assertIn('windrunner', res_post.content)

    def test_login_csrf(self):
	"""强制 csrf 检查"""
        self.client = Client(enforce_csrf_checks=True)
        res = self.client.get('/login/')
        csrf_token = '%s' % res.context['csrf_token'] 			# 获取 csrf_token

        res_fail = self.client.post('/login/', {'user': 'windrunner', 'pass': 'password', })
        self.assertEqual(403, res_fail.status_code) 			# 没有处理 CSRF token 会返回 403 错误代码

        res_csrf = self.client.post('/login/', {'user': 'windrunner', 'pass': 'password', 'csrfmiddlewaretoken': csrf_token, })
        self.assertIn('windrunner', res_csrf.content)

    def test_logout(self):
        res = self.client.post('/logout/')
        self.assertEqual(302, res.status_code)
```


#### testserver

testserver 命令的使用如下：

``django-admin testserver --addrport 7000 fixture1 fixture2``

它会首先创建一个测试数据，并导入 fixture 中的数据，适合配合 selenium 使用。


#### 提高测试速度

如果测试很耗费时间，会引起开发人员的不满，因而怠于编写测试，因此提高测试速度对于落实测试来说十分重要。
[这里](http://www.slideshare.net/cordiskinsey/djangocon-2013-how-to-write-fast-and-efficient-unit-tests-in-django)
总结了一些提升测试效率的方法：

1. 合理使用 ``setUpClass`` 和 ``tearDownClass`` 方法。作为类方法，在拥有多个测试方法时也只会在一个测试用例中执行一次。
2. 数据库很慢，避免使用数据库。一定需要的话，请使用内存数据库（比如 SQLite）。
3. 使用 [mock](http://mock.readthedocs.org/en/latest/getting-started.html)，避免使用 model。
4. 如果测试写起来很困难，说明需要重构了。

这部分建议对于 Python 项目基本上也适用。


### Flask

Flask 在写测试的时候需要主要 ``app_context`` 和 ``request_context`` 中的[陷阱](http://flask.pocoo.org/docs/0.10/appcontext/)。


### Tornado

Tornado 的 testing 库很简陋，主要是针对自身异步特性封装了一些工具。


### 前端页面测试

可以使用 selenium ，Firefox 下可以使用 Selenium IDE 编写测试脚本，但是针对样式的测试目前并没有完善的解决方案。

