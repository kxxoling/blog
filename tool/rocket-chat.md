# Slack 的开源替代品——RocketChat

在使用 RocketChat 之前，公司内部一只使用的微信和 QQ 进行沟通和交流，但是这两者的易用性和开放性着实很差，对于开发者而言尤其如此！让人不由得怀念起使用 Slack 的日子（虽然经常遇到掉线问题）。

不过 Slack 在国内的可用性也是个大问题，毕竟连其它开发同事都不能保证能够正常使用，自己部署更是不可能。

好在开源社区的开发者贡献了一个叫做 RocketChat 的应用，提供了 Slack 的基础功能、开放的 API、与 GitLab 的良好集成——这正是我们所想要的！

## RocketChat 是什么？

一个开源、开放、功能强大、基于 Meteor 和 MongoDB 的 Slack 替代软件。

## 特色功能

### [在线聊天 LiveChat](https://rocket.chat/docs/administrator-guides/livechat/)

提供在线客服一样的在线聊天功能，支持游客登录等基本功能。

![RocketChat LiveChat](https://cdn-www.rocket.chat/images/screenshots/livechat.png)

### [第三方平台支持](https://rocket.chat/docs/administrator-guides/integrations)

内置了常见代码托管服务比如 GitHub、GitLab、BitBucket 的支持，内置了错误管理系统 Sentry 的支持，内置了 bug 管理系统 ReviewBoard 的支持。

### [语音和视频支持](https://rocket.chat/docs/user-guides/voice-and-video-calls/)

配置好 HTTPS 之后，将可以开启 RocketChat 的在线视频以及发送语音信息功能。

### 全平台客户端

客户端使用了 Hybrid 技术，因此兼容 Mac、Linux、Windows、iOS、Android 等主流操作系统。

iOS 平台的消息推送需要配置自己的凭证信息。

### bot 支持

官方提供了[Hubot 的支持](https://github.com/RocketChat/hubot-rocketchat)。

### OAuth

内置了 WordPress、GitHub、Google 等网站的支持，也支持自定义 OAuth 系统的支持，可以据此将其与内部其它系统打通。


## 安装 RocketChat

跟人比较喜欢[通过 docker 安装](https://rocket.chat/docs/installation/docker-containers/)，官方也提供了 Heroku、GCE 等平台的一键部署配置。详见官方文档就可以了。


## 配置

### SSL 证书设置

由于视频、语音等功能仅支持 HTTPS 情况下开启，因此 SSL 整数是少不了的，推荐[使用 Let's Encrypt 配置](/sa/lets-encrypt.html)。

### Nginx 配置 WebSocket 代理

完整的 Nginx 配置文件：

```nginx
upstream chat {
        server 127.0.0.1:8818;      # RocketChat 默认端口
}

server {
      listen 80 default;
      server_name chat.example.com;    ## 修改为你的域名
      rewrite ^ https://$server_name$request_uri? permanent;      ## 将所有 http 请求转发到 https
}

server {
    listen 443 ssl;
    server_name chat.example.com;      ## 修改为你的域名
    client_max_body_size 20m;

    gzip on;
    gzip_vary on;
    gzip_http_version 1.0;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json text/javascript;

    ssl_certificate /etc/letsencrypt/live/chat.example.com/fullchain.pem;      ## 根据证书配置修改
    ssl_certificate_key /etc/letsencrypt/live/chat.example.com/privkey.pem;

    ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    location / {
        proxy_pass https://chat;
        proxy_set_header Host $http_host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```


## 一些问题

- 更新部分配置需要重启服务器。暂时没有解决办法，不过社区正在设法解决。
- 音、视频服务强制要求 SSL。推荐 Lets Encrypt 免费证书。
- 配置要求高。Meteor 的缺点，不过得益于 Node.js 的异步特性，可以支持比较高的并发。

