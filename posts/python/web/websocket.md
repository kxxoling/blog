# WebScoket

在诸多 Python 框架之中，Tornado 内建了 WebSocket 的支持，只需要从 ``tornado.websocket``
中引入特定的 Handler 即可使用。在网上搜了个简单的 WebSocket 的实现，
稍微再简化了一下当作学习用的 WebSocket 服务器：

```python
import logging
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.websocket


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write('Hello, This is a WebSocket tester!')


class ChatSocketHandler(tornado.websocket.WebSocketHandler):
    def send_message(self, message):
        for handler in ChatSocketHandler.socket_handlers:
            try:
                handler.write_message(message)
            except:
                logging.error('Server: Error sending message', exc_info=True)


    def open(self):
        ChatSocketHandler.socket_handlers.add(self)
        self.send_message('Server: A new user has entered the chat room.')

    def on_close(self):
        ChatSocketHandler.socket_handlers.remove(self)
        self.send_message('Server: A user has left the chat room.')

    def on_message(self, message):
        logging.message('Server: %s' % message)
        self.send_message(message)


def main():
    application = tornado.web.Application([
        ('/', MainHandler),
        ('/socket', ChatSocketHandler)
    ])
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8000)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()
```

在本地运行将会提供一个 WebSocket 广播地址：`ws://localhost:8000/socket`


客户端部分需要一个支持 WebSocket 的现代浏览器。如果浏览器支持 WebSocket，
那么可以在控制台运行下面代码初始化一个 WebSocket 连接：

```javascript
ws = new WebSocket("ws://localhost:8000/socket");
ws.onopen = function(e) {
    console.log('Client: WS is opening')
}
ws.onmessage = function(evt) {
    console.log('Client: WS is getting data: ' + e.data)
}
```

如果使用的是 Chrome，就可以在控制台网络选项卡中看到一个 path 为 socket 的连接，
状态为 `101 Switch Protocols` 。点开请求，在 Frames 子选项卡中可以看到所有
WebSocket 信息。在控制台中输入下面的代码就可以观察到有新数据产生：

```javascript
ws.send("Client: I'm sending data!");
```
