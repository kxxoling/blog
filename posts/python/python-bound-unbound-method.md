# Python 中的方法绑定

相信 Python 程序员多多少少都和我一样遇到过 Method Unbound Error，直译过来就是
“方法未绑定错误”，虽然搜索之后知道了使用 ``@classmethod`` 这样的装饰起后就可以解决问题，
但是一直没有得到完全解惑。

我们知道，Python 是一个动态语言，在类的创建过程中甚至实例化以后都能动态地修改其方法、
属性，这种做法通常被称为“Monkey Patching”，虽然我们并不提倡 MP，但是 Python
在创建类的过程中确实就是基于类似原理进行的方法绑定，类方法的绑定通常是在 ``__new__``
中，我们在创建元类时，通常也会覆盖该方法。

另一个概念，也是在使用 Python 之前一直未能透彻理解的概念，“方法是一种特殊的函数”，
在这里明确无疑！对于一般的方法 ``normal_method(self, *args, **kwargs)``
我们通常都是在类中定义，然后在调用类的实例对象时动态地将对象本身作为作为第一个参数传入，
因此在调用没有声明 self 变量的方法时就会遇到这样的错误：

```
class C:
    def normal_method():
        pass

# TypeError: normal_method() takes no arguments (1 given)
```

注意这里的 ``self`` 只是一个变量名的约定，你可以替换为任何非系统保留字。

这样的方法在定义的适合就依赖于实例对象了，也就是绑定在了实例对象上，然而实例化之前
方法并没有 ``self`` 可以绑定，于是就会出现 Method Unbound Error。
类似的，类方法也是这样自动地将类对象传入方法的 Bound Method。那么 Python 是如何知道
什么时候传入实例对象，什么适合传递类对象的呢？答案就在这个 ``@classmethod`` 中。

除了上面实例方法和类方法两类 Bound Method，还有对应的 Unbound Method，也就是不需要
self 或者 cls 进行绑定的方法，这就是 static method，通过 ``@staticmethod`` 忽略掉
方法接受的第一个参数。
