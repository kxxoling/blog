# 在 docker 中运行 Jupyter notebook

Jupyter 是个好东西，提供了简单易用的 web REPL 环境，并且可以根据工作语言选配不同的 kernel 提供不同的功能。但是，由于常常用作测试所用，因此对于我这样的“洁癖患者”来说，保持后台常驻和环境清洁实在是非常终于，于是我想到了 docker，实在是 Jupter 运行容器的不二之选。

本来打算自己定制一个的，不过一番搜索后发现官方提供了更为详细和成熟的 docker 镜像，实在是可喜可贺，这里简单说一下用用法和自己的设置。

### 官方镜像

[官方](https://github.com/jupyter/docker-stacks)提供了 ``base-notebook``、``minimal-notebook``、``all-spark-notebook``、``pyspark-notebook``、``scipy-notebook``、``datascience-notebook``、``tensorflow-notebook`` 以及 ``r-notebook`` 可选。根据自己的需要选择合适的镜像即可，通常 ``base-notebook`` 就够用了，这里便以它为例。

启动：``docker run --remove -P jupyter/base-notebook``，这里 ``--remove`` 表示，因此在其中安装的程序、插件并不会在系统中留下任何痕迹；``-P`` 则是为镜像中 expose 的所有端口都分配一个随机的本地映射。

可以输入 ``docker ps`` 查看刚启动的 container 实例：

```
~ docker ps
CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS              PORTS                     NAMES
2c3a5876de9b        jupyter/base-notebook   "tini -- start-notebo"   12 minutes ago      Up 12 minutes       0.0.0.0:32768->8888/tcp   kickass_davinci
```

可以看到这里自动将系统的 ``0.0.0.0:32768`` 映射到了 container 中的 8888 端口，这时局域网内任何机器都可以访问 ``http://<你的 IP>32768`` 打开 Jupyter notebook 页面。

为了保持可控性，可以将 ``-P`` 替换为 ``-p 18888:8888``，确保每次启动 container 实例时都会自动映射到 18888 端口。

该镜像并没有提供更多的配置选项，不过通过直接查看配置文件可以获知实例中的用户名为 ``jovyan``，Jupyter 的活动目录是 ``/home/jovyan/``，并且可以挂载出来：

另外，我们还可以使用 ``--restart`` 指令让容器随系统启动，并在出现问题时自动重启。

于是：

```sh
mkdir $HOME/nbs
docker run -d --restart=always --name=jupyter -p 18888:8888 \
-v $HOME/nbs:/home/jovyan/ \
jupyter/base-notebook
```

如果访问 ``localhost:18888`` 出现权限错误，可以使用 ``docker logs jupyter`` 来输出该容器的标准输出流，你可能看到一串类似 ``http://localhost:8888/?token=3c32ac9203dc507d0d6bbcc191c83c650c081308100eb397`` 的带 token 的 URL，将 8888 替换为我们的 18888 在浏览器中打开即可完成验证。

### IHaskell

除了官方镜像外，还有很多其它 docker 镜像可以使用，比如 [IHaskell](https://github.com/gibiansky/IHaskell)，使用 IHaskell kernel 替代默认的 IPython kernel，适合用于学习 Haskell 使用。

最终启动命令：

```sh
docker run -d \
-v $(HOME)/nbs:/notebooks \
-p 18899:8888 \
gibiansky/ihaskell
```

会提供 Haskll 和 IPython2 两个 kernel。

不过这个镜像略显臃肿，会占用比较大的磁盘空间。


## 远程访问

如果还需要远程访问这些端口，可以使用 ssh tunnel 或者 ngrok。
