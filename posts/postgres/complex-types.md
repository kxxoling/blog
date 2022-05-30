# PostgreSQL 复杂数据类型的支持

pg 相对于其它关系型数据库的一大优势就在于成熟的复杂类型支持，包括数组、JSON 对象、HStore 等等。

## Array

pg 的数组功能非常强大，支持类型数组、多维数组、定长数组。

定义一个简单的数组列：

```sql
CREATE TABLE sample_table (
    array_example   integer[],
);
```

对应插入语句：

```sql
INSERT INTO sample_table VALUES (
    '{10000, 10000, 10000, 10000}'
);
```

定长多维数组：

```sql
CREATE TABLE tictactoe (
    squares   integer[3][3]
);
```

对应的插入：

```sql
INSERT INTO tictactoe VALUES (
    '{{1,2,3},{4,5,6},{7,8,9}}'
);
```


### 查询

数组的查询几乎只能手动匹配，例如：

```sql
SELECT * FROM sample_table WHERE
array_example[1] = 10000 OR
array_example[2] = 10000 OR
array_example[3] = 10000 OR
array_example[4] = 10000;
```

## JSON

pg 支持 JSON，具体来说是支持 json 和 jsonb 两种格式，两者的使用上几乎一样，区别在于存储形式和性能上。json 格式只是对输入文字进行简单的存储，每次查询都需要重新执行 JSON 解析。而 jsonb 存储的是解析后的二进制格式，因此存储时会稍稍慢于 json 格式，但是查询时要快速很多。默认情况下，jsonb 并不保护空格。

另外，存储 JSON 格式时还需要注意下 [Unicode 的处理](https://www.postgresql.org/docs/9.5/static/datatype-json.html)。

### 索引

jsonb 格式的另一个优点在于支持 GIN 索引。

## HStore

## Python Usage

### Django ORM

### SQLAlchemy



参考：

- [PostgreSQL 数组类型](https://www.postgresql.org/docs/9.5/static/arrays.html)
- [PostgreSQL JSON 类型](http://www.postgresql.org/docs/9.5/static/datatype-json.html)
- [PostgreSQL hstore](https://www.postgresql.org/docs/9.5/static/hstore.html)
- [PostgreSQL 反模式](http://blog.2ndquadrant.com/postgresql-anti-patterns-unnecessary-jsonhstore-dynamic-columns/)
- [PostgreSQL HStore vs. JSON](http://www.craigkerstiens.com/2013/07/03/hstore-vs-json/)
- [PostgreSQL in Django](https://docs.djangoproject.com/ja/1.9/ref/contrib/postgres/fields/)
