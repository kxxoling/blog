# Docker 快速入门

## 基本概念

Docker 是基于 Linux kernel
的虚拟化工具，仅需要极低的系统资源使用就提供了
强大的虚拟化、资源隔离能力。使用
Docker，用户只需要几分钟即可以将应用程序 “Docker
化”，并且由于其易于复制分享的优点，能够保证开发与部署环境的一致性。

Docker 的基本结构包括：

1.  Docker 客户端和服务器（C/S）
2.  Image
3.  Registry
4.  Container

在本地安装 Docker 之后，即完成了 Docker C/S 的安装。用户使用 Docker
客户端向 Docker 的守护进程发送命令操作 Container。

Image（镜像）类似于应用的源代码，你可以通过修改源代码（Image）来构建出不同的
Container。 Registry（）类似于源码的托管服务器，默认的 Registry 是
Docker 公司提供的 Docker Hub， 你可以将 Docker Hub 类比于 GitHub。

Container 是 Docker 最重要的概念，它通过操作相应的镜像提供一个执行环境。

使用 Docker，可以快速构建很分享应用程序部署服务器、开发环境、CI
环境或者一个应用服务。

首先声明，这里的系统环境设置为 Ubuntu 14.04，Mac OS 和 Windows
系统请在虚拟机里安装 Ubuntu， 其它 Linux 发行版 和 Ubuntu
不会有太大区别，请自行修改命令。

使用 Ubuntu（我自己安装的是 Xubuntu） 的好处：

-   相比 Boot2docker 来说更加强大，比如我可以通过安装 zsh +
    zsh-docker-completetion 提供 docker 自动补全功能。
-   获得最新最强大的官方支持，Docker 官方推荐使用 Ubuntu，对 Ubuntu
    下的问题也能够最及时解决， 甚至某些工具不提供 Mac OS 或者 Windows
    兼容方案。
-   相对于其它 Linux 发行版用户更多，使用更简单。
-   推荐在虚拟机中安装 Xubuntu，和 Ubuntu 相比，Xubuntu
    更轻量，在虚拟机中性能更好； 在虚拟机中安装 Xubuntu
    便于对开发环境的迁移以及内部共享。


## 创建 docker 用户组

docker 守护进程需要绑定 Unix socket 而非 TCP 端口，而 Unix Socket 通常需要管理员权限，
因此在运行 docker 命令时常常需要输入 sudo 命令以获取相应权限，同时还会影响
oh-my-zsh 自动补全插件的正常使用。

你可以通过创建一个 docker 用户组并将当前用户加入组中来解决这个问题：

```shell
sudo usermod -aG docker $(whoami)
```

如果还有问题，可以尝试注销当前用户并重新登录。


## Docker 命令

Docker 可以通过命令来构建镜像，也可以根据 Dockerfile 配置来构建。 docker
命令与 Dockerfile 的对应关系如下：

## Dockerfile

### 命令

#### WORKDIR

#### ENV

#### USER

#### VOLUME

#### ADD

向镜像中添加特定文件，可以是主机中或者 web 文件。以 WordPress 的
Dockerfile 为例：

``` {.sourceCode .dockerfile}
ADD http://wordpress.org/latest.zip /var/www/wordpress.zip
```

#### ONBUILD

#### RUN

#### CMD

#### ENTRYPOINT

### CentOS

#### MongoDB

