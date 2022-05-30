# 为什么 Python 被设计为带有 GIL？

GIL（global interpreter lock），全局解释器锁，是很多编程语言实现中都具有的特性，由于它的存在，解释器无法实现真正的并发。它也是 Python 中经常讨论的话题之一。

Python 作为编程语言存在多个具体实现，包括最常用的 CPython、超集 Cython、.NET 平台的 IronPython、JVM 上的 Jython，R 语言实现的 RPython、JIT 版本的 PyPy 等等。这里我们只讨论最常用的、官方的 CPython 实现。

## GIL 有什么好处？

简单来说，它在单线程的情况更快，并且在和 C 库结合时更方便，而且不用考虑线程安全问题，这也是早期 Python 最常见的应用场景和优势。

## Python（CPython）为什么存在 GIL？

根据[官方 wiki](https://wiki.python.org/moin/GlobalInterpreterLock)，CPython 内存管理不是线程安全的，因此需要 GIL 来保证多个原生线程不会并发执行 Python 字节码。

GIL 的存在一直是富有争议的，它导致 CPython 程序无法真正利用现代操作系统的多进程特性。需要注意的是，对于 I/O 图形处理、NumPy 数学计算这样的耗时操作都发生在 GIL 之外，实际上基本不受影响，真正受影响的都是 CPython 字节码的执行，GIL 会导致性能瓶颈的出现。

Python 采用 GIL 而非管理锁出于以下原因：

- 单线程情况下更快。
- 瓶颈在于 I/O 的多线程环境下更快。
- CPU 耗时操作发生在 C 库调用上时更快。
- 编写 C 扩展会更容易：除法你手动指定，否则不会发生 Python 线程切换的问题。
- 封装 C 库变得更容易，因为不需要考虑线程安全问题。如果该库不是线程安全的，你只需要保证调用时 GIL 是锁定的。

GIL 可以被 C 扩展释放，Python 标准库会在每次 I/O 阻塞结束后释放 GIL，因此 GIL 不会对 I/O 服务器产生很大的性能影响。因此你可以 fork 进程或者创建多线程来创建网络服务器处理异步 I/O，GIL 在这种情况下并没有影响。

很多 C 或者 Fortran 编写的数值解析库（numerical libraries）也可以使用类似的方法释放 GIL。在 C 扩展等待 FFT 完成时，解释器可能正在执行其它线程，GIL 在这种情况下相比精良设计的锁解构更简单也更高效。数值解析的部分都是这样的解构，NumPy 扩展会在不需要时及时释放 GIL。

实际上，在很多时候多线程对于服务器程序来说都不是一个好注意。对于低负载程序，fork 多进程更简单更清晰，对于高负载程序，异步 I/O 或者事件驱动更加高效（比如使用 Twisted 框架）。或许，使用多线程的唯一合理解释在于 Windows 上没有 `os.fork` 。

总之，只有在使用纯 Python 做 CPU 密集运算时 GIL 会是问题。不过你可以使用多进程或者消息传递（比如 [mpi4py](http://pythonhosted.org/mpi4py/usrman/index.html)）来替代，并得到更清晰的架构。
此外，Python 还有 `processing` 这个库可供选择，它提供了和 `threading` 相同的接口，（比如你可以使用 `processing.Process` 来代替 `threading.Thread`。）

如果没有 GIL 的话，多线程可以提供更迅速的 GUI 反应，如果 GIL 影响了性能（比如上面讨论的情况），你可以创建一个独立进程并等待它结束。

整理自 StackExchange 高票回答 [Why Was Python Written with the GIL?](http://softwareengineering.stackexchange.com/a/186909)。
