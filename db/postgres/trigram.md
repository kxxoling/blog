# PostgreSQL 与 trigram 算法

N-Gram 是一种常用的索引方式，trigram 是其中常用的一种（tri- 表示 3）。根据 trigram 的算法，我们可以将 cat 将被分割成 “c”、“ca”、“cat”、“at”。trigram 算法经常用在字符串相似度比较上，两个词共享的 trigram 分词越多，相似度则越高。PostgreSQL 中由 pg_trgm 模块提供 trigram 算法支持。


## 函数和操作

pg_trgm 函数：

函数                        | 返回值   | 描述
----------------------------|----------|------------------------
``similarity(text, text)``  | 实数     | 返回两个参数的相似度，区间是 0（完全不同） - 1（完全相同）
``show_trgm(text)``         | text[]   | 返回 trigram 分词后的所有子字符串
``show_limit()``            | 实数     | 返回当前 ``%`` 操作法使用的相似度下限
``set_limit()``             | 实数     | 设置 ``%`` 计算相似度的下限

操作符：

操作符             | 返回值   | 描述
-------------------|----------|-------------
``text % text``    | 布尔值   | 如果两个字符串的相似度大于设置的相似度下限返回真，反之返回假
``text <-> text``  | 实数     | 返回两个字符串的距离，值为 ``1 / similarity(text, text)``


## 索引支持

pg_trgm 模块提供了操作符级别的 GiST 和 GIN 索引支持，不仅支持上面所提到的相似度操作符，还为 ``LIKE`` 和 ``ILIKE`` 提供了额外支持。（但是并不支持“相等”等比较操作，因此你可能仍然需要 B 树索引。）

创建索引：

```sql
CREATE TABLE test_trgm (t text);
CREATE INDEX trgm_idx ON test_trgm USING gist (t gist_trgm_ops);
```

或者

```sql
CREATE INDEX trgm_idx ON test_trgm USING gin (t gin_trgm_ops);
```

查询：

```sql
SELECT t, similarity(t, 'word') AS sml
  FROM test_trgm
  WHERE t % 'word'
  ORDER BY sml DESC, t;
```

或者：

```sql
SELECT t, t <-> 'word' AS dist
  FROM test_trgm
  ORDER BY dist LIMIT 10;
```

This can be implemented quite efficiently by GiST indexes, but not by GIN indexes. It will usually beat the first formulation when only a small number of the closest matches is wanted.

大多数情况下 GIN 的查询效率都要高于 GiST，但是在写入方面则反过来，因此建议动态数据使用 GiST，很少变化的数据使用 GIN。

对于 ``ILIKE`` 和 ``LIKE``，搜索字符越多 trigram 的效率越高，因为它并不需要左锚点。


## 全文搜索

trigram 在全文搜索中也很有用，因为它对错别字的容忍度很高。


参考：[官方文档](https://www.postgresql.org/docs/9.5/static/pgtrgm.html)
