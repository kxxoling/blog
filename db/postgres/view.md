# PostgreSQL 中的视图

视图（view）是 SQL 的一个概念，指的是基于 SQL 语句结果集的可视化表。和表（table）一样，视图也拥有行、列和字段，视图的字段可以来自于一个或多个数据库中的表，因此又称为虚表，支持 SQL 函数、``WHERE`` 以及 ``JOIN`` 语句。

视图的定义并不会影响数据库原本的结构设计，但是视图字段是表字段的映射，效果类似于编程语言中的引用类型，对视图的更新（如果允许更新的话）会反过来修改表中的数据。


早期版本的 pg 不允许插入更新或删除视图中的数据（比如 9.2 中是不允许的），更新版本（比如 9.5 版本）中会允许对简单视图非只读列映射的修改行为，但不允许只读列的映射。

一个简单的视图创建语句：

```sql
CREATE VIEW view_name AS
SELECT column_name(s)
FROM table_name
WHERE condition
ORDER BY column_name
```

删除视图也很简单：

```sql
DROP VIEW view_name;
```

更新视图结构：

```sql
CREATE OR REPLACE VIEW view_name AS
SELECT column_name(s)
FROM table_name
WHERE condition;
```

其中 ``CREATE OR REPLACE VIEW`` 是 pg 的语言扩展功能。

参考：

- [PostgreSQL CREATE VIEW](https://www.postgresql.org/docs/9.5/static/sql-createview.html)
