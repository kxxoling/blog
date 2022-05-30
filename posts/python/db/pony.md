# Pony ORM 的秘密

Pony ORM 实现了一个很有趣的功能：使用类似 Python 生成器的语法来创建数据库查询语句。
比如这样的代码：

```python
select(
    p for p in Person if p.name.startswith('Paul')
).order_by(Person.name)[:2]
```

会生成下面的 SQL 语句：

```sql
SELECT "p"."id", "p"."name", "p"."age"
FROM "Person" "p"
WHERE "p"."name" LIKE "Paul%"
ORDER BY "p"."name"
LIMIT 2
```

返回对象：

```python
[Person[3], Person[1]]
```

这个问题出现在了 [StackOverflow](http://stackoverflow.com/questions/16115713/how-pony-orm-does-its-tricks) 上，
下文修改自 Pony ORM 作者的回答：

Pony 是这样将 Python 生成器翻译成 SQL 查询语句的：

1. 反编译生成器的字节码并重新够姜生成器的 AST（抽象语法树）

2. 将 Python AST 翻译为“抽象 SQL”—— universal list-based representation of a SQL query

3. 将抽象的 SQL 表达式根据数据库转换为 SQL 语言。

其中第二步是最复杂的部分，Pony 必须“理解” Python 表达式才能做到，不过第一步也很有趣，
首先来看看反编译是怎么做的：

首先假设有这么一条查询语句：

```python
>>> from pony.orm.examples.estore import *
>>> select(c for c in Customer if c.country == 'USA').show()
```

它将会被翻译成这样的 SQL 语句：

```sql
SELECT "c"."id", "c"."email", "c"."password", "c"."name", "c"."country", "c"."address"
FROM "Customer" "c"
WHERE "c"."country" = 'USA'
```

输出结果会是这样的：

```
id|email              |password|name          |country|address
--+-------------------+--------+--------------+-------+---------
1 |john@example.com   |***     |John Smith    |USA    |address 1
2 |matthew@example.com|***     |Matthew Reed  |USA    |address 2
4 |rebecca@example.com|***     |Rebecca Lawson|USA    |address 4
```

select() 函数必须接受 Python 生成器作为参数，然后分析它的字节码。
我们可以使用 Python dis 模块来获取生成器的字节码：

```python
>>> gen = (c for c in Customer if c.country == 'USA')
>>> import dis
>>> dis.dis(gen.gi_frame.f_code)
  1           0 LOAD_FAST                0 (.0)
        >>    3 FOR_ITER                26 (to 32)
              6 STORE_FAST               1 (c)
              9 LOAD_FAST                1 (c)
             12 LOAD_ATTR                0 (country)
             15 LOAD_CONST               0 ('USA')
             18 COMPARE_OP               2 (==)
             21 POP_JUMP_IF_FALSE        3
             24 LOAD_FAST                1 (c)
             27 YIELD_VALUE
             28 POP_TOP
             29 JUMP_ABSOLUTE            3
        >>   32 LOAD_CONST               1 (None)
             35 RETURN_VALUE
```

Pony ORM 实现了一个 decompile() 函数从字节码中重新构建 AST：

```python
>>> from pony.orm.decompiling import decompile
>>> ast, external_names = decompile(gen)
```

AST 转换为文本结构后是这样的：

```python
>>> ast
GenExpr(GenExprInner(Name('c'), [GenExprFor(AssName('c', 'OP_ASSIGN'), Name('.0'),
[GenExprIf(Compare(Getattr(Name('c'), 'country'), [('==', Const('USA'))]))])]))
```

这个反编译函数 decompile() 又是如何实现的呢？

decompile() 函数首先创建一个基于观察者模式的 Decompiler 对象 decompiler，
decompiler 实例一行行地获取字节指令，并调用 decompiler 对应的方法，方法名和当前
字节指令相同。

Python 运算表达式的时候会使用栈来存储中间的计算结果，decompiler 对象也使用了栈，
但并不是存储中间值，而是表达式的 AST 节点。

decompiler 再次调用对应字节指令的方法时，它首先会从栈中取出 AST 所有节点，
并将其合并为一个新的节点，最后将结果存储在栈顶。

举个例子，我们来看看 `c.country == 'USA'` 的运算过程究竟是怎样的。其对应的命令片段如下：

```
              9 LOAD_FAST                1 (c)
             12 LOAD_ATTR                0 (country)
             15 LOAD_CONST               0 ('USA')
             18 COMPARE_OP               2 (==)
```

decompiler 对象会这样处理：

1. 调用 `decompiler.LOAD_FAST('c')`。该方法将 Name('c') 节点推入 decompiler 栈顶。
2. 调用 `decompiler.LOAD_ATTR('country')`。该方法将 Name('c') 节点从栈顶取出，
   生成 Geattr(Name('c'), 'country') 节点后重新推入栈顶。
3. 调用 `decompiler.LOAD_CONST('USA')`。该方法将 Const('USA') 节点推入栈顶。
4. 调用 `decompiler.COMPARE_OP('==')`。该方法从栈中取出 Getattr 和 Const 两个节点，
   生成新节点 Compare(Getattr(Name('c'), 'country'), [('==', Const('USA'))]) 后在将其推入栈顶。

字节指令全部处理完之后，decompiler 栈中只存在一个包含了完全等价于生成器表达式的 AST 节点。

由于 Pony ORM 只反编译生成器和 lambda 表达式，因此指令集的处理基本上是顺序的循环处理。

目前， Pony ORM 尚未实现这些功能：

* 行内 if 表达式：`a if b else c`
* 比较运算：`a < b < c`

如果存在存在这样的表达式将会报 NotImplementedError 异常，不过你现在可以将其作为字符串来调用，
这时 Pony 无需使用 decompiler 模块，只需要使用 Python 标准库中的 compiler.parse 函数即可。
