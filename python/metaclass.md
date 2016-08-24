# Python 中的元类（metaclass）

metaclass 这个词是由“meta”和“class”组成，意味元类，顾名思义就是类的类型。在 Python 中，由 class 定义其实例的行为，而 metaclass 定义了 class 的行为。也就是说实例对象是类的实例，而类是元类的实例。

在 Python 中，任何 class 都有 metaclass，没有显示声明时默认的 metaclass 就是 type，
就是那个当作能够输出对象类型的 ``type``！（Python 中的 ``type`` 很关键，值得单独拿出来详细讲解。）``type`` 是最基本的元类，因此想要自己实现一个元类只需要继承 ``type``。

元类最常见的用法就是用于创建对象工厂，和创建实例一样，通过元类创造类也只需要调用元类对象：``YourClass = YourMetaClass(*args, **kwargs)``。相对类型实例化时调用的 ``__init__``，元类实例化（产生类）时会调用 ``__new__`` 方法，你可以在这时候做一些额外的工作。

当执行到 ``class`` 状态符的时候，Python 首先将其中代码当作普通的代码块执行一遍，会生成一个类似字典的命名空间用于保存类所应该具有的属性信息。The metaclass is determined by looking at the baseclasses of the class-to-be (metaclasses are inherited), at the __metaclass__ attribute of the class-to-be (if any) or the __metaclass__ global variable. The metaclass is then called with the name, bases and attributes of the class to instantiate it.

不过元类通常用于定义类的类型，而不仅仅用作类工厂。因此你可以在元类上定义普通的方法，这种元类方法和类方法类似，不需要实例化就可以调用它，但不同的是你不能在类的实例上调用这些元类方法。

``type.__subclasses__()`` 是元类 ``type`` 的一个方法，你还可以在元类上定义普通的魔术方法，比如 ``__add__``、``__iter__`` 和 ``__getattr__``。

```py
def make_hook(f):
    """foo to __foo__"""
    f.is_hook = True
    return f

class MyType(type):
    def __new__(cls, name, bases, attrs):
        pass
    def __init__(name, bases, attrs):
        super(MyType, self).__init__(name, bases, attrs)
    def __add__(self, other):
        class AutoClass(self, other):
            pass
        return AutoClass
    def unregister(self):
        pass
```

参考：[StackOverflow](http://stackoverflow.com/questions/100003/what-is-a-metaclass-in-python)
