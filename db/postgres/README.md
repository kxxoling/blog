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

### 控制程序

安装完 pg 后还提供了很多管理程序，比如 ``createdb``、``dropdb``、``pg_*`` 等等。它们的作用如下：

命令       | 作用
-----------|---------------
createdb   | 创建数据库
dropdb     | 删除数据库
psql       | pg 客户端，用于连接 pg 服务器
pg_ctl     | pg 管理工具
pg_dump    | dump 数据库文件
pg_start   | 启动 pg 服务
pg_stop    | 停止 pg 服务
pg_upgrade | 升级 pg 数据库文件
pg_restore | 导入 pg 数据库文件


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
