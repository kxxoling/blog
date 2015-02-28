# Docker 快速入门

首先声明，这里的系统环境设置为 Ubuntu 14.04，Mac OS 和 Windows 系统请在虚拟机里安装 Ubuntu，
其它 Linux 发行版 和 Ubuntu 不会有太大区别，请自行修改命令。


## Docker 命令

Docker 可以通过命令来构建镜像，也可以根据 Dockerfile 配置来构建。
docker 命令与 Dockerfile 的对应关系如下：


## Dockerfile

### 命令

#### WORKDIR

#### ENV

#### USER

#### VOLUME

#### ADD

向镜像中添加特定文件，可以是主机中或者 web 文件。以 WordPress 的 Dockerfile 为例：

```dokcerfile
ADD http://wordpress.org/latest.zip /var/www/wordpress.zip
```

#### ONBUILD

#### RUN
#### CMD
#### ENTRYPOINT

### CentOS

#### MongoDB

参考：[CentOS/CentOS-Dockerfiles](https://github.com/CentOS/CentOS-Dockerfiles/blob/master/mongodb/centos7/Dockerfile)

```dockerfile
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

```dockerfile
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

```dockerfile
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

```dockerfile
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

构建好自己的镜像后可以将其 push 到 Registry 上进行分享，默认的 Registry 由 Docker Hub 提供，
如果镜像中存在隐私内容也可以使用 Docker 公司的源代码搭建内部的共享服务器。

### 登录

### Push

### 自动构建

### 搭建自己的 Docker Registry



## 使用 Docker 进行 web 开发

### 多个容器互联

### 持续集成
Drone
Shippable



## 快速编配

Docker 公司还提供了快速编配工具 xxx（原 Fig）用于加速 Docker 环境的部署。

