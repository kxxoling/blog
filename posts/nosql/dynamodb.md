# DynamoDB 使用经验

## DynamoDB 是什么？

DynamoDB（以下简称 DDB）是 Amazon AWS 提供的 NoSQL 云服务，完全托管在 Amazon 的云服务器上，
用户不需要也无法接触程序和数据本身。
根据官方介绍，DDB 拥有 Schema Free 、高性能、高可靠性、分布式以及扩展性等特点，
支持最终一致性或者强一致性，能够降低运维的负责性并且支持灵活的弹性吞吐设置。


## 数据模型

DDB 基本数据模型包括 Table、Item、Attribute。拿关系型数据库（RDB）作比较，
Table 及数据表，Item 对应一行数据以及列名的组合，Attribute 则是 Item 数据中的任一项
列名－数据对。相较之下，DDB 的数据模型和 MongoDB 中的 collection、json、k-v 对更为接近。

创建 Table 时需要预设主键，主键类型可以是 Hash Key，或者 Hash key 和 Range Key 复合形式，
主键也相当于索引（如果不是的话）。


## 数据类型

DDB 支持的数据类型相比 RDB 并不多：Binary、Number、String、List、Set 和 Map（可嵌套），
Set 分 Binary Set、Number Set、String Set，也就是说并不支持混合类型的 Set，
Map 类型可嵌套，类似 JSON 或者 Python 字典。


## 主键设计

主键包括 Hash 和 Range 两种 key，正如其名 Hash key 指 hash 唯一，只用于定位；
Range key 则拥有范围概念，可用于排序。

Hash 和 Range key 都可以是 String、Number 或者 Binary 类型。

Table 主键只可以是 Hash key 或者 Hash key ＋ Range key，使用两个 Hash key
作为唯一区分是不允许的。


## 二级索引

DDB 的二级索引有两种：全局二级索引（Global Secondary Index）和局部二级索引（Local Secondary Index）。
要了解两者的区别，首先要理解 DDB 的存储方式，DDB 通过 Hash key 的方式强制将数据分区，
虽然作为用户感受不到，但这正是 DDB 保证高性能的关键。也就是说数据会根据 hash
的结果存储在不同区域。

GSI：其哈希和范围键可以与表上的哈希和范围键不同的索引。GSI 被视为“全局”，是因为对索引进行的查询可以跨表中所有分区的所有数据。

LSI：哈希键与表相同、但是范围键不同的索引。LSI 的“本地”含义在于，其每个分区的范围都限定为具有相同哈希键的表分区。

GSI 和 LSI 都支持稀疏索引。


## 与 Python 交互

AWS 提供了 boto 和 boto3 两套 Python 库，后者正在开发中，功能尚不完全。
前者则代码庞大同时对 Python 3 的支持也尚不健全，相对来说更推荐使用前者。

