# Flask 命令行接口

[Flask][Flask] 0.11 发布的时候，引入了一个基于 Click 的命令行接口，而在此之前，基于 Flask 写命令行都是基于 Flask-Script 或者类似的扩展，最终得到的都是 ``python manage.py your_command`` 这样的 Django 模仿者。而 Flask-Script 的质量不错，得到了社区的一致认可，很多流行扩展都提供了 Flask-Script 的支持。

## 痛点

乍一看这个新特性，很多人恐怕怀有和我一样的想法，这违背了 Flask “pick the best tool for each task” 的设计哲学，Flask 内置的东西越来越多，也越来越臃肿。另一方面，这对于 [Flask-Script][Flask-Script] 的开发者也不公平，或许这正是 Flask-Script 开发不再活跃的原因。不过抛开这些情怀，Flask 命令行接口能给开发者带来哪些好处才是更值得我们关注的。

1. 更广泛的支持。Flask 的用户毫无疑问是多于 Flask-Script 的，Flask 扩展的开发者可以毫无旁鹜地支持 Flask。
2. **不再遭受因 SegmentFault 导致的开发环境退出的问题。**使用 ``flask run`` 启动的应用独立于 flask 管理程序，因此出现 SegmentFault 崩溃不会蔓延。
3. 基于 click，接口简单。

## 使用方法

Flask 命令行接口默认支持 ``run`` 和 ``shell`` 两个命令。

``flask run`` 会从环境变量中寻找 WSGI 应用等参数：``FLASK_APP=module_name:application_name flask run``，其中 ``application_name`` 默认是 ``app``，可以省略。因此可以写 ``FLASK_APP=wsgi flask run``。

``flask run`` 还会从环境变量中寻找 ``DEBUG`` 参数设置，可以用 ``1`` 表示开启，或者 ``0`` 关闭调试模式：``FLASK_DEBUG=1 flask run``。

``flask shell`` 则会提供一个简单的 Python REPL 调试环境，习惯于 IPython 的朋友可能不太开心。

### 自定义命令

Flask 命令行接口提供了于路由风格统一的装饰器接口：

```py
import click
from flask import Flask

app = Flask(__name__)

@app.cli.command()
def initdb():
    """Initialize the database."""
    click.echo('Init the db')
```

这样就可以在终端使用 ``flask initdb`` 了。

同样，你也可以自己调用 ``IPython.embed`` 创建一个 IPython REPL 环境：

```py
# Some imports...
@app.cli.command()
def shell_plus():
    from IPython import embed
    embed(user_ns={'app': app, 'db': db})
```

### 应用工厂

很多时候，我们会在 Flask 程序中使用应用工厂来创建应用实例，这尤其在测试中非常实用，Flask 命令行接口也提供了应用工厂的支持，这是官方示例：

```py
import os
import click
from flask.cli import FlaskGroup

def create_wiki_app(info):
    from yourwiki import create_app
    return create_app(config=os.environ.get('WIKI_CONFIG', 'wikiconfig.py'))

@click.group(cls=FlaskGroup, create_app=create_wiki_app)
def cli():
    """This is a management script for the wiki application."""

if __name__ == '__main__':
    cli()
```

## 扩展支持

已经有不少应用支持 Flask 命令行接口，比如 [Flask-Migrate][Flask-Migrate] 在初始化之后就可添加了 ``flask db xxx`` 命令。

[Flask-Migrate]: https://github.com/miguelgrinberg/flask-migrate
[Flask-Script]: https://github.com/smurfix/flask-script
[Flask]: https://github.com/pallets/flask
