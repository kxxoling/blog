# Docker 最佳实践

> 本文衍生自官方的 [Best practices for writing Dockerfiles](https://docs.docker.com/articles/dockerfile_best-practices/) ，
> 在此之上增加了个人见解。
>
> 除此之外，官方还提供了几个标准的 Dockerfile 作为示例：
> 
> * [buildpack-deps](https://github.com/docker-library/buildpack-deps/blob/master/jessie/Dockerfile)
> * [Go](https://registry.hub.docker.com/_/golang/)
> * [Rails](https://registry.hub.docker.com/_/rails)


## 容器应该短命

docker 中的容器（container）应该是用过即弃的，每次使用时都应该重新从镜像（image）中构建。


## 使用 .dockerignore

docker 在构建过程中会把同目录中的所有 `.dockerignore` 和 `Dockerfile` 以外的文件打包发给镜像，
在文件过多时这会很耗时间。


## 每个容器一个进程

docker 的设计初衷就是应用级别的隔离。需要多个应用交互时请使用 link 命令组合。


## 容器的层数不宜过多

虽然从可读性来说，应该尽可能地拆分命令，但是官方并不推荐过度使用。


## 多行命令按字母排序

这会增加代码的可读性：

```
RUN apt-get update && apt-get install -y \
  bzr \
  cvs \
  git \
  mercurial \
  subversion
```


## cache

docker 在构建时，Dockerfile 的每一行都会新增一个 cache 层，如果不需要可以使用｀docker build --no-cache=true`
禁用。

使用 cache 时应该注意 cache 的有效情况。


## Dockerfile 命令

### FROM

尽可能使用官方镜像，官方镜像多是来自于精简版的 Debian。


### RUN

处于易读性的考虑，过长或者复杂的命令应该使用 `\` 分割成多行。
在使用 `apt-get` 时还需要注意：

* 不要单独使用 `RUN apt-get update`，会引起缓存问题
* 避免使用 `RUN apt-get upgrade` 或者 `dist-upgrade`，在 docker 镜像中执行升级命令可能会有权限问题。
* 推荐写法： `RUN apt-get update && apt-get install -y package-bar package-foo package-baz`


### CMD

CMD 命令只应该运行镜像所对应的命令。虽然允许 `CMD executable param1 param2` 的写法，
但是 `CMD [“executable”, “param1”, “param2”…]` 更不容易出错。

示例：

```
CMD ["apache2","-DFOREGROUND"]
CMD ["perl", "-de0"]
```

如果你熟悉 ENTRYPOINT 的话，推荐组合使用。


### EXPOSE

端口映射应该尽可能地使用默认端口。


### ENV

ENV 可以用于保证程序的正常运行，也可以用于容器的设置，还可以用于版本号的设置，这样维护起来更方便：

```
ENV PG_MAJOR 9.3
ENV PG_VERSION 9.3.4
RUN curl -SL http://example.com/postgres-$PG_VERSION.tar.xz | tar -xJC /usr/src/postgress && …
ENV PATH /usr/local/postgres-$PG_MAJOR/bin:$PATH
```

### ADD COPY

ADD 和 COPY 的功能类似，不过 COPY 命令的功能更加直观一些，因此推荐使用。

相比之下，ADD 支持添加远程资源，并且会自动 tar 打包或者解包。不过下载远程文件更推荐使用 `RUN wget` 或者 `curl`。


### ENTRYPOINT

ENTRYPOINT 应该用于 镜像的主命令，并使用 CMD 作为默认设置，以 s3cmd 为例：

```
ENTRYPOINT ["s3cmd"]
CMD ["--help"]
```

获取帮助：`docker run s3cmd`

执行命令：`docker run s3cmd ls s3://mybucket`

这在镜像名与进程重名时非常有用（没明白 ＝。＝）


ENTRYPOINT 也可以用于启动脚本：
COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
This script allows the user to interact with Postgres in several ways.

It can simply start Postgres:

docker run postgres

Or, it can be used to run Postgres and pass parameters to the server:

docker run postgres postgres --help

Lastly, it could also be used to start a totally different tool, such Bash:

docker run --rm -it postgres bash


### VOLUME

VOLUME 通常用作数据卷，对于任何可变的文件，包括数据库文件、代码库、配置文件……都应该使用 VOLUME 挂载。


### USER

推荐不需要特殊权限的命令在变更用户后执行，当然首先需要创建对应的用户。以 postgres 为例：`RUN groupadd -r postgres && useradd -r -g postgres postgres` 。

> Note: Users and groups in an image get a non-deterministic UID/GID in that the “next” UID/GID gets assigned regardless of image rebuilds.
> So, if it’s critical, you should assign an explicit UID/GID.

不过频繁地切换用户身份会增加不必要的 cache 层，不推荐切换用户后再切换回来。


### WORKDIR

使用 WORKDIR 而不要使用 `RUN cd … && do-something`，这样更便于阅读。


### ONBUILD

不太明白，不过官方给了一个例子：[Ruby’s ONBUILD variants](https://github.com/docker-library/ruby/blob/master/2.1/onbuild/Dockerfile)