boto 提供了两套 DynamoDB 接口：``boto.dynamodb`` 和 ``boto.dynamodb2``，
前者主要针对旧版本的 DynamoDB 服务，新启动的 DynamoDB 服务应该使用
[DynamoDB v2](http://boto.readthedocs.org/en/latest/dynamodb2_tut.html)。


### 基本配置

创建用户（组）
获取 API key 和 Secret Key
环境设置

### 定义连接

#### 创建用户（组）并获取 Access Key Id - Secret Access Key

获取 key 和 secret 之后有两种设置方法：环境变量或者连接参数。

设置 Access 环境变量可通过 ``aws configure`` 设置或者手动修改 ``~/.aws/credentials``
文件，两者效果是相同的。

或者在连接中设置参数：

```python
import boto

conn = boto.dynamodb2.connect_to_region('ap-northeast-1',
                                        aws_access_key_id='YOUR_KEY',
                                        aws_secret_access_key='YOUR_SECRET')
```


### 表操作

表操作注意包括增删表、增删表的索引和投影、调整表的吞吐量。
注意表的 key 和 schema 一旦设置则不可修改。


#### 获取表对象

```python
table = Table('table_name', connection=conn)
```

这一步并没有向服务器发起请求，因此即使使用不存在的表名也不会报错。

或者你也可以详细地定义表的属性：

```python
from boto.dynamodb2.fields import HashKey, RangeKey, GlobalAllIndex
from boto.dynamodb2.table import Table
from boto.dynamodb2.types import NUMBER

users = Table('users', schema=[
        HashKey('username'),
        RangeKey('last_name'),
    ], global_indexes=[
        GlobalAllIndex('EverythingIndex', parts=[
            HashKey('account_type'),
        ])
    ])
```


#### 获表信息

```python
table.describe()
```


#### 修改表属性

```python
table.update(throughput=dict(read=READ, write=WRITE))
```

注意：表名、主键、Shema、本地二级索引一旦建立都无法修改和删除！


### 数据操作

数据是 item，其相关操作都必定与 table 相关，对于数据的操作依旧是常见的增（``put_item()``）、
删（``delete_item()``）、改（``put_item(data={...}, overwrite=True)``）、查（``query_2()`` 和
``count()``）。DDB 也支持 count 计数，不过 count 并不具备强一致性，DDB 会每 6 个小时更新一次。
对于实时计数要求比较强的可以根据情况使用 ``scan()``（数据很少时），``query_count()``
（需要合适的索引），或者使用其它数据库或表来独立计数。

#### 批量操作

DDB 支持批量读（``batch_get``）和批量写（``batch_write``）：

```python
with table.batch_write() as batch:
    batch.put_item(data={...})
```

写操作可以混合增、删、改：

```python
with users.batch_write() as batch:
    batch.put_item(data={...})
    batch.put_item(data={...})
    batch.delete_item(username='janedoe', last_name='Doe')
```


### Query & Scan

* ``scan()`` 操作非常耗费资源，慎用。使用时注意使用 ``max_page_size`` 和 ``limit`` 限制。
* ``scan()`` 和 ``query_2()`` 操作的返回值是 ResultSet 对象（生成器），惰性。

#### Query

> ``query()`` 方法已弃用！新建数据库应该使用 ``query_2()``，``query()`` 方法只是为了保持兼容性。

> Query 操作必须包含索引中所有键，否则会报错！

DDB 查询的过滤类型并不像 RDB 那样丰富，仅支持：

* ``eq``：相等
* ``lte``：小于等于
* ``lt``：小于
* ``gte``：大于等于
* ``gt``：大于
* ``beginswith``：以 xx 字符开始
* ``between``：在区间 a 和 b 之间

查询命令的拼接方式类似于 Django ORM。

Query 操作必须指定索引，默认是主键，你可以也指定 Index 名称：

```python
# 最近一小时注册的用户
recent = users.query_2(
    account_type__eq='standard_user',
    date_joined__between=[0, time.time() - (60 * 60)], # 这里使用 ``gte`` 会更方便，使用 ``between`` 是出于演示目的
    index='DateJoinedIndex'
)
```

#### query_count

``query_count()`` 的操作类似于 ``query_2()``，不过仅仅返回符合条件的 Item 数目。


#### Scan

``scan()`` 会便利整个 Table，因此时间复杂度是 O(n)，并且非常耗费系统资源。
即使如此 ``scan`` 也仅仅保证最终一致性，慎用！

和 ``query()`` 类似，``scan()`` 也支持过滤操作：

* ``eq``：相同
* ``ne``：不相同
* ``lte``：小于等于
* ``lt``：小于
* ``gte``：大于等于
* ``gt``：大于
* ``nnull``：存在
* ``null``：不存在
* ``contains``：包含
* ``ncontains``：不包含
* ``beginswith``：以 xx 字符开始
* ``in``：值是列表 l 中之一
* ``between``：值在区间 a 和 b 之间


### 限制

* 单个 Item 大小限制为 400k。官方建议大数据块切片存储，在应用层整合。
* boto 单次请求大小为 1M。请求数据（``query_2()`` 或者 ``scan()``）较多时应设置 ``max_page_size``。
* 表总数限制为 256。不把它当作 Redis hash 结果来用应该不会超出这个限制。
* 表 Schema 一旦确定不可更改。对于 Hash Key、Range Key 以外的 Attribute 建议在应用层管理。
* LSI 建立后不可更改。但是可以增删 GSI。
* GSI 会异步地复制 Table 中的内容，不受应用控制，因此 GSI 只能保证最终一致性。


### 吐槽

* 接口的行为不统一，比如 ``conn.create_table`` 与 ``Table.create(..., connection=conn)`` 的参数列表并不一致；
* 功能限制比较多；
* GitHub Issue 提问不一定能得到反馈，有问题还是建议在 StackOverflow 上提问。


### 测试

#### 搭建本地环境

DynamoDB 提供了 [DynamoDBLocal] 用于在本地模拟 DynamoDB 行为。
本地连接：

```python
from boto.dynamodb2.layer1 import DynamoDBConnection

# Connect to DynamoDB Local
conn = DynamoDBConnection(
    host='localhost',
    port=8000,
    aws_access_key_id='anything',
    aws_secret_access_key='anything',
    is_secure=False)

# List all local tables
tables = conn.list_tables()
```


#### 使用 Mock


## 收费

DynamoDB 的收费和存储、读取流量相关，与 Table 数无关，但是需要考虑每个 Table
读写只是占用一个单位。

日本机房需要支付额外的消费税房。


## 最佳实践

（To be continued ……）


## 与其它 NoSQL 数据库的比较

### Redis

DDB 和 Redis 相比之下差异较大，因此不太有可比性：

* Redis 的数据结构更简单，整体上只是个大号的字典（Hash）；
* Redis 是内存数据库，因此容量很难扩展，但是速度要快得多；
* Redis 支持 sorted set、ordered list 数据结构，也支持交集这样的操作，有时会很有用；
* Redis 支持 Expire time，非常适合倒计时;


### Riak

Riak 是 DynamoDB 的开源实现，同样支持 HTTP 协议操作，在使用上会非常接近 DynamoDB。


### MongoDB

虽然没有开发上的渊源，但是两者在数据结构上相似度还是很高的：

* 两者都是 Schema Free；
* 两者都拥有很好的分布式、扩展性支持；
* MongoDB 以 ``_id`` 为主键，类似 DDB 的 Hash key；
* MongoDB 的 Collection 可对应 DDB 的 Table，而 DDB 的 Item 结构看起来也类似 MongoDB 的文档；
* 两者都支持可嵌套的 Map（JSON）数据结构；

但是 MongoDB 在查询上支持更强大的索引，这点更接近于 RDB。


[DynamoDBLocal]: http://docs.aws.amazon.com/zh_cn/amazondynamodb/latest/developerguide/Tools.DynamoDBLocal.html
[DDB 二级索引]: http://docs.aws.amazon.com/zh_cn/amazondynamodb/latest/developerguide/SecondaryIndexes.html
[使用二级索引]: http://docs.aws.amazon.com/zh_cn/amazondynamodb/latest/developerguide/GSI.OnlineOps.html
[DynamoDB CLI]: http://docs.aws.amazon.com/zh_cn/amazondynamodb/latest/developerguide/Tools.CLI.html
[boto 文档]: http://boto.readthedocs.org/en/latest/dynamodb2_tut.html
[常见问题]: https://aws.amazon.com/cn/dynamodb/faqs/

[dynamodb-mapper]: https://bitbucket.org/ludia/dynamodb-mapper/

