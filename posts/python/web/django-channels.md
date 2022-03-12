# Django Channels

[Django Channels][channels] 是一个为 Django 提供异步扩展的库，通常主要用来提供 WebSocket 支持和后台任务。

## 原理

它的原理是将 Django 分为 2 种进程类型：

- 一个用于处理 HTTP 和 WebSocket 的协议服务
- 一个用于运行视图、WebSocket handler 以及后台任务的 worker 服务

两者通过 [ASGI](https://channels.readthedocs.io/en/stable/asgi.html) 协议通信，类似与 WSGI 但是运行在网络层上，并且支持更多协议。

Django Channels 并没有引入 asyncid、gevent 或者其它异步库，所有业务逻辑都在同一个业务进程/线程中同步运行。

细节请阅读 [Django Channels docs/concepts](https://channels.readthedocs.io/en/stable/concepts.html)

## 前提

想要运行 Django Channels 首先需要一个 ASGI 服务器，比如 [Daphne](http://github.com/django/daphne/)，使用 Django worker 服务器运行：``./manage.py runworker``，以及 ASGI 请求的通道服务，比如 Redis。

即使启用 channels，所有的 HTTP 请求依旧是默认经过 Django 视图系统，因此可以无缝迁移过来。

## 好处

- 易用的支持数以千计客户端的 HTTP long-poll 支持
- 类似 Django 原生的 WebSocket 的会话和验证支持
- 自动根据 cookie 为 WebSocket 提供登录
- 大量事件触发底层支持
- 0 宕机部署支持
- 特定 URL 的底层 HTTP 控制
- 可扩展支持其它协议或者事件源（例如 WebRTC、UDP、SMS）
- Django 的官方支持

## 基本概念

### ``channel``

Django Channels 的核心数据解构叫做 ``channel``，它是一个有序的 FIFO 队列，支持信息过期，对于一个监听器至多投递一次。类似于任务队列──信息由 producer 投递至 channel，并设置一个 consumer 监听该 channel。

**注意消息投递是至多一次，因此遇到应用崩溃等情况会导致消息丢失。**

Django Channels 的理念和 Go 语言内置的 channel 概念类似，不同之处在于 Django Channels 是网络透明的，因此 producer 和 consumer 通信可以穿越不同机器。在同一个网络中，Django Channels 的频道是根据名称属性区分的，如果你向一个名为 ``http.request`` 的 channel 发送信息，都是发送向同一个 channel。而对于不同网络中则不一样，channel 是网络隔离的。

### consumer

“consumer”（消费者）是 channels 架构中处理请求的部分，和 Django 有 view 函数和 ViewClass 一样，consumer 也支持类式写法。例如你要处理 WebSocket 请求，可以实现一个 ``WebsocketConsumer`` 的子类，并通过 ``route_class`` 函数将该 consumer 与 URL 连接起来。

#### consumer 函数

#### consumer 类

```python
from channels.generic.websockets import WebsocketConsumer

class MyConsumer(WebsocketConsumer):
    http_user = True         # 设置为 ``True`` 将会自动从 HTTP cookie 中登录用户，因此可以省去 channel_session_user 的设置。
    strict_ordering = False  # 默认设置

    def connection_groups(self, **kw):
        """返回 group 列表，并自动将本连接插入其中活删除
        """
        return ['test']

    def connect(self, message, **kw):
        """连接开始
        """
        self.message.reply_channel.send({'accept': True})

    def receive(self, text=None, bytes=None, **kw):
        """接收到信息时调用的函数
        """
        self.send(text=text, bytes=bytes)  # 将信息原封不动地返回

    def disconnect(self, message, **kw):
        """断开连接时将会被调用
        """
        pass
```

#### ``JsonWebsocketConsumer``

```python
from channels.generic.websockets import JsonWebsocketConsumer

class MyConsumer(JsonWebsocketConsumer):
    """使用与 WebsocketConsumer 基本一致
    """
    def receive(self, content, **kwargs):
        """这里的 content 会是 JSON 解码后的 Python 对象
        """
        self.send(content)

    # JsonWebsocketConsumer 实际上在接收到信息后调用了下面的方法，你也可以重载它们来调用自己的 JSON 编、解码器
    # @classmethod
    # def decode_json(cls, text):
    #     return my_custom_json_decoder(text)
    #
    # @classmethod
    # def encode_json(cls, content):
    #     return my_custom_json_encoder(content)
```

### 多通道 WebSocket

channels 还支持多个数据复用同一个 WebSocket，只需要使用 ``Demultiplexer`` 来分流。

```python
from channels.generic.websockets import WebsocketDemultiplexer, JsonWebsocketConsumer

class EchoConsumer(JsonWebsocketConsumer):
    def connect(self, message, multiplexer, **kwargs):
        # 通过 multiplexer 发送消息
        multiplexer.send({"status": "I just connected!"})

    def disconnect(self, message, multiplexer, **kwargs):
        print("Stream %s is closed" % multiplexer.stream)

    def receive(self, content, multiplexer, **kwargs):
        multiplexer.send({"original_message": content})  # 原封不动地返回消息

class AnotherConsumer(JsonWebsocketConsumer):
    def receive(self, content, multiplexer=None, **kwargs):
        # 你的实现
        pass

class Demultiplexer(WebsocketDemultiplexer):
    # Wire your JSON consumers here: {stream_name : consumer}
    consumers = {
        "echo": EchoConsumer,
        "other": AnotherConsumer,
    }
```

### ``Group``

### 会话和用户

如上面所提到的，你可以通过设置 consumer 类的 ``channel_session`` 或者 ``channel_session_user`` 属性来设置用户会话。也可以设置 ``http_user`` 使用 Django 的 Session 和 User。之后便可以获取 ``message`` 对象的 ``channel_session`` 和 ``user`` 属性了。

对于函数 consumer，则可以使用 ``channels.auth.channel_session_user`` 等装饰器达到相同效果：

```python
from channels.routing import route
from channels import Group
from channels.auth import channel_session_user, channel_session_user_from_http

@channel_session_user_from_http
def connect(message):
    pass

@channel_session_user
def disconnect(message):
    pass

channel_routing = [
    route('websocket.connect', connect),
    route('websocket.disconnect', disconnect),
]
```

### backend

backend 是为 Django Channels 提供 channel 异步通信的后端，推荐使用 Redis 作为 backend。

根据 backend 的不同，channels 的行为可能会有所不同，比如 ``asgi_ipc.IPCChannelLayer`` 作为 backend 部署起来更简单，但是并不支持网络间通信。``asgi_redis.RedisChannelLayer`` 虽然支持网络间通信，但是需要额外的 Redis 服务器支持。

Django Channels 支持 Redis、IPC 以及内存间通信，开发者可以根据应用场景和部署环境灵活选择 backend。

## 部署

### [设置 backend](https://channels.readthedocs.io/en/stable/deploying.html#setting-up-a-channel-backend)

需要在 Django 的 settings 里定义 ``CHANNEL_LAYERS``：

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",      # 使用 asgi_redis 作为 backend
        "ROUTING": "my_project.routing.channel_routing",   # 指定路由文件
        "CONFIG": {
            "hosts": [("localhost", 6379)],             # 设置 Redis 的地址和端口
        },
    },
}
```

### [运行 worker 服务器](https://channels.readthedocs.io/en/stable/deploying.html#run-worker-servers)

前面也提到了，Django Channels 将服务器解耦为协议服务器和 worker 服务器，因此也推荐单独部署 worker 服务器：``python manage.py runworker``。

如果有需要，你甚至可以将不同的 channel 分别部署，Django Channels 支持 ``--only-channels`` 和 ``--exclude-channels`` 用于过滤：

```
python manage.py runworker --only-channels=http.* --only-channels=websocket.*
python manage.py runworker --exclude-channels=thumbnail
```

### [运行接口服务器](https://channels.readthedocs.io/en/stable/deploying.html#run-interface-servers)

由于 Django Channels 实现的是 ASGI 协议而不是 WSGI，因此你需要使用 ASGI 服务器来运行 channels 应用，例如 [Daphne](http://github.com/django/daphne/)。使用 Daphne 还有一个好处就是，它会自动区分 HTTP 请求和 WebSocket 请求，因此并不需要分别启动两个服务器。

和 WSGI 应用部署类似，部署 ASGI 应用也需要首先指定 ASGI 应用本身，我们可以仿照 Django ``wsgi.py`` 的写法创建一个这样的 ``asgi.py`` 文件：

```python
# coding: utf-8

import os
from channels.asgi import get_channel_layer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_project.settings")

channel_layer = get_channel_layer()
```

然后运行 Daphne：``daphne my_project.asgi:channel_layer``

### [更新代码](https://channels.readthedocs.io/en/stable/deploying.html#deploying-new-versions-of-code)

更新代码后需要重启服务器，只要新代码兼容旧代码的会话。默认情况下，重启服务器意味着向服务器发送 ``SIGTERM`` 信号，服务器会在运行中的 consumer 执行完成以后重启并加载新代码。

### [同时运行 ASGI 和 WSGI](https://channels.readthedocs.io/en/stable/deploying.html#running-asgi-alongside-wsgi)

对于较大的项目，一个 ASGI 服务器 + 少许 worker 进程可能并不够用，这时推荐将 ASGI 和 WSGI 分离部署，更容易横向扩展。

## [测试 consumer](https://channels.readthedocs.io/en/stable/testing.html#testing-consumers)

Django Channels 提供了一系列用于测试 channels consumer 的类，和 Python unittest 库兼容，详情见上链接。

[channels]: https://channels.readthedocs.io/
