# Flask 与 Tornado 中的路由定义

Flask 和 Tornado 是我现在最“熟悉”的两个 Python web 框架，各自都具备一些别具一格的特性，
在很多实现上都走了截然不同的道路。它们的路由实现分别代表了 Python web 框架的两大风格：

Flask 使用函数作为 web 请求的 Handler，这一点和早期的 Django 是一致的，
不过 Django 似乎是 1.7 以后推荐使用 class 作为 Handler。和 Django 不同的是，
Flask 使用装饰器注册路由，同类型的框架还有 Bottle。

```python
# flaskapp.py
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()
```

说到 class handler，web.py 就是其中很有名的
一个，而 Tornado 的最初的灵感就是来自 web.py，Tornado 和 web.py 在路由方面都是
使用路由元组做配置。

```python
import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

application = tornado.web.Application([
    (r"/", MainHandler),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
```

（上面两段代码分别来自 Flask 和 Tornado 官方的示例教程。）


当然，并不是说 Flask 和 Tornado 就不能使用对方的路由配置模式了，
这里提供两个简单的实现抛砖引玉：


## 使用路由元组的 Flask

Flask 在路由方面[支持惰性加载](http://flask.pocoo.org/docs/0.10/patterns/lazyloading/)，
提供了 `Flask.add_url_rule()` 函数用于手动注册路由：

```python
import flask


class Flask(flask.Flask):
    def add_url_rules(self, url_rules):
        for url_rule in url_rules:
            self.add_url_rule(url_rule[0], view_func=url_rule[1])


def hello():
    return "Hello World!"


app = Flask(__name__)
app.add_url_rules([("/", hello)])


if __name__ == "__main__":
    app.run()
```


## 使用装饰器配置路由的 Tornado

上面的 “Hello World” 修改如下：

```python
# app.py
import tornado.ioloop
import tornado.web


class Application(tornado.web.Application):
    def route(self, pattern):
        def _(handler):
            handler_pattern = [(pattern, handler)]
            self.add_handlers(".*$", handler_pattern)
            return handler
        return _


app = Application()


@app.route(r"/")
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")


if __name__ == "__main__":
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
```
