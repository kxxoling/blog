# 使用 docker 提供 PostgreSQL＋PostGIS 服务

首先我们需要在服务器上安装 docker，推荐使用官方源的最新版本：

	wget -qO- https://get.docker.com/ | sh
	sudo usermod -aG docker $(whoami)

然后我们需要将合适的 docker 镜像下载到本地：

	docker pull mdillon/postgis 	# 目前 star 数最多的 PostGIS 镜像，依赖于官方的 postgis 镜像。就选它了！
	docker pull postgres

下载完成之后可以运行 ``docker images`` 查看一下镜像状态：

	REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
	mdillon/postgis     latest              0dc590d693a7        3 weeks ago         586.2 MB
	postgres            latest              0f3af79d8673        3 weeks ago         265.7 MB

我这里没有指定版本，下载的是最新的 Postgres 9.5.2 和 PostGIS 2.2。

启动 PostGIS 后台服务：

	docker run --name postgis -e POSTGRES_PASSWORD=hellopg -d mdillon/postgis

由 postgres 镜像临时生成一个 container，并运行其中的 ``psql`` 程序连接 postgis container：

	docker run -it --link postgis:postgres --rm postgres sh -c 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U postgres'

按照提示输入密码（这里是 ``hellopg``）就可以进入熟悉的 psql 控制台了。运行 ``\d`` 可以看到已经生成好的 PostGIS spatial 数据库等等。

因为 postgis 镜像是基于的 postgres，所以这里我们也可以使用 postgis 镜像代替 postgres 镜像：

	docker run -it --link some-postgres:mdillon/postgis --rm mdillon/postgis sh -c 'exec psql -h 172.17.0.2 -p 5432 -U postgres'

上面这条命令中我使用了 docker 设置的绝对 IP 代替了之前的环境变量解决方案，这是因为在 postgis 镜像中没有能够成功获取到环境变量 ``POSTGRES_PORT_5432_TCP_ADDR`` 和 ``POSTGRES_PORT_5432_TCP_PORT``。

由于 container 通常是用过即弃，所以不应该将数据文件存放在其中。可以使用 docker volume 参数将主机目录挂载在 container 上：

	mkdir -p $HOME/pgdata
	docker run -v="$HOME/pgdata":"/data" --name postgis -e POSTGRES_PASSWORD=hellopg -e PGDATA="/data" -d mdillon/postgis

启动后你就可以在 ``$HOME/pgdata`` 目录中看到 postgis container 所创建的配置文件和数据库文件了。

	~ ❯ sudo ls ~/pgdata/base
	1  12374  12379  16384
	~ ❯ sudo ls ~/pgdata/
	...

