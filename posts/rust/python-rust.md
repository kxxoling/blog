# 写给 Python 程序员看的 Rust 介绍

这篇文章是 Flask 作者、资深 Python 开发者 Armin Ronacher 的作品，文章中比较了两者结构和行为的区别，这里擅自翻译以供大家学习 Rust 或者深入 Python，有些口语化的地方根据自己的理解做了一些意译。

原文：[写给 Python 程序员看的 Rust 介绍（Rust for Python Programmers）](http://lucumr.pocoo.org/2015/5/27/rust-for-pythonistas/)

本文和原文都基于 CC-NC-SA 协议分享。

Rust 和 Python 截然不同，这不仅体现在 Rust 是编译型语言，而另一者是解释型，两者在设计理念上就已经完全不同。
但即使出发点不一样，并不妨碍他们在 API 设计上的存在相似性，Python 程序员可能会因此对 Rust 抱有好感。

## 语法
作为一个程序员，你首先注意到的不同点肯定在于语法。和 Python 不一样，Rust 中存在着大量的花括号和分号，不过这些使得 Rust 在 Python 实现得不好的地方，比如匿名函数、闭包等等，使用起来简单、清晰。这些特性使得编写非缩进式的代码更加方便。

举个例子，在 Python 中打印“Hello world”三次可以这样做：

```python
def main():
    for count in range(3):
        print "{}. Hello World!".format(count)
```

Rust版本：

```rust
fn main() {
    for count in 0..3 {
        println!("{}. Hello World!", count);
    }
}
```

除了关键字、函数名和花括号外并没有明显的不同。
语法上另一大不同之处在于 Rust 需要指定函数的参数类型，而 Python 不需要。
当然， Python 3 中新增的类型注释（type annotations）使用起来和 Rust 的语法很像。

Rust 函数调用的结尾会有一个惊叹符，它其实是宏。在编译期间，宏会展开成对应的东西。
具体看情况，究竟是用于字符串格式化还是打印，这样，编译器就能在编译阶段强制字符串类型了。
也就不会在打印的时候出现函数参数、类型不匹配的情况。


## Traits vs Protocols（特性 vs 协议）

最常见的不同之处在于对象的行为。
在 Python 中，类可以通过实现特定的魔术方法来支持某行为，通常称之为遵从 x 协议——比如 ``__iter__`` 方法用于返回一个迭代器对象。
这些方法应该在类中实现，之后（实例化之后）就不能在修改了。（请无视 Monkey Patch）

Rust 的理念和 Python 类似，不过它选“特性”而非魔术方法。特性的不同之处在于它仅作用于本地，你可以在别的模块中实现更多特性。
如果你想要给整数特殊的功能，并不会影响到（全局的）整数类型。

以一个自调用的类型为例。Python：

```python
class MyType(object):

    def __init__(self, value):
        self.value = value

    def __add__(self, other):
        if not isinstance(other, MyType):
            return NotImplemented
        return self.__class__(self.value + other.value)
```

Rust：

```rust
use std::ops::Add;

struct MyType {
    value: i32,
}

impl MyType {
    fn new(value: i32) -> MyType {
        MyType { value: value }
    }
}

impl Add for MyType {
    type Output = MyType;

    fn add(self, other: MyType) -> MyType {
        MyType { value: self.value + other.value }
    }
}
```

Rust 的实现代码稍微长一些，但是它实现了 Python 代码中未处理的自动类型。
你可能还会注意到，Python 中的方法与类型声明在一起，而 Rust 中两者是分开声明的：``struct`` 定义数据，``impl MyType`` 定义类型所具备的方法，``impl Add for MyType`` 是 Add 特性的实现。
在 Add 方法的实现中，我们还定义了方法返回结果的类型，但是避免了像 Python 中那样需要在运行时检查类型的复杂性。

另一点区别在于，Rust 构造器是明确的，而 Python 的更具迷惑性。
Python 初始化对象时会调用 ``__init__`` 来初始化对象，在 Rust 中则需要手动定义一个功能类似的静态方法，通常是 ``new()`` 方法，来分配对象空间并构造。


## 错误处理/异常处理

Python 和 Rust 中的错误处理理念完全不同！
Python 中错误会以异常的形式抛出，而 Rust 中则是返回值，这听起来很奇怪，但却是是一个不错的设计。

从函数的返回值定义中就可以确定它可能“抛出”的异常，是一种非常清晰的声明方式，
和 Python “显胜于隐”的设计哲学不谋而合。（Python 中也鼓励手动抛出异常而非过多的条件判断。）

Rust 中的函数可以返回 Result，Result 是一种规范化的类型，分为成功和失败两种。
``Result<i32, MyError>`` 表示这个方法成功时会返回 32位的整数类型，失败时返回 MyError。
如果你需要返回多种错误怎么办？

Python 函数可能会抛出任何错误，但并不会做出任何处理。比如，你在使用 requests 库时可能会遇到 SSL error 或者其它错误，并且只有当它发生时你才知道出错了，但如果文档中没有明确的说明，你永远都不知道它会返回什么样的错误。

Rust 不一样，函数的声明中就包含了会遇到什么样的错误。
如果需要返回两种以上的错误，通常是建议定义一个内部错误来整合。
以一个 HTTP 库为例，它可能会抛出 Unicode error、IO error、SSL error 等等。
你可以把它们都定义为一个只在你的库中使用的错误类型，用户也只需要知道它即可。

Rust 的错误链机制能够在你需要的时候回溯到产生错误的地方。
你可以在任意时候是使用 ``Box<Error>`` 这个所有错误的根来代替自定义错误。
相比之下，Rust 的错误更透明，而 Python 中会比较绕。

Rust 的错误处理机制是由 ``try!`` 宏提供的，下面是一个例子：

```rust
use std::fs::File;

fn read_file(path: &Path) -> Result<String, io::Error> {
    let mut f = try!(File::open(path));
    let mut rv = String::new();
    try!(f.read_to_string(&mut rv));
    Ok(rv)
}
```

上面代码中的 ``File::open`` 和 ``read_to_string`` 都会失败并返回 IO error，
而 ``try!`` 宏会将错误向上传递，并且会立即返回。返回信息是 success 还是 failure
由包裹函数是 ``Ok`` 还是 ``Err`` 确定。

``try!`` 宏引用了 From 特性以运行错误转换。例如你可以通过修改返回值 ``io::Error`` 为 ``MyError``，并且通过实现 From 特性来实现 ``io::Error`` 到 ``MyError`` 的转换，它也会被自动引用。

或者，你也可以使用 ``Box<Error>`` 作为返回值类型代替 ``io::Error``，这样就可以传递任何类型的错误了。
这样做的坏处是，原本编译期就能确定错误的程序必须正式运行的时候才能确定。

如果你不打算处理异常而直接退出执行，可以 ``unwrap()`` 结果，这样成果返回的结果会是一个错误，程序会因此退出。

## 可变性和所有权

可变性（mutability）和所有权（ownership）是 Python 和 Rust 最本质区别的地方！
Python 会自动 GC ，因此运行的时候会有很多意想不到的事情发生，你可以随意地传递对象，虽然可能产生一些内存泄漏问题，不过大部分问题都会它都能在运行时自动解决。

Rust 不支持 GC，但仍然能够自动管理内存，这得益于其所有权跟踪机制，你创建的所有对象都被另一个对象所拥有。

对比 Python，你可以认为 Python 中的所有对象的所有权都是 Python 解释器。

Rust 中的所有权存在范围设定，一个调用对象列表的函数拥有这个列表的所有权，而列表拥有其中所有对象的所有权，而这一切都发生在函数的作用域中。

下面通过一个关于生命周期注释（lifetime annotation）和函数签名的更复杂的例子来帮助你理解什么是“所有权”。以实现上面的“加法”为例，接收者（receiver）和 Python 中一样命名为 ``self``，不同的是值会被“移动到”函数中，而不像 Python 那样是通过可变引用来实现。也就是说，你可能是用 Python 这样实现：

```python
leaks = []

class MyType(object):
    def __add__(self, other):
        leaks.append(self)
        return self

a = MyType() + MyType()
```

当你将 ``MyType`` 的实例加入另一个对象时，就会将 ``self`` 泄漏到 ``global`` 列表中，
也就是说，运行上面的代码将获得

当你将一个 ``MyType`` 类型的实例和另一个对象相加时都将会使得自身泄漏到全局列表中，
也就是说，当你运行上面的代码时，第一个 ``MyType`` 将会被引用两次：被第二个实例引用，
以及被 ``global`` 所引用。

而 Rust 中不存在这样的问题，每个对象都只能有一个所有者。你在引用 ``self`` 时，
编译器将会将值“移动”过去，这时函数将无法找到原来的 ``self`` 也就无法将它 return 回去。
想要 return ``self`` 则必须向将它移动回去（将它从引用中删除）。
如果你想要把 ``self`` 泄露出去，编译器会负责“移动”值，但是这样函数就无法返回 ``self``，因为它已经被移动了。想要返回它，你首先还是需要把它再移动回去（比如从列表中将它删除）。

如果你需要多次引用同一个对象该怎么办呢？Rust 提供的解决方案是“借用（borrow）”，“借用”这个变量的值。
借用的数量可以没有限制，但是不允许对借用的对象进行修改，或者可以修改但只允许存在一个借用。

操作不可变“借用”的函数被标记为 ``&self``，使用可变借用的函数被标记为 ``&mut self``。作为拥有者你只能“借出”引用。如果想要将值移出函数（比如返回），则不能有额外的借出，并且将所有权移动后不能再借出。

这可能会颠覆你思考程序的方式，但习惯它能帮你更好地理解程序。

### 运行时的“借用”和可变的所有者

目前为止，都能在运行时验证所有的所有权并没有问题，但编译时无法验证所有权怎么办？

你有以下可选方案：第一种方案你可以使用 mutex，mutex 保证只有一个用户可以可变地借用对象，但对象的所有者是 mutex。这样你就可以在视线获取对象时，永远只有一个线程能够取到它。

这也意味着，你不得不使用 mutex 锁，否则会导致数据竞争，无法通过编译。

如果你想像 Python 一样编程，不用找出内存的所有者？

在那种情况下你可以将一个对象封装在引用计数器中，并在运行时将其借出。

这种方式非常类似 Python，同时也可能导致循环。Python 会在 GC 的时候解除循环，但 Rust 不会。

不妨用个比较复杂的例子来比较一下：

```python
from threading import Lock, Thread

def fib(num):
    if num < 2:
        return 1
    return fib(num - 2) + fib(num - 1)

def thread_prog(mutex, results, i):
    rv = fib(i)
    with mutex:
        results[i] = rv

def main():
    mutex = Lock()
    results = {}

    threads = []
    for i in xrange(35):
        thread = Thread(target=thread_prog, args=(mutex, results, i))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    for i, rv in sorted(results.items()):
        print "fib({}) = {}".format(i, rv)
```

上面的代码会生成 35 个线程，都用于计算斐波那契数，最后将所有结果聚合并排序。
你可能会注意到 mutex（锁）和结果数组直接并无关系。


```rust
use std::sync::{Arc, Mutex};
use std::collections::BTreeMap;
use std::thread;

fn fib(num: u64) -> u64 {
    if num < 2 { 1 } else { fib(num - 2) + fib(num - 1) }
}

fn main() {
    let locked_results = Arc::new(Mutex::new(BTreeMap::new()));
    let threads : Vec<_> = (0..35).map(|i| {
        let locked_results = locked_results.clone();
        thread::spawn(move || {
            let rv = fib(i);
            locked_results.lock().unwrap().insert(i, rv);
        })
    }).collect();
    for thread in threads { thread.join().unwrap(); }
    for (i, rv) in locked_results.lock().unwrap().iter() {
        println!("fib({}) = {}", i, rv);
    }
}
```

Rust 版本和 Python 版本最大的不同之处在于使用了 B 树 map 而不是 hash 表，结果存放于 Arc mutex 中。

这是为什么？这里使用 B 树是因为它能够自动排序，而这正是我们所需要的。

将值存放在 mutex 中是因为这样可以在运行时将其锁住。

关系创建后，我们将其置入 Arc，因为 Arc 会管理它所封装的事物的引用计数，本例中即 mutex。也就是说，直到最后一个线程运行结束时 mutex 才会被删除。非常简洁！

下面解释下这段代码是如何工作的：首先数 20 次，和在 Python 中一样，每次都运行一个本地函数。和 Python 中不同的是，我们在这里可以使用闭包。之后将 Arc 复制到本地线程中，也就是说每个线程都会有自己的 Arc（这会 Arc 的增加引用计数，但会在线程结束的时候释放）。之后我们使用本地函数 spawn 一个新线程，这会将闭包移动到线程中。

之后每个线程都会执行 Fibonacci 函数，When we lock our Arc we get back a result we can unwrap and the insert into. 
先不要管解包过程，这只是将明确的结果转换为 panic。重点在于，你只有在解除 mutex 锁之后才能获得结果映射，所以千万不能忘记解锁。

之后我们将所有线程集中到 vector 中，最后迭代所有线程，合并并打印结果。

这里有两点需要注意的地方：可见类型非常少。当然，Arc 和 Fibonacci 函数接受 64 位 unsigned 整数，除此之外，没有任何类型是可见的。在我们也可以使用 B-tree 映射来代替哈希表，因为 Rust 内置了这个类型。

迭代的运行方式和 Python 几乎完全一致，不同之处在于，这上面这个 Rust 例子中我们需要引入 mutex，因为编译器不知道线程会怎样结束，而 mutex 是不必要的。当然 Rust 也有不需要引入 mutex 的 API，只不过在 Rust 1.0 中还不是稳定版本。

性能优化会如你所期望地那样进行。（这里的优化情况很糟糕，因为只是未来提供一个线程执行的例子。）


## Unicode

我最喜欢的话题是 Unicode :) ，这也是 Python 和 Rust 相差最大的地方。

