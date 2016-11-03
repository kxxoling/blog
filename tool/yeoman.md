# 使用 [YeoMan][yeoman] 创建项目

知名框架项目，比如 Django 和 Rails 都有自己的一整套脚手架工具，负责快速生成项目基本代码。但对于小众一点的框架，则可能没有精力去开发类似的工具，又或者出于众口难调的原因，项目并没有官方认可的脚手架工具，这时候你又不希望把基础的代码重复一遍又一遍该怎么办呢？YeoMan 就提供了这样一个通用的项目初始化功能。

## 安装

YeoMan 是一个 node.js 项目，首先需要使用 npm 进行安装：``npm install -g yo``。

初始化项目前首先需要下载/安装模板项目，每一个项目模板也都是一个 node.js 项目，但是需要符合一定的规范，比如命名上必须得是 ``generator-xxx`` 这种形式。安装：``npm install -g generator-xxx``，这里必须是全局安装。

使用命令也很简单：``yo xxx`` 或者 ``yo xxx:sub_command [arguments]``，然后根据提示完成就可以了。


## 目录结构

```
.
├── README.md             // README
├── app                   // generator 目录
│   ├── index.js          // generator 入口文件
│   └── templates         // 模板目录，可以在入口文件中使用 ``this.templatePath`` 获取
└── package.json          // npm 项目配置
```

然后需要在 ``index.js`` 中实现一个 generator.Base 的示例：

```js
const generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  app() {
    this.directory(
      this.templatePath('src'),
      './'
    );   // 将 templates 目录中的 src 目录复制到新建项目的根目录
    // 将 templates 目录中的 ``pathName/fileName`` 复制到新建项目根目录并重命名为 ``targetName``
    this.copy(this.templatePath('pathName', 'fileName), 'targetName');
  },
});
```

之后需要将其发布到 npm，或者在本地运行 ``npm link``，因此还需要一个合格的 ``package.json``：

```json
{
  "name": "generator-xxx"" // 必须是这样的命名方式
  "description": "Yeoman generator",
  "main": "app/index.js",
  "files": [
    "app"
  ],
  "keywords": [
    "yeoman-generator"  // 必不可少
  ],
  "dependencies": {
    "yeoman-generator": "~0.16.0",   // 必须
    "chalk": "~0.4.0",               // 美化输出，非必须
    "yosay": "^0.1.0"                // 美化输出，非必须
  },
  "peerDependencies": {
    "yo": ">=1.0.0"
  }
}
```

想要支持子命令可以在 ``app`` 目录同级创建命令名称同名目录，比如你想支持 ``yo xxx:subcommand``，可以创建这样的目录解构：

```
.
├── app
│   └── index.js
├── subcommand
│   └── index.js
└── package.json
```

这样在自命令过多时会导致根目录过于复杂，可以根据情况将这些目录移动到 ``generators`` 目录中：

```
.
├── generators
│   ├── app
│   │   └── index.js
│   └── subcommand
│       └── index.js
└── package.json
```

## API

上面也简单提到了，实现一个 generator 主要就是实现入口文件中的 generator.Base 实例，因此了解其 API 是必须的。API 主页：http://yeoman.io/generator/


## 示例

我自己也写了/修改了几个简单的 YeoMan generator，可供参考：

- [基于 Tornado 的 Slack bot](https://github.com/kxxoling/generator-tornado-slack-bot)
- [PyPI 项目 python-package](https://github.com/kxxoling/generator-python-package)


[yeoman]: http://yeoman.io/
