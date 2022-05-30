# Django REST framework 笔记

[Django REST framework]（以下简称 DRF）是一个开源的 Django 扩展，提供了便捷的 REST API 开发框架，拥有以下特性：

- 直观的 API web 界面。
- 多种身份认证和权限认证方式的支持。
- 内置了 OAuth1 和 OAuth2 的支持。
- 内置了限流系统。
- 根据 Django ORM 或者其它库自动序列化。
- 丰富的定制层级：函数视图、类视图、视图集合到自动生成 API，满足各种需要。
- 可扩展性，插件丰富。
- 广泛使用，文档丰富。


## REST 和 RESTful

REST 全称 REpresentational State Transfer，即“表现层状态转化”，RESTful 架构即符合 REST 风格的架构。
网上关于 REST 的讨论很多，在一些细节的地方却经常稍有出入，不过大体思想都是充分利用 HTTP/HTTPS 协议的特点，比如 HTTP 方法、header 信息、HATEOAS，直接面向资源进行操作。

阮一峰的两篇介绍：

- http://www.ruanyifeng.com/blog/2011/09/restful.html
- http://www.ruanyifeng.com/blog/2014/05/restful_api.html


## 基础组件／基本概念

### 序列化（Serializer）

[序列化][Serializer]（Serializer）是 DRF 的核心概念，提供了数据的验证和渲染功能，其工作方式类似越 Django Form，当然也提供了对应 ModelForm 的 ModelSerializer。
和 Django Form 类似，Serializer 也是基于 Field 进行字段验证，Field 类都来自于 ``rest_framework.fields``。

```py
class YourSerializer(Serializer):
	field1 = Field()
	def save(self, validated_data):
		# save your data here
		return saved_data
	def update(self, instance, validated_data):
		# update your instance
		return instance
```

Serializer 的主要工作是将 Python 数据结构序列化为其它格式（XML／JSON 等等）。

序列化之后的数据保存在 ``serializer.data`` 中的，可以使用 ``SomeRenderer().render(serializer.data)`` 将其序列化为字符串对象作为 Response body 返回。

反序列化

```py
data = SomeParser().parse(incoming_stream)
serializer = YourSerializer(data=data)
if serializer.is_valid():     # 这里会根据 Serialzier 的 Field 和自定义验证工具进行数据校验
	logging.info(serializer. validated_data)
	serializer.update()        # 或者 serializer.create()
```

对于自定义 Serializer，你需要自己实现 ``create`` 和 ``update`` 方法。

你也可以使用 ``serializer.save(**data)``，``save`` 方法的行为取决于初始化的方式：

```py
# .save() 会创建一个新实例
serializer = CommentSerializer(data=data)

# .save() 会更新 `comment` 实例
serializer = CommentSerializer(comment, data=data)
```

反序列化时应该先运行 ``serializer.is_valid()`` 判断数据是否合法，``serializer.is_valid(raise_exception=True)`` 会直接返回 400 信息。

#### 字段验证

可以通过 Field 类型定义或者 ``.validate_<your_field>`` 方法来自行判断。字段名已设置 ``required=False`` 时，``validate_<your_field>`` 将自动跳过空字段。

对象级验证应当实现 ``.validate()`` 方法。

#### 部分更新

部分更新和更新不一样，应当是使用 HTTP 的 PATCH 方法发送请求。

#### 嵌套对象

DRF 支持数据嵌套创建和修改，不过这样不利于数据的扁平化管理和测试。

#### 序列化关联对象

``PrimaryKeyRelatedField``
``HyperlinkedRelatedField``
``SlugRelatedField``
``HyperlinkedIdentityField``
``YourSerializer``

对于可写的 Serializer，``queryset`` 是必须值。

对于自定义的多对多字段，需要手动设置 ``read_only=True``。


#### HyperLinkedModelSerializer

HyperLinkedModelSerializer 是一个值得推荐的 Serializer，它能够自动为 HTMLRenderer 提供相关外键资源的超链接，便于 web 调试。

但是它的使用也有一些问题，需要注意一下：

#### 搜索

可以在 Serializer 中定义 ``search_fields`` 来指定可以搜索的字段，DRF 的搜索是基于 ``like``，因此并不支持模糊搜索，在数据量较大的情况下还会有性能问题。


### View 和 ViewSet

DRF 通过 View 提供 API 接口，一个 View 可以对应多个 Renderer，针对不同的渲染条件提供不同的输出格式（HTML／XML／JSON）。

ViewSet 则是 View 的一个封装，一个 ViewSet 可以为同一个 URL 根据请求方法提供不同的接口。尤其是 ModelViewSet 会自动根据 Model 的定义生成 REST 接口和 URL，能够快速生成网站的一整套 API。

定义一个 ViewSet 需要为其声明 ``queryset`` 和 ``serializer`` 属性：

```py
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
```

反序列化多个对象：http://www.django-rest-framework.org/api-guide/serializers/#dealing-with-multiple-objects

只写字段：http://www.django-rest-framework.org/api-guide/serializers/#additional-keyword-arguments