Python （2 和 3）都使用着相似的 Unicode 模型，将 Unicode 数据映射至字符数组。

在 Rust 中，Unicode 都是 UTF-8 格式存储，我之前也提到过为什么这比 Python 或者 C# 的解决方案要好得多（参见 UCS vs UTF-8 as Internal String Encoding）。
非常有趣的是 Rust 是如何处理丑陋的编码问题的。

首先 Rust 一开始就意识到操作系统（不论是 Windows Unicode 还是 Linux 非 Unicode）的 API 都非常糟糕，它没有像 Python 一样强制使用 Unicode，但是实现了一套低廉的字符转化系统，这在现实使用中非常出色，也使得 Rust 拥有高效的字符处理能力。

对于大多数支持 UTF-8 的程序来说，编码、解码并不需要，只需要简单地验证编码的正确性，并不需要的对 UTF-8 字符编码后再输出。如果需要集成 Windows Unicode API，只需要在内部使用 WTF-8 进行编码，可以很高效地和 UTF-16 这样的 UCS2 编码之间进行转换。

无论何时，你都可以将 Unicode 和字节码互相转换，之后检验以确保所有操作都按预期进行了。这使得编写协议既快速又高效。和 Python 那种不断编码、解码的方式相比，只需要支持 O(1) 的字符索引。

