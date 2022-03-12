# Redis 简介

Redis 是一个简单的 NoSQL 内存数据库，名称取自 REmote DIctionary Service，顾名思义就是一个
远程字典服务，其数据存储完全是一个简单的 K-V 数据模型。

## 快速入门

根据[安装指南]成功安装并运行后可以输入 redis-cli 启动 Redis 默认客户端与 Redis 服务器交互。
Redis 基本命令结构类似于 ``命令 *参数列表``。比如，以字符串 ``hello`` 为键存储字符串
``world`` 命令是 ``SET hello world``。

``SET`` 是命令，不区分大小写，``SET`` 命令结构是 ``SET key value``。``hello`` 和 ``world``
是两个字符串，在这里都是 ``SE$T`` 命令的参数。

你也可以在 Shell 终端运行 ``redis-cli SET hello world`` 不打开 Redis REPL 环境，
直接运行简单的 Redis 命令。这一点在以后实际使用中非常有用，常见用法：

```sh
redis-cli shutdown      # 关闭 Redis 服务器
redis-cli info          # 显示 Redis 服务器当前状态
```

Redis 在 web 开发中通常用作缓存（可代替 Memcached）、简单数据存储、任务队列等等。


## 数据存储

Redis 的主要存储形式是在内存中，在关闭 Redis 服务的时候 redis-server 会将数据从内存中
dump 到硬盘里，默认情况下会是 ``dump.rdb`` 文件。rdb 文件是一个二进制文件，其数据结构如下：

> REDIS | db_version | k-v 数据 | EOF | check_sum

其中 ``db_version`` 是数据结构版本，目前所使用的主流版本中应该都是 ``0006``。


## 数据类型

### 字符串 String

String 类型是 Redis 最简单的数据类型，使用方式就是当作像 Python 字典一样 GET 和 SET：

```
SET some_key
GET some_key
EXISTS some_key
```

不同的是，Redis 提供 Expire 功能，通过设置过期时间，定时批量删除已过期的 key：

```
EXPIRE some_key time_in_second
TTL some_key
```

EXPIRE 指定一个键（不管值是 String 还是其它类型）多长时间之后过期，EXPIREAT
指定到什么时候过期。


### 列表 List

Redis 的 List 类型就是一个键对应一个双向链表结构的 List，所以索引第 N 个元素的效率是 ``O(N)``，
List 的操作主要就是增（LINSERT、LPUSH）删（LPOP、LREM）取（LPOP、LRANGE）以及取多个连续元素
（LRANGE）等等。

由于 Redis 的 List 是一个双向链表结构，因此上面提到的 LPOP、LPUSH 命令存在对应的 RPOP、RPUSH
命令，效率都是 ``O(1)``。


### 集合 Set

Set 是集合，和 List 相比 Set 无序不允许重复，Set 的存储是通过散列而非链表实现，取效率上永远是
``O(1)``，相关的操作有 SPOP，SREM（虽然 SREM 的效率是 ``O(N)``，但 N 是同时删除的元素个数，
因此 SREM 一个元素的效率是 ``O(1)``）。

除普通的增删操作外，Set 还支持交集（SINTER、SINTERSTORE）、并集（SUNION、SUNIONSTORE）和差集
（SDIFF、SDIFFSTORE）这样的数学操作，其中差集的时间复杂度是 ``O(N)``，交集、并集的复杂度是
``O(N*M)``，SxxxSTORE 命令的作用是将集合运算的结果存储起来，并不影响时间复杂度。


### 有序集 Sorted Set

Redis 还支持有序集，通常简写为 Zset。Zset 中每个键对应一个集合，集合中每个元素都对应一个权，
理解起来类似于每个 Zset 都是一个键名对应一个有序字典。

```
ZADD key value1 weight1 value2 weight2
ZCARD value1
ZCARD value2
ZCARD value3
```

Zset 同样支持 ZUNIONSTORE、ZINTERSTORE，但并不支持 ZUNION、ZINTER。
Zset 也不支持差集操作。

相对于 Set，Zset 的“键－值－权”的结构可能更类似散列表。


### 散列表 Hash

对于众多类似字段通常是建议存储在 Hash 结构中的，而不是平铺在整个数据库中，
这样避免了键名重复部分对内存的占用，也就增加了 Redis 的存储容量。
这样做的缺点是值只能是简单类型，Redis 不支持 hash 结构的嵌套。

```
HSET key name1 value1
HSET key name2 value2
HGET key name1
HGETALL key
HVALS key
```


### 地理位置信息 GEO

地理位置信息（GEO）存储是 Redis 3.2 以后新支持的结构，每个 GEO 类型的键都包含了一系列点，
每个点信息由经纬和名字（member）度组成，存储结构类似于有序集 Zset，因此继承其一部分命令。

> 限制：Redis GEO 仅支持经度 -180~180 度，纬度 85.05112878~85.05112878 度之间的点。

```
GEOADD china longitude1 latitude1 beijing longitude2 latitude2 shanghai
GEODIST china beijing shanghai
```

GEO 相关目前支持增（GEOADD）、查（GEOPOS）、范围查询（GEORADIUS、GEORADIUSBYMEMBER）、
距离查询（GEODIS）以及批量查询（GEOHASH）。


## 事务

## 锁

## 发布&订阅

## 持久性

## 集群


## 参考链接&推荐阅读

* Redis 文档 [官方英文](http://redis.io/) [中文](http://redisdoc.com/index.html)
* Redis 数据结构介绍 [官方英文](http://redis.io/topics/data-types-intro)
  [中文](http://blog.nosqlfan.com/html/3202.html)
* [Redis 内存存储结构分析](http://www.searchtb.com/2011/05/redis-storage.html)
* [Redis 几个认识误区](http://timyang.net/data/redis-misunderstanding/)
* [Redis 源码阅读](http://believe3301.github.io/posts/redis-complete.html)
* [Redis 学习笔记](http://www.cnblogs.com/lukexwang/p/4699354.html)