Meta 继承：

```py
class AccountSerializer(MyBaseSerializer):
    class Meta(MyBaseSerializer.Meta):
        model = Account
```

bulk_create：
http://www.django-rest-framework.org/api-guide/serializers/#listserializer

动态修改字段：http://www.django-rest-framework.org/api-guide/serializers/#dynamically-modifying-fields


### Field

Field 和 Django Form 的 Field 类似，可用参数有：

``source``：对应的 Model 字段，可以是关联对象的字段。``source='*'`` 用于嵌套显示。
``initial``：HTML form 中的初始值。
``style``：HTML 中的样式，类型为 Python dict。

自定义字段需要实现 ``.to_representation(self, obj)`` 和 ``to_internal_value(self, data)`` 序列化和反序列化字段。反序列化时可以调用 ``self.fail(<default_error_messages_key>)`` 返回定制错误信息。


### Filter 和 FilterSet

DRF 查询请求可以使用 Filter 进行过滤，通过定义 Filter 类来对 QuerySet 进行加工和修改。


### Pagination

Pagination 是对 List 请求进行分页的类，默认支持 page 分页、cursor 分页等多种分页类型。

### Parser

根据 Content-Type 自动寻找最合适的 Parser 序列化 Response 和 Request。

Parser 和 Serializer 的关系？

自动驼峰化字段名：
https://github.com/vbabiy/djangorestframework-camel-case

### 路由和 URL 注册

嵌套路由：https://github.com/alanjds/drf-nested-routers

### Renderer

Renderer 会在返回 HTTP 请求前对 Python 对象进行渲染，以生成符合用户 代理需求的请求内容。通过声明多个的 Renderer 为不同的用户代理提供最合适的请求结果。

### 权限判断 Permission

Django 自带了强大的权限验证系统，DRF 进一步扩展了这项能力。

Django 的 permission 是基于 group 和 permission，DRF 也是如此。我们可以这样定义一个新的 Permission：

```py
class YourPermission(BasePermission):
    class Meta:
        # 命名为cms设计稿里面对应 '菜单权限' 的地方, 例如用户管理
        permissions = (
            ("information.announcement", u"资讯管理-通知公
            ("exam.room", u"考务管理-考场管理"),
            ...
        )
```

然后在 View／ViewSet 中指定该 Permission 类：

```py
class DetailView(YourBaseView):
    ...
    permission_classes = (IsAuthenticated, YourPermission)
    ...
```

### DRF 设置

http://www.django-rest-framework.org/api-guide/settings/

### 测试

http://www.django-rest-framework.org/api-guide/testing/

### 流程图


``` sequence
title Django REST framework

Request-> Router: Authentication Response
//note right of Bob: Bob thinks about it
Router->ViewSet: 路由匹配
ViewSet->Authentication: 身份校验
Authentication->Throutting: 限流
Throutting->Serializer: 序列化请求

opt 反序列化
    Serializer->Filter: 根据定义的 Filter 验证 Query
end

opt 序列化
    Serializer->Field: 根据定义的 Field 序列化 Serializer 查询结果
end

Serializer->Responce: 返回结果和状态
Responce->Renderer: 根据请求头寻找最合适的 Renderer 渲染响应结果
```


## 提高

DRF 提供了简单的文档和调试页面，但是你也可以通过一些第三方工具来增强这方面的能力：http://www.django-rest-framework.org/topics/documenting-your-api/

## 和 SPA 集成

网站的 Ajax 接口可以通过 SessionAuthentication 进行身份验证，对于不同网站的调用可以使用 TokenAuthentication 提供身份认证。

对于网站来说，最好还应该提供 CSRF 防范。

对于同源问题，应当使用中间件来保证安全，可以使用 https://github.com/ottoyiu/django-cors-headers/ 。

## 一些需求

### 不同权限用户 API 访问频率限制
http://www.django-rest-framework.org/api-guide/throttling/#throttling
http://my.oschina.net/duoduo3369/blog/612730

### 对于不同参数返回不同的序列化结果（输出时使用不同的序列化类）

### 同一 URL 不同方法设置不同权限

覆盖 ``get_permissions`` 方法：

```py
YourView(BaseView):
    ...
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]
```

### 限制分页大小

默认情况下会 DRF 根据前端输入的分页大小进行分页，如果用户恶意传入一个极大的分页大小将会占用过多服务器资源，影响正常请求的处理，因此有必要限制分页最大大小。

```
class YouView(BaseView):
    paginate_by = 10 				# 覆盖 settings 中的默认分页
    max_paginate_by = 100 			# 限制最大分页大小
```

也可以动态地去判断最大分页大小：

```py
class YouView(BaseView):
    ...
    def paginate_queryset(self, queryset):
        self.paginator.max_page_size = YOUR_PAGE_SIZE_LIMIT
        return super(YouView, self).paginate_queryset(queryset)
```



[Django REST framework]: http://www.django-rest-framework.org/
[Serializer]: http://www.django-rest-framework.org/api-guide/serializers/


