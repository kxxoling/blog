# 使用 autossh 建立反向 SSH 隧道管理个人计算机

假设你有这样一个需求：你在家中有一台 Linux/Unix 设备，可以是路由器、NAS 或者台式机，存有自己常用工具或者数据，想要在自己外出时也能随时访问。那么你现在的目的和我一样了，你所需要的是少许 Linux/Unix 经验以及一台能够从公网访问的中继服务器。我们所需要的技术是通过 SSH 隧道搭建一个反向代理。

## 配置

在你的 SSH 配置文件中加入这一行 ``GatewayPorts clientspecified``。可以直接使用命令：``sudo echo "GatewayPorts clientspecifie" >> /etc/ssh/sshd_config``。

然后重新加载 SSH 配置文件：``sudo reload ssh``。

然后在本地建立连接： ``ssh -f -R 0.0.0.0:20000:localhost:22 local_user@a_a_a_a``

现在还有两个问题：你需要保持终端开启防止 SSH 进程被关闭；由于网络故障/波动导致 SSH 终断时无法自动重连。

前者可以使用 ``-N`` 参数来解决，后者需要 ``supervisor`` 等第三方监控工具。

## 使用 autossh 代替 ssh

不过我们还有一个更常用的选择方案：``autossh``：

```
autossh -M 20001 \
-fN -o "PubkeyAuthentication=yes" \
-o "StrictHostKeyChecking=false" -o "ServerAliveInterval 60" -o "ServerAliveCountMax 3" \
-R a_a_a_a:20000:localhost:22 \
-p 8383 remote_user@a_a_a_a
```

说明：
- ``-M 20001`` 选项指定中继服务器上的监视端口，用于交换监视 SSH 会话的测试数据，需要保证该端口在服务器上未被占用。
- ``-o`` 用于设置 autossh 参数。
- ``-f`` 指定 autossh 在后台运行，并不会传给 ssh。和 ssh 的 ``-f`` 不一样，autossh 指定 ``-f`` 时将无法寻求密码。指定 ``-f`` 时，会将环境变量 ``AUTOSSH_GATETIME`` 覆盖为 0！

## 开机启动

在 Ubuntu 中我们可以使用 systemd 管理 autossh 的开机启动问题（旧版本中可以使用 init.d）。配置很简单，只需要创建一个 ``/etc/systemd/system/remote-autossh.service`` 文件：

```systemd
[Unit]
Description=AutoSSH service for remote tunnel
After=network.target

[Service]
User=your_username
ExecStart=/usr/bin/autossh --M 20001 -N -o "PubkeyAuthentication=yes" -o "StrictHostKeyChecking=false" -o "ServerAliveInterval 60" -o "ServerAliveCountMax 3" -R a_a_a_a:20000:localhost:22 -p 8383 remote_user@a_a_a_a

[Install]
WantedBy=multi-user.target
```

这样就创建了一个 ``remote-autossh`` 服务，并指定其在网络服务启动后启动。可以运行 ``systemctl daemon-reload && systemctl start remote-autossh`` 立即启动服务。

需要注意的是，配置文件中的 autossh 命令需要替换为其绝对地址，以及不支持 ``-f`` 参数。
