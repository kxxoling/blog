# Docker 快速入门

首先声明，这里的系统环境设置为 Ubuntu 14.04，Mac OS 和 Windows 系统请在虚拟机里安装 Ubuntu，
其它 Linux 发行版 和 Ubuntu 不会有太大区别，请自行修改命令。


## Dockerfile 示例

### CentOS

#### MongoDB

参考：[CentOS/CentOS-Dockerfiles](https://github.com/CentOS/CentOS-Dockerfiles/blob/master/mongodb/centos7/Dockerfile)

```dockerfile
FROM centos:latest
MAINTAINER Kane Blueriver <kxxoling@gmail.com>

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install mongodb-server; yum clean all

RUN mkdir -p /data/db

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

EXPOSE  11211

CMD  ["memcached", "-u", "daemon"]
```


### Ubuntu

参考[dockerfile/mongodb](https://registry.hub.docker.com/u/dockerfile/mongodb/dockerfile/)

```dockerfile
FROM dockerfile/ubuntu

# 安装 MongoDB
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