得益于 Unicode 优秀的存储模型，Rust 还自带或者太 crates.io 上提供了很多 Unicode 处理的 API，包括 case folding、分类、Unicode 正则表达式、Unicode 正常化、标准的 URI/IRI/URL API、分割操作以及命名映射等等。

缺点呢？``"föo"[1]`` 的结果不是 ``'ö'``，但你本来就不应该这样做。

下面有一个用于示范如何和 OS 集成的例子，执行它会打印出当前目录的信息和文件名：

```rust
use std::env;
use std::fs;

fn example() -> Result<(), Box<Error>> {
    let here = try!(env::current_dir());
    println!("Contents in: {}", here.display());
    for entry in try!(fs::read_dir(&here)) {
        let path = try!(entry).path();
        let md = try!(fs::metadata(&path));
        println!("  {} ({} bytes)", path.display(), md.len());
    }
    Ok(())
}

fn main() {
    example().unwrap();
}
```

所有 IO 操作都使用了上面用过的 Path 对象，包含了 OS 内部的路径属性。根据系统使用的编码，它可能是字节、Unicode 或者 OS ``.display()`` 格式化（这会返回一个能将自身格式化为字符串的对象）前的调用格式。这很方便，因为你不会像在 Python 3 中那样无意中漏掉错误编码的字符串，它提供了清晰的区分。


## 库以及应用发布

Rust 提供了一个称为“cargo”的工具，作用基本相当于 Python 中的 virtualenv+pip+setuptools ，
不过默认情况下它尽能保证一个版本的 Rust 正常工作。
“cargo” 能够同时支持库的不同版本，并且可以直接从 git 仓库或者 crates.io 源中安装程序，通常安装 Rust 的时候就已经自带了 cargo。


## Rust 会代替 Python 吗？

Python 和 Rust 之间并没有直接关系，

- 对于科学计算等领域，丰富的库和文档的作用非常之大，Rust 不可能在短期内影响到 Python 在其中的地位。
- 对于脚本这样的领域，只要 Python 能解决，我不认为你会考虑选择 Rust。
- 虽然肯定会有很多 Python 程序员去学习 Rust，但就和很多 Python 学习 Go 一样，并不是以替代 Python 为目的。

Rust 是一门非常强大的语言，拥有稳定的基金会、友好的社区、人性化的许可证，可能会在编程语言的民主制度掀起一场革命。

Rust 几乎不需要运行时支持，因此通过 ctypes 或 CFFI 来和 Python 交互并不难，直接使用 Python 封装的 Rust 二进制库并非不可能。


