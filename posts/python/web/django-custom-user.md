# Django 自定义 User model

Django 自带的 User 及 auth 库为快速开发带来了很大便利，也增加了扩展其功能的难度。
Django 官方文档中是推荐使用一对一的关联 Model 来扩展 User model：

```py
class UserExtend(Model):
    user = OneToOneField(User, auto_create=True, relate_name='extend')
    field1 = XxxField()
```

不过在使用时仍需要 ``user.extend.xxx_property``，不是很方便。

在较新版本的 Django 提供了另一种扩展 Django 的方法——替换 ``AUTH_USER_MODEL``。
Django 提供了 ``AbstractUser`` 和 ``AbstractBaseUser`` model 类提供不同程度抽象的
User 抽象 model，继承它之后再在配置文件中指定 ``AUTH_USER_MODEL`` 即可：

```py
# settings.py
AUTH_USER_MODEL = 'app.User'
```

需要在 Django app 的 __init__.py 文件中引用 User model，这里似乎是 Django
解析模块名和类名的函数 bug 的影响。

```py
# app/__init__.py
from app.models import User
```

```py
# app/models.py
class User(AbstractUser):
    name = CharField(max_length=100)
    level = IntegerField(null=True)     # 注意，如果存在不可为空的非字符字段，使用创建用户命令时会报错
    birthday = DatetimeField(null=True)
    gender = NullableBooleanField()
```

最后测试一下是否成功：

```py
from django.contrib.auth import get_user_model
print(get_user_model())        # app.models.User
```

以上！


参考连接：

- [官方文档](https://docs.djangoproject.com/en/1.9/topics/auth/customizing/)

扩展阅读：[Migrating to a Custom User Model in Django](https://www.caktusgroup.com/blog/2013/08/07/migrating-custom-user-model-django/)

