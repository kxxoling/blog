# netdata 安装小记

[netdata ![netdata](https://img.shields.io/github/stars/firehol/netdata.svg?style=social&label=Star)](https://github.com/firehol/netdata)
是一个 Linux 实时监控工具，支持应用程序、网络状况、用户/用户组，甚至 docker/lxc 和 SNMP 的监控。

![netdata](https://cloud.githubusercontent.com/assets/2662304/14092712/93b039ea-f551-11e5-822c-beadbf2b2a2e.gif)

## 安装

### 安装准备

这里我选择的是手动安装：

```sh
# Debian / Ubuntu
sudo apt-get install zlib1g-dev uuid-dev libmnl-dev gcc make git autoconf autoconf-archive autogen automake pkg-config
# 安装其它非必需插件，建议安装 nodejs，不过我已经安装过了。
apt-get install curl jq
```

### 安装 netdata 到本机

netdata 并没有提供安装包，所以需要从源码安装：

```sh
git clone https://github.com/firehol/netdata.git --depth=1
cd netdata

sudo ./netdata-installer.sh     # 由于需要安装系统监控程序，管理员权限是必须的
# 如果想要指定安装目录可以 `./netdata-installer.sh --install /opt`，这样 netdata 将会安装在 `/opt/netdata`。
```

安装的时候提示：

- the daemon    at /usr/sbin/netdata
- config files  at /etc/netdata
- web files     at /usr/share/netdata
- plugins       at /usr/libexec/netdata
- cache files   at /var/cache/netdata
- db files      at /var/lib/netdata
- log files     at /var/log/netdata
- pid file      at /var/run

### 设置开机启动（使用 systemd）

```sh
sudo killall netdata # 终止 netdata 进程
sudo cp system/netdata.service /etc/systemd/system/ # 将 netdata.service 复制到 systemd 服务目录
sudo systemctl daemon-reload # systemd 加载新服务
sudo systemctl enable netdata # 设置开机启动
sudo service netdata start # 启动 netdata
```

### 内存去重

netdata 提示我可以开启内存去重（memory de-duper/Kernel Same-page Merging）：

```sh
echo 1 >/sys/kernel/mm/ksm/run; echo 1000 >/sys/kernel/mm/ksm/sleep_millisecs
```

据说可以节省 40%-60% 的内存开销！

### 更新 netdata

```sh
cd /path/to/git/downloaded/netdata
git pull
./netdata-installer.sh
```

### 查看 netdata

打开 ``http://127.0.0.1:19999/``，netdata 默认开放外部访问，因此可以在局域网打开 ``http://host-to-netdata:19999/`` 开启监控。


