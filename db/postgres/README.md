# PostgreSQL 数据库简介及其生态

PostgreSQL 数据库简称 Postgres（后面简称 pg），是一个强大的 SQL 数据库，可以说是主流数据库中最符合 SQL 标准规范的实现。pg 的性能非常优秀，并且在极限压力的情况下依旧能保持稳定的性能。除此之外，pg 还支持多种复杂类型，比如 JSON 和 Hive，并拥有丰富的插件生态，著名的 GIS 插件 PostGIS 便是其中之一。


## 安装和使用

以 Ubuntu 14.04 为例：

```sh
sudo apt-get update
sudo apt-get install postgresql\  # 安装 pg
     postgresql-contrib  # 安装 pg 相关工具
```

### 角色和数据库

pg 使用“角色”这一概念来认证身份，在某些方面，这和 Unix 用户系统很像，不过 pg 并不区分用户和用户组，只拥有“角色”这一区分方式。

上面的安装完成后，安装程序会自动创建一个名为 postgres 的用户，你应该尽可能地使用该用户操作数据库：

```sh
sudo -i -u postgres     # 切换到 postgres 终端环境
```

你也可以使用命令手动创建用户/角色：

```sh
createuser --interactive
```

### 控制程序

安装完 pg 后还提供了很多管理程序，比如 ``createdb``、``dropdb``、``pg_*`` 等等。它们的作用如下：

命令                | 作用
--------------------|---------------
``clusterdb``       | 群集一个 PostgreSQL 数据库
``createdb``        | 创建一个新 PostgreSQL 数据库
``createlang``      | 安装一个 PostgreSQL 过程语言
``createuser``      | 创建一个新的 PostgreSQL 用户帐户
``dropdb``          | 删除一个 PostgreSQL 数据库
``droplang``        | 删除一个 PostgreSQL 过程语言
``dropuser``        | 删除一个 PostgreSQL 用户账户
``ecpg``            | 嵌入的 SQL C 预处理器
``initdb``          | 创建一个新的 pg 数据库集群 cluster
``pg_basebackup``   | 做一个 PostgreSQL  集群的基础备份
``pg_config``       | 检索已安装的 PostgreSQL 版本信息
``pg_controldata``  | 显示一个 PostgreSQL 数据库集群的控制信息
``pg_ctl``          | 初始化、启动、停止、或者控制 pg 服务器
``pg_dump``         | 将一个 PostgreSQL 数据库转储到一个脚本文件或者其它归档文件中
``pg_dumpall``      | 将一个 PostgreSQL 数据库集群转储到一个脚本文件中
``pg_isready``      | 检查 PostgreSQL 服务器的连接状态
``pg_receivexlog``  | PostgreSQL 集群中的流事务日志
``pg_resetxlog``    | 重置一个数据库集群的预写日志以及其它控制内容
``pg_restore``      | 从 ``pg_dump`` 创建的备份文件中恢复 PostgreSQL 数据库
``pg_start``        | 启动 pg 服务
``pg_stop``         | 停止 pg 服务
``pg_upgrade``      | 升级 pg 数据库文件
``postgres``        | pg 数据库服务器
``postmaster``      | 管理 pg 数据库服务器
``psql``            | PostgreSQL 交互终端
``reindexdb``       | 重建 PostgreSQL 数据库索引
``vacuumdb``        | 收集垃圾并分析一个 PostgreSQL 数据库


### 元指令 Meta-command/slash command/backslash command

使用 ``psql`` 程序连接进入数据库后可以使用 ``\`` 开头的指令，比如 ``\h`` 显示帮助，``\d`` 显示数据库结构。

[常用命令对照表](https://www.postgresql.org/docs/9.5/static/app-psql.html)：

命令                                 | 作用
-------------------------------------|---------------
``\c / \connect [数据库连接字符]`` | 连接数据库
``\C [title]``                       | 设置打印的 caption
``\cd [dir]``                        | 切换工作目录
``\copy [some query]``               | 复制表内容
``\d[S+] [ pattern ]``               | 显示符合 pattern 规则的所有关系(表、视图、索引、序列以及外键)
``\password [ username ]``           | 修改特定用户的密码，默认是当前用户
``\q``/``quit``                      | 退出


## 集群解决方案 Postgres-XC

早期的 pg 是没有集群的，这也是当时 MySQL 的一大优势所在，直到 Postgres-XC 的出现。[Postgres-XC][what-pg-xc-is] 是一个开源的 pg 集群解决方案，拥有可扩展的写性能、对称同步等特性，你可以将其安装在多台机器或者虚拟机上。


## PostGIS

[PostGIS][postgis] 是 pg 的一个空间数据插件，提供地理信息数据的存储和查询能力。


## pgRouting

[pgRouting][pgrouting] 基于 PostgreSQL 和 PostGIS 提供了地理位置引路系统。

核心功能：

- 所有最短路径组合（Johnson 算法）
- 所有最短路径组合（Floyd-Warshall 算法）
- 最短 A* 路径
- 双向 Dijkstra 最短路径
- 双向 A* 最短路径
- Dijkstra 最短路径
- 行车距离
- K-最短路径，多候选路径
- K-Dijkstra，一对多最短路径
- 旅行销售人员（Traveling Sales Person）
- TRSP（Turn Restriction Shortest Path）



[what-pg-xc-is]: http://postgres-xc.sourceforge.net/docs/1_1/intro-whatis.html
[pg-xc-wiki]: http://postgresxc.wikia.com/wiki/Postgres-XC_Wiki
[postgis]: http://postgis.net/
[pgrouting]: http://pgrouting.org/
