# 侦测 Python web 应用中的僵尸代码

最近重构公司项目的时候发现有部分代码貌似从没有被调用或者执行，但并没十分把握，
所以需要一个能够分析代码调用情况的工具。在 StackOverflow 上得到的回答是
使用 [pylint] 这样的静态代码分析工具，或者代码覆盖率工具 [coverage.py]，
由于动态语言不在运行时难以确定变量类型，因此静态分析工具的准确度并不可靠，
Django 的应用注册方式就够它头疼的了，因此实际上可选方案只剩下第二条。


## coverage.py

[coverage.py] 是 Python 生态中代码覆盖率的默认标准，通常是配合测试工具一起使用，
用于检测未被覆盖的代码，比如我常用的命令是：

```shell
nosetests --with-coverage --cover-package=".coverage/" --cover-html --cover-html-dir=".cover-html/"
```

封装在插件中配合 ``nosetests`` 使用。不过这种情况下比较合适的方案还是直接调用 [coverage API]：

```python
import coverage

cov = coverage.coverage()

cov.start()             # 开始检测代码调用情况
cov.stop()              # 停止纪录
cov.save()              # 保存在 .coverage 中
cov.html_report()       # 生成 HTML 报告
```

当然我们还需要设定什么时候启动 ``coverage.py`` ，以及什么时候保存分析报告。[StackOverflow]
上给出的示例如下（gunicorn＋Django）：

```python
# wsgi_with_coverage.py
import atexit
import sys
import coverage

cov = coverage.coverage()
cov.start()

from wsgi import application  # adjust to python module containing your wsgi application


def save_coverage():
    print >> sys.stderr, "saving coverage"
    cov.stop()
    cov.save()

atexit.register(save_coverage)
```

注意：不要使用 ``Ctrl+c`` 终止程序，否则 ``atexit`` 会接收不到程序终止信号，正确的
结束方式是： ``kill -HUP $(cat <gunicorn_pidfile)`` 。


[pylint]: http://www.pylint.org
[coverage.py]: http://nedbatchelder.com/code/coverage/
[coverage API]: http://nedbatchelder.com/code/coverage/api.html
[StackOverflow]: http://stackoverflow.com/a/20689873/2836912

