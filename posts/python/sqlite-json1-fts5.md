# 启用 SQLite JSON1 和 FTS5 扩展

SQLite 3.9 版本以后天加了 JSON1 扩展，并且新增了 FTS5 全文搜索。FTS5 提高了复杂搜索的请求效率，并自带了 [BM25 算法](https://en.wikipedia.org/wiki/Okapi_BM25)实现。

## 安装

首先确保你的 SQLite 安装了 JSON1 和 FTS5 扩展：

如果没有可以重新安装：``brew uninstall --ignore-dependencies sqlite3; brew install sqlite3 --with-json1 --with-ft5``。需要注意的是你的 sqlite3 很可能是安装其它应用时作为依赖安装的，需要添加 ``--ignore-dependencies`` 参数来强制卸载，重新安装后并不影响这些应用。另外，Homebrew 中 sqlite 和 sqlite3 都对应的 sqlite.rb 这个 Formular，用任何一个名字都没有影响。

安装 peewee 和 pysqlite 用作例子：``pip install -U peewee pysqlite``。

### JSON1

首先下载一个 JSON 文件作为实验数据：

```py
import json
import urllib2
fh = urllib2.urlopen('http://media.charlesleifer.com/blog/downloads/misc/blogs.json')
data = json.loads(fh.read())
```

定制数据库连接并创建内存数据库：

```py
from pysqlite2 import dbapi2 as jqlite    # 注意是 pysqlite2 而不是 pysqlite
from peewee import *
from playhouse.sqlite_ext import *

class JSQLiteDatabase(SqliteExtDatabase):
    def _connect(self, database, **kw):
        conn = jqlite.connect(database, **kw)
        conn.isolation_level = None
        self._add_conn_hooks(conn)
        return conn
db = JSQLiteDatabase(':memory:')
```

定义类 model 并创建对应表：

```py
class Entry(Model):
    data = TextField()
    class Meta:
        database = db

Entry.create_table()
```

将下载的 json 数据导入数据库：

```py
with db.atomic():
    for entry_json in data:
        Entry.create(data=json.dumps(entry_json))

title = fn.json_extract(Entry.data, '$.title')
query = (Entry.select(title.alias('title')).order_by('title').limit(5))
print [row for row in query.dicts()]

# 输出：
# [{'title': u'A Tour of Tagging Schemas: Many-to-many, Bitmaps and More'},
# {'title': u'Alternative Redis-Like Databases with Python'},
# {'title': u'Building the SQLite FTS5 Search Extension'},
# {'title': u'Connor Thomas Leifer'},
# {'title': u'Extending SQLite with Python'}]
```

实际上我们执行的 SQL 是这样的：

```sql
SELECT json_extract("t1"."data", '$.title') AS title
FROM "entry" AS t1
ORDER BY json_extract("t1"."data", '$.title')
LIMIT 5
```

接下来我们按照 tag 来查询相关文章：

```py
from peewee import Entity
tags_src = fn.json_each(Entry.data, '$.metadata.tags').alias('tags')
tags_ref = Entity('tags')
query = (Entry
    .select(title.alias('title'))
    .from_(Entry, tags_src)
    .where(tags_ref.value == 'sqlite')
    .order_by(title))

[row for row, in query.tuples()]

'''
输出：
[u'Building the SQLite FTS5 Search Extension',
 u'Extending SQLite with Python',
 u'Meet Scout, a Search Server Powered by SQLite',
 u'My List of Python and SQLite Resources',
 u'Querying Tree Structures in SQLite using Python and the Transitive Closure Extension',
 u"Using SQLite4's LSM Storage Engine as a Stand-alone NoSQL Database with Python",
 u'Web-based SQLite Database Browser, powered by Flask and Peewee']
'''
```

对应的查询 SQL：

```sql
SELECT json_extract("t1"."data", '$.title') AS title
FROM
    "entry" AS t1,
    json_each("t1"."data", '$.metadata.tags') AS tags
WHERE ("tags"."value" = 'sqlite')
ORDER BY json_extract("t1"."data", '$.title')
```

再举一个 ``json_each()`` 的例子：

```py
query = (Entry
         .select(
             title.alias('title'),
             fn.group_concat(tags_ref.value, ', ').alias('tags'))
         .from_(Entry, tags_src)
         .group_by(title)
         .limit(5))

[row for row in query.tuples()]

'''
输出：
[(u'A Tour of Tagging Schemas: Many-to-many, Bitmaps and More',
  u'peewee, sql, python'),
 (u'Alternative Redis-Like Databases with Python',
  u'python, walrus, redis, nosql'),
 (u'Building the SQLite FTS5 Search Extension',
  u'sqlite, search, python, peewee'),
 (u'Connor Thomas Leifer', u'thoughts'),
 (u'Extending SQLite with Python', u'peewee, python, sqlite')]
'''
```

对应的 SQL：

```sql
SELECT
    json_extract("t1"."data", '$.title') AS title,
    group_concat("tags"."value", ', ') AS tags
FROM
    "entry" AS t1,
    json_each("t1"."data", '$.metadata.tags') AS tags
GROUP BY json_extract("t1"."data", '$.title')
LIMIT 5
```

``json_tree()`` 函数和 ``json_each`` 类似，不过 ``json_each()`` 仅返回特定路径直系后代，而 ``json_tree()`` 会迭代整个对象及其所有后代并返回。

```py
tree = fn.json_tree(Entry.data, '$').alias('tree')
parent = fn.json_tree(Entry.data, '$').alias('parent')

tree_ref = Entity('tree')
parent_ref = Entity('parent')

query = (Entry
         .select(title.alias('title'))
         .from_(Entry, tree, parent)
         .where(
             (tree_ref.parent == parent_ref.id) &
             (parent_ref.key == 'tags') &
             (tree_ref.value == 'sqlite'))
         .order_by(title))

[title for title, in query.tuples()]
'''
输出：
[u'Building the SQLite FTS5 Search Extension',
 u'Extending SQLite with Python',
 u'Meet Scout, a Search Server Powered by SQLite',
 u'My List of Python and SQLite Resources',
 u'Querying Tree Structures in SQLite using Python and the Transitive Closure Extension',
 u"Using SQLite4's LSM Storage Engine as a Stand-alone NoSQL Database with Python",
 u'Web-based SQLite Database Browser, powered by Flask and Peewee']
'''
```

对应的 SQL 是这样的：

```sql
SELECT json_extract("t1"."data", '$.title') AS title
FROM
    "entry" AS t1,
    json_tree("t1"."data", '$') AS tree,
    json_tree("t1"."data", '$') AS parent
WHERE (
    ("tree"."parent" = "parent"."id") AND
    ("parent"."key" = 'tags') AND
    ("tree"."value" = 'sqlite'))
ORDER BY json_extract("t1"."data", '$.title')
```

关于 SQLite JSON1 扩展支持的所有函数可以查看这里：[The JSON1 Extension](https://www.sqlite.org/draft/json1.html)。

## 使用 FTS5

继续使用上面的部分代码和数据。Peewee 2.6.5 添加了 FTS5Model 支持，请确保已经安装了对应了 Peewee。

fts5 扩展要求所有列仅包含非空数据，我们唯一需要指出的是非索引列，表明这列数据仅存储而不支持搜索。

现在我们为 ``Entry`` 类添加索引，我们将通过搜索标题来获得对应的 URL，因此我们可以将 ``url`` 字段设置为 ``unindexed=True``：

```py
class EntryIndex(FTS5Model):
    title = SearchField()
    url = SearchField(unindexed=True)

    class Meta:
        database = db
        extension_options = {
            'prefix': [2, 3],
            'tokenize': 'porter unicode61',
        }

EntryIndex.create_table()
```

``extension_options`` 字典为 fts5 扩展提供了额外的元数据以确定如何解析单词，以及快速前缀搜索支持的前缀长度。索引表的创建 SQL 如下：

```sql
CREATE VIRTUAL TABLE "entryindex" USING fts5 (
    "title" ,
    "url"  UNINDEXED,
    prefix='2,3',
    tokenize="porter unicode61")
```

接下来，我们可以借助以下 JSON 函数来为 ``Entry`` 表中的数据添加索引：

```py
title = fn.json_extract(Entry.data, '$.title').alias('title')
url = fn.json_extract(Entry.data, '$.url').alias('url')
query = Entry.select(title, url).dicts()
with db.atomic():
    for entry in query:
        EntryIndex.create(**entry)
```

创建完索引后，可以这样应用查询：

```py
query = EntryIndex.search('sqlite').limit(3)
for result in query:
    print result.title
'''
输出：
Extending SQLite with Python
Building the SQLite FTS5 Search Extension
My List of Python and SQLite Resources
'''
```

对应的 SQL：

```sql
SELECT "t1"."title", "t1"."url"
FROM "entryindex" AS t1
WHERE ("entryindex" MATCH 'sqlite')
ORDER BY rank
```

查询时还可以通过 ``score`` 参数同时获得查询结果的近似度得分：

```py
query = EntryIndex.search('sqlite AND python', with_score=True)
for result in query:
    print round(result.score, 3), result.title

'''
输出：
-1.259 Extending SQLite with Python
-1.059 My List of Python and SQLite Resources
-0.838 Querying Tree Structures in SQLite using Python and the Transitive Closure Extension
'''
```

对应 SQL：

```sql
SELECT "t1"."title", "t1"."url", rank AS score
FROM "entryindex" AS t1
WHERE ("entryindex" MATCH 'sqlite AND python')
ORDER BY rank
```

参考：

- [Using the SQLite JSON1 and FTS5 Extensions with Python](http://charlesleifer.com/blog/using-the-sqlite-json1-and-fts5-extensions-with-python/)
- [fts5 官方文档](https://www.sqlite.org/fts5.html)

包含源代码的 IPython Notebook：http://nbviewer.jupyter.org/gist/coleifer/f1fc90c7d4938c73951c
