# 写给 Python 程序员看的 ECMAScript 6 介绍

首先要明确的是处理面向对象，还有很多编程语言范式，Python 本身就是一个支持面相对象和函数式编程的多范式编程语言。

编程范式的存在是为了解决的代码复用和共享问题。

JavaScript 主要是一门面向原型的编程语言，但是吸收了众多函数式编程的思想，却缺乏常见的函数式编程基础功能。


## ``const`` 与常量

在 ES5 及之前的规范中，JS 声明对象时只能使用 ``var``，ES6 中新增了 ``const`` 和 ``let``，其中 ``const`` 仅可以用于声明常量，在各编程规范中都建议优先使用。常量一经声明不得改变，我本人也是个“常量纳粹”。

而 Python 中并不支持定义常量，只能从编程规范中建议使用“以下划线连接的大写字母”表示常量。


## ``let`` 与作用域

ES6 对于 JS 变量的作用域做了很多增强，其中之一就是 ``let``。使用 ``let`` 声明的局部变量无法应用于它所在代码块以外的地方。例如：

```js
// ES5
var arr = [1,2];
for (var i = 0; i < arr.length; i++) {}
i   // 2
```

而在 ES6 中：

```js
// ES6
var arr = [1,2];
for (let i = 0; i < arr.length; i++) {}
i   // ReferenceError: i is not defined
```

这一点我对 Python 也颇有微辞，因为 Python 中 ``for...in`` 循环和 ES 一样并不存在自己的作用域，因此在其中定义的变量会影响外部环境：

```py
for i in range(2):
    pass

i  # 1
```


## 变量的解构赋值

解构赋值/析构赋值/元组解包一直是函数式语言的一大特色，而 JS 在这方面做得一直都不够好，不过 ES6 大大优化了这点，甚至超过了 Python。

```js
// ES6
var [a, b, c] = [1, 2, 3];
a // 1
b // 2
c // 3

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3
```

在两边解构无法对上的情况下 ES6 并不会报错，多余的值将被忽略，而多余的变量值为 ``undefined``。这一点是和 Python 不一样的，另外 Python 中还不支持嵌套解构：

```js
// ES6
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3
```

和 Python 3 一样，ES6 也支持展开符解构，不同的是 Python 中展开符是 ``*``，ES6 中是 ``...``。

```js
// ES6
let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```

对于的 Python 3代码：

```py3
head, *tail = range(1, 5)
```

在 Python 3 中，``head`` 如果没有对应值则会报 ``ValueError`` 错误，而 ES6 中则会自动附上 ``undefined``。


## 数组 vs. 列表

JS 中的数组本质上是键为连续数字的对象，在 pop 时会自动维持键的有序性，因此大数组的 pop/insert 操作是非常消耗性能的行为。而 Python 中 list 的实现一直是队列解构，并不会存在这样的问题。

考虑到 JS 数组的本质，ES6 提供了将与之类似的对象转换为数组的函数 ``Array.from``：

```js
// ES6
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    '4': 'd',  // 超过 length 则忽略
    length: 3, // 指定数组的长度，不足的以 undefine 补充，超过的被忽略
};
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

// ES5 中只能这样：
var arr1 = [].slice.call(arrayLike);
```

ES5 中数组创建方法的行为一直不统一，因此提供了 ``Array.of`` 来创建新数组：

```js
// ES5
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]

// ES6
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

ES5 中数组还有一个问题，不能简单地确定数组中是否存在指定对象，ES6 为此添加了 ``Array.find`` 和 ``Array.findIndex`` 两个方法：

```js
// ES6
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10

// ES5
[NaN].indexOf(NaN) // -1

// ES6
[NaN].find(NaN) // true
```

``findIndex`` 会在无法找到 index 时返回 ``-1``。


## Set 和 Map

为了解决 ES5 内建数据解构缺乏的问题，ES6 还提供了新的构造函数 ``Set`` 和 ``Map``。其中 Map 是为了解决纯数据类型的 hash 解构的，因此原先某些对象的使用情况可以使用 Map 来代替。

对应 Python 中的 ``set`` 和 ``dict``，但是和 Python 不同的是，Set 和 Map 都是有序的，其顺序和对象的添加顺序是一致的。

ES6 Map、Set 常用方法 ``.keys()``、``.values()``、``.entries()``、``.get()``、``.set()`` 也和 Python dict 一一对应。（注意 ``.entries()`` 实际上对应的是 ``dict.items()``）

> 需要注意的是 Python 3 中 ``dict.keys()``、``dict.values``、``dict.items()`` 返回的都是类似生成器的对象，而不是 Python 2 中的列表。

ES6 中对应 Set 和 Map 的还有 WeakSet 和 WeakMap，个人感觉平时业务开发中并没有使用到的机会。


## Iterator 和 ``for...of``

ES6 中新增了 Iterator 接口，和 Python 中的 Iterator（迭代器）概念类似。所有实现了 Iterator 接口的对象都支持 ``for...of`` 循环。常见支持 Iterator 接口的类型包括：``Array``、``Map``、``WeakMap``、``Set``、``WeakSet``，而对象默认是不支持 Iterator 协议的，需要手动实现 Iterator 协议。

和 Python 不一样的是，遍历 Map 对象时，对应的是遍历 Python 的 ``dict.items()``，同时可以使用解构赋值：

```js
var myMap = new Map();
myMap.set(0, "zero");
myMap.set(1, "one");
for (var [key, value] of myMap) {
  console.log(key + " = " + value);
}
```

### Iterator 协议


## Generator 与 yield


## 描述器


## Object 对象

### ``Object.js``

### ``Object.assign``


## 函数、代码块与作用域


## async 与 await