参考：[CentOS/CentOS-Dockerfiles](https://github.com/CentOS/CentOS-Dockerfiles/blob/master/mongodb/centos7/Dockerfile)

``` {.sourceCode .dockerfile}
FROM centos:latest
MAINTAINER Kane Blueriver <kxxoling@gmail.com>

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install mongodb-server; yum clean all

RUN mkdir -p /data/

# 设置挂载点
VOLUME ["/data/mongo"]

# Define working directory.
WORKDIR /data

CMD ["mongod"]

EXPOSE 27017
ENTRYPOINT ["/usr/bin/mongod"]
```

#### Redis

参考：[CentOS/CentOS-Dockerfiles](https://github.com/CentOS/CentOS-Dockerfiles/blob/master/redis/centos7/Dockerfile)

``` {.sourceCode .dockerfile}
FROM centos:latest
MAINTAINER Kane Blueriver <kxxoling@gmail.com>

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install redis; yum clean all

# 设置挂载点
VOLUME ["/data/redis"]

# Define working directory.
WORKDIR /data

EXPOSE 6379

CMD ["redis-server"]
```

#### Memcached

参考：[CentOS/CentOS-Dockerfiles](https://github.com/CentOS/CentOS-Dockerfiles/blob/master/memcached/centos7/Dockerfile)

``` {.sourceCode .dockerfile}
FROM centos:latest
MAINTAINER Kane Blueriver <kxxoling@gmail.com>
RUN  yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install memcached; yum clean all

VOLUME ["/data/mc"]

WORKDIR /data

CMD ["memcached"]

EXPOSE  11211

CMD  ["memcached", "-u", "daemon"]
```

### Ubuntu

参考[dockerfile/mongodb](https://registry.hub.docker.com/u/dockerfile/mongodb/dockerfile/)

``` {.sourceCode .dockerfile}
FROM dockerfile/ubuntu

# 从官网安装 MongoDB
RUN \
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
  echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
  apt-get update && \
  apt-get install -y mongodb-org && \
  rm -rf /var/lib/apt/lists/*

# 设置挂载点
VOLUME ["/data/db"]

# Define working directory.
WORKDIR /data

CMD ["mongod"]

# 27017: process
# 28017: http
EXPOSE 27017
EXPOSE 28017
```

## 分享

构建好自己的镜像后可以将其 push 到 Registry 上进行分享，默认的 Registry
由 Docker Hub 提供， 如果镜像中存在隐私内容也可以使用 Docker
公司的源代码搭建内部的共享服务器。

### 登录

### Push

### 自动构建

### 搭建自己的 Docker Registry

## 使用 Docker 进行 web 开发

### 多个容器互联

### 持续集成

Drone Shippable

## 快速编配

Docker 公司还提供了快速编配工具 compose（原 Fig）用于加速 Docker
环境的构建。

安装：

``` {.sourceCode .shell}
pip install docker-compose
```

下面以一个标准的 Python WSGI 应用为例，介绍 compose 的使用方法。

### WSGI 应用

首先你需要一个 WSGI 应用，这里以一个简单的 Flask 应用为例：

``` {.sourceCode .python}
from flask import Flask
from redis import Redis
import os
app = Flask(__name__)
redis = Redis(host='redis', port=6379)

@app.route('/')
def hello():
    redis.incr('hits')
    return 'Hello World! I have been seen %s times.' % redis.get('hits')

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
```

标准的 Python 应用还需要提供一个 requirements.txt 记录其依赖——flask 和
redis：

``` {.sourceCode .text}
flask
redis
```


### Dockerfile

定制一个 Flask 应用的运行环境：

``` {.sourceCode .dockerfile}
FROM python:2.7
ADD . /code
WORKDIR /code
RUN pip install -r requirements.txt
```


### 定义服务

定义 `docker-compose.yml`
配置文件，装配应用运行环境所需组件（Container、Volume 等）：

``` {.sourceCode .yaml}
web:
  build: .
  command: python app.py
  ports:
   - "5000:5000"
  volumes:
   - .:/code
  links:
   - redis
redis:
  image: redis
```

上面的配置文件定义了 2 个服务：

-   web：根据本地 Dockerfile 构建出的 Image，提供一个 WSGI 应用的运行环境，
    将 Docker 中的 5000 端口映射到主机的 5000 端口，并将本目录挂载到 Container
    的 /code 目录。并且链接到 redis 服务。

-   redis：基于 Docker Hub 的 redis 公开镜像构建的 Container。


### 构建以及运行

构建：

``` {.sourceCode .shell}
docker-compose up
```

运行：

``` {.sourceCode .shell}
docker-compose run web env
```

停止：

``` {.sourceCode .shell}
docker-compose stop
```
