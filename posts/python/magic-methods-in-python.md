# Python 中的魔术方法

Python 中有很多 ``__`` 开始和结尾的特殊方法，它们多是所有类型都拥有的，通过实现这些
特殊方法可以实现很多有意思的功能，比如最常使用的 ``__str__``、``__repr__`` 和
``__unicode__`` 这三个就可以用于输出对象的字符串结果。


GitHub 上有篇翻译不错：
[翻译](http://pyzh.readthedocs.org/en/latest/python-magic-methods-guide.html)
[原文](http://www.rafekettler.com/magicmethods.html)


## 魔术方法与语法糖

Lisp 的语法极其简单，主要语法“S 表达式”非常接近于数学中的波兰表达式，写法如下：

```schem
(+ 1 2)
```

```scheme
(define add
        (lambda (x)
         (+ x 1)))

(add 1 2)
```

但是简洁的语法也带来了复杂的书写，层层叠叠的括号对于新手来说就是噩梦。为此，
Lisp 的某些方言中就引入了 ``1 + 2`` 这样的语法糖，而实际上与 ``(+ 1 2)``
波兰表达式意义相同。

同理，Python 也是一门非常“始终如一”的编程语言，``'str' + 'ing'`` 也与魔术方法写法
``'str'.__add__('ing')`` 等价，通过覆盖对应的魔术方法就可以实现操作法重载等功能。


## 魔术方法调用表

| 魔术方法				| 调用方式				| 解释
| --------------------------------------|:--------------------------------------|:-------------------------------
| ``__new__(cls [,...])``		| ``instance = MyClass(arg1, arg2)``	| ``__new__`` 在创建实例的时候被调用
| ``__init__(self [,...])``		| ``instance = MyClass(arg1, arg2)``	| ``__init__`` 在创建实例的时候被调用
| ``__cmp__(self, other)``		| ``self == other, self > other``, 等。	| 在比较的时候调用
| ``__pos__(self)``			| ``+self``				| 一元加运算符
| ``__neg__(self)``			| ``-self``				| 一元减运算符
| ``__invert__(self)``			| ``~self``				| 取反运算符
| ``__index__(self)``			| ``X[self]``				| 对象被作为索引使用的时候
| ``__nonzero__(self)``			| ``Bool(self)``			| 对象的布尔值
| ``__getattr__(self, name)``		| ``self.name # name 不存在``		| 访问一个不存在的属性时
| ``__setattr__(self, name, val)``	| ``self.name = val``			| 对一个属性赋值时
| ``__delattr__(self, name)``		| ``del self.name``			| 删除一个属性时
| ``__getattribute(self, name)``	| ``self.name``				| 访问任何属性时
| ``__getitem__(self, key)``		| ``self[key]``				| 使用索引访问元素时
| ``__setitem__(self, key, val)``	| ``self[key] = val``			| 对某个索引值赋值时
| ``__delitem__(self, key)``		| ``del self[key]``			| 删除某个索引值时
| ``__iter__(self)``			| ``for x in self``			| 迭代时
| ``__contains__(self, value)``		| ``value in self, value not in self``	| 使用 in 操作测试关系时
| ``__concat__(self, value)``		| ``self + other``			| 连接两个对象时
| ``__call__(self [,...])``		| ``self(args)``			| “调用”对象时
| ``__enter__(self)``			| ``with self as x:``			| with 语句环境管理
| ``__exit__(self, exc, val, trace)``	| ``with self as x:``			| with 语句环境管理
| ``__getstate__(self)``		| ``pickle.dump(pkl_file, self)``	| 序列化
| ``__setstate__(self)``		| ``data = pickle.load(pkl_file)``	| 序列化

