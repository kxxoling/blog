# 使用 Let's Encrypt 生成免费的 SSL 证书

## 什么是 SSL？

SSL(安全套接层，Secure Sockets Layer)，及其继任者 TLS （传输层安全，Transport Layer Security）是为网络通信提供安全及数据完整性的一种安全协议。TLS 与 SSL 会在传输层对网络连接进行加密。

通过 SSL 加密，网站与用户之间的数据交互会更加安全，能够避免大多数的网络窃听问题。通常在登录以及涉及交易等安全要求比较高的情况下，应该要求强制 SSL 加密。

实际上，仅仅在登录页面提供 SSL 并不能真正解决安全问题，在公共 Wi-Fi 等公开环境下，攻击者依旧能够获得用户的登录 cookie 从而假冒用户身份，因此对网站进行全站加密是很有必要的。

2015 年，豆瓣、百度等众多网站终于在难以忍受运营商劫持以及嵌入广告等问题后，开启了全站 HTTPS，是国内 HTTPS 应用的一大里程碑。


## Let's Encrypt 是什么？

Let's Encrypt 是由互联网安全研究小组（ISRG，一个公益组织）于 2015 年末推出的数字证书认证机构，将通过旨在消除当前手动创建和安装证书的复杂过程的自动化流程，为安全网站提供免费的 SSL/TLS 证书。

Let's Encrypt 的使用相对简单，并且完全免费，是很多中小网站的首先。


## certbot 是什么？

根据[官方介绍][cerbot about]，Certbot 是一个简单易用的 SSL 证书部署工具，由 EFF 开发，前身即 Let’s Encrypt 官方（Python）客户端。Certbot 同时也支持其它支持 ACME 协议的 CA。

简单来说，cerbot 就是一个简化 Let's Encrypt 部署，和管理 Let's Encrypt 证书的工具。


## 安装和使用

### 安装

cerbot/Let's Encrypt 支持众多 Linux 发行版，也支持 BSD 平台，可直接使用相应的包管理工具进行安装：

```
sudo apt-get install letsencrypt -t jessie-backports # Debian 8
sudo apt-get install letsencrypt     # Debian testing/unstable, Ubuntu 16.04
sudo dnf install letsencrypt # Fedora
sudo pacman -S letsencrypt   # Arch
```

Ubuntu 14.04、CentOS、BSD 以及 Mac 下可以通过脚本安装：

```
wget https://dl.eff.org/certbot-auto
chmod a+x certbot-auto
```

获取证书：

```
certbot-auto certonly       # 如果安装的是 letsencrypt 把 certbot-auto 替换成 letsencrypt 即可
```

自动续期：

```
certbot-auto renew --quiet # CentOS/RHEL
```

## 部署 Nginx

```nginx
# 将所有 HTTP 请求指向 HTTPS
server {
        server_name example.com;
        listen 80;
        return 301 https://$server_name$request_uri;
}

# 监听 HTTPS 请求
server {
        server_name example.com;
        listen 443 ssl;

        # TLS 基本设置
        ssl_certificate /path/to/your/fullchain.pem;
        ssl_certificate_key /path/to/your/privkey.pem;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

        # 网站的其它设置不变
        # [...]
}
```


参考链接：

- [Let’s Encrypt 官网](https://letsencrypt.org/)
- [certbot 官网](https://certbot.eff.org/)


[cerbot about]: https://certbot.eff.org/about/

