# Django 与 Flask 中的视图类

提到 Django 和 Flask，Tornado 开发者印象最深的可能就要属这个视图函数了，使用简单但是难以扩展，
尤其这个 ``if request.method == 'GET'`` 着实不够优雅，引起使用起来非常受限。
这样一个明显的缺陷，不可能不被官方注意到，两者也确实提供了更强大的的视图类。


## Django

[Django 1.8 的文档](https://docs.djangoproject.com/en/1.8/topics/class-based-views/) 中
提供了这样的示例：

```python
# some_app/views.py
from django.views.generic import TemplateView

class AboutView(TemplateView):
    template_name = "about.html"
```

```python
# urls.py
from django.conf.urls import url
from some_app.views import AboutView

urlpatterns = [
    url(r'^about/', AboutView.as_view()),
]
```

与 Tornado 的用法还是有些区别的。Tornado 中直接把 ViewHandler 类作为了视图，Django 中却是
类方法的运行结果。我们不妨来看看这个 `as_view()` 方法是如何实现的，
其实现代码在 ``TemplateView`` 的
[父类 ``View`` 中](https://github.com/django/django/blob/master/django%2Fviews%2Fgeneric%2Fbase.py#L46)：

```python
@classonlymethod
def as_view(cls, **initkwargs):
    """
    Main entry point for a request-response process.
    """
    for key in initkwargs:
        if key in cls.http_method_names:
            raise TypeError("You tried to pass in the %s method name as a "
                            "keyword argument to %s(). Don't do that."
                            % (key, cls.__name__))
        if not hasattr(cls, key):
            raise TypeError("%s() received an invalid keyword %r. as_view "
                            "only accepts arguments that are already "
                            "attributes of the class." % (cls.__name__, key))

    def view(request, *args, **kwargs):
        self = cls(**initkwargs)
        if hasattr(self, 'get') and not hasattr(self, 'head'):
            self.head = self.get
        self.request = request
        self.args = args
        self.kwargs = kwargs
        return self.dispatch(request, *args, **kwargs)
    view.view_class = cls
    view.view_initkwargs = initkwargs

    # take name and docstring from class
    update_wrapper(view, cls, updated=())

    # and possible attributes set by decorators
    # like csrf_exempt from dispatch
    update_wrapper(view, cls.dispatch, assigned=())
    return view
```

只不过是封装了一个根据 HTTP Method 调用特定方法的函数，将这个函数作为返回值
返回并与对应路由绑定。

Tornado 开发者需要注意的是，Django View class 的 HTTP 处理方法需要传入 ``request`` 参数，
而不是像 Tornado 那样调用自身的 ``self.request``。区别的原因在于，Django 并非 Tornado 那样
以类作为处理请求的基本单位，Django 的视图类本质上还是视图函数的一层封装。

Django 中还有一种 MixIn 的用法，懒得看了 :P


## Flask

Flask 在 “step by step” 的理念下，尽可能地保持了功能的简单性，也是函数视图大行其道的原因。
Flask 在开发中，很大程度上借鉴了 Django 的设计，当然“all in one”思想除外，Flask 同样提供了
``flask.view.View`` 来快速生成视图，原理和 Django 类似，不同的是 Flask 中广泛应用的装饰器需要
这样使用：

```python
from flask.views import MethodView

class UserAPI(MethodView):

    def get(self):
        users = User.query.all()
        ...

    def post(self):
        user = User.from_form_data(request.form)
        ...

def user_required(f):
    """Checks whether user is logged in or raises error 401."""
    def decorator(*args, **kwargs):
        if not g.user:
            abort(401)
        return f(*args, **kwargs)
    return decorator

view = user_required(UserAPI.as_view('users'))
app.add_url_rule('/users/', view_func=view)
```

0.8 版本之后提供了装饰器列表简化装饰器的使用：

```python
class UserAPI(MethodView):
    decorators = [user_required]
```

相关文档：[Flask 插拨式视图](http://www.pythondoc.com/flask/views.html)


## 总结

Django 和 Flask 都并非一开始就支持类视图，因此提供的类视图对重构都非常友好，
基本上只需要将函数的代码复制到新的视图类中就可以了。推荐有需要的函数视图尽可能地重构为类视图，
以提供更强大的继承和复用功能。

