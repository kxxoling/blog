# 使用GitBook

[GitBook](https://www.gitbook.com/) 是一个提供 Markdown 书籍托管的网络平台，
支持通过 git 以及 GitHub 进行文档管理，使用它可以很简单地生成、发布电子图书。
同时，[GitBook](https://github.com/GitbookIO/gitbook) 也是一个 Node.js 命令行工具，可以使用它搭建自己的 GitBook 站点。

除了命令行程序和 web 服务外，GitBook 官方还提供了 跨平台的编辑器，提供直接编辑、发布电子书的功能，
不过实际上仅相当于自启动的 GitBook 控制台程序，并不推荐安装，尤其对于 \*nix 系统而言。

GitBook 网站使用简单，这里就不再赘述了，GitBook 控制台提供强大的本地服务，
自启动的站点能够提供和网站完全一样的编辑服务， 对于不方便登录其网站的用户来说非常方便。
GitBook 甚至提供 GitHub hook，在每一次 push 时自动更新书籍内容。


## 使用 GitBook 控制台程序

GitBook 控制台基于 Node.js，因此需要首先安装 Node.js 的包管理工具 npm，再通过
npm 安装 GitBook：

    npm install -g gitbook-cli

如果你安装过 2.0.0 之前的版本，需要首先卸载 gitbook：

    npm uninstall -g gitbook

安装成功后就可以使用 `gitbook [options] [command]` 来使用：

    build [options] [source_dir] 根据文档目录构建书籍
    serve [options] [source_dir] 构建并且提供书籍的 web 托管
    install [options] [source_dir] 安装 GitBook 插件
    pdf [options] [source_dir] 构建 pdf 格式的电子书
    epub [options] [source_dir] 构建 ePub 格式的电子书
    mobi [options] [source_dir] 构建 mobi 格式的电子书
    init [source_dir]      根据 SUMARRY.md 文件的内容生成相应的目录和文件
    publish [source_dir]   如果已绑定 GitBook.io，该命令可以直接发布书籍
    git:remote [source_dir] [book_id] 为书籍设置远程 git 仓库

    -h, --help     输出命令的使用说明
    -V, --version  输出程序的版本号


## 目录结构

GitBook 目录必备一个 book.json 的文件作为插件配置，正如后缀名所示，是一个 JSON 格式的文件。


## GitBook 插件

GitBook 插件本质上和 Node.js 包一样，因此其安装也分为全局和本地，全局安装命令：
`npm install plugin_name`。本地安装则可以使用 GitBook 自带的命令 `gitbook install` 完成，
将自动安装 book.json 中所配置的插件，不需要任何参数，默认的安装目录是文档目录下的
``./node_modules/`` 目录。因此建议将该目录加入 .gitignore 的忽略列表中。


###配置文件

标准的配置文件如下：

```js
{
    // 输出目录
    // 可以被命令行覆盖
    // 不建议在 book.json 中使用该参数
    "output": null,

    // Generator to use for building
    // Caution: it overrides the value from the command line
    // 不建议在 book.json 中使用该参数
    "generator": "site",

    // 元数据（某些可以从 README 中提取）
    "title": null,
    "description": null,
    "isbn": null,

    // For ebook format, the extension to use for generation (default is detected from output extension)
    // "epub", "pdf", "mobi"
    // 可以被命令行覆盖
    // 不建议在 book.json 中使用该参数
    "extension": null,

    // 插件列表，可以使用 "-name" 删除默认插件
    "plugins": [],

    // 插件的全局设置
    "pluginsConfig": {
        "fontSettings": {
            "theme": "sepia", "night" or "white",
            "family": "serif" or "sans",
            "size": 1 to 4
        }
    },

    // 模板渲染参数
    "variables": {},

    // Links in template (null: default, false: remove, string: new value)
    "links": {
        // Custom links at top of sidebar
        "sidebar": {
            "Custom link name": "https://customlink.com"
        },

        // Sharing links
        "sharing": {
            "google": null,
            "facebook": null,
            "twitter": null,
            "weibo": null,
            "all": null
        }
    },

    // PDF 生成参数
    "pdf": {
        // 每页页脚是否添加页数
        "pageNumbers": false,

        // Font size for the fiel content
        "fontSize": 12,

        // PDF 文档大小
        // 可选参数：[u’a0’, u’a1’, u’a2’, u’a3’, u’a4’, u’a5’, u’a6’, u’b0’, u’b1’, u’b2’, u’b3’, u’b4’, u’b5’, u’b6’, u’legal’, u’letter’]
        "paperSize": "a4",

        // Margin (in pts)
        // 注：72 pts = 1 inch
        "margin": {
            "right": 62,
            "left": 62,
            "top": 36,
            "bottom": 36
        },

        //Header HTML template. Available variables: _PAGENUM_, _TITLE_, _AUTHOR_ and _SECTION_.
        "headerTemplate": null,

        //Footer HTML template. Available variables: _PAGENUM_, _TITLE_, _AUTHOR_ and _SECTION_.
        "footerTemplate": null
    }
}
```

### 官方插件

GitBook 官方提供了以下插件：

| 名称 | 功能描述 |
| ----- | ---- |
| [exercises](https://github.com/GitbookIO/plugin-exercises) | 添加可交互的习题。 |
| [quizzes](https://github.com/GitbookIO/plugin-quizzes) | 添加可交互的选择题 |
| [mathjax](https://github.com/GitbookIO/plugin-mathjax) | 添加数学表达式支持 |
| [mixpanel](https://github.com/GitbookIO/plugin-mixpanel) | Mixpanel 数据追踪服务 |
| [infinitescroll](https://github.com/GitbookIO/gitbook-plugin-infinitescroll) | Infinite Scrolling |

### 第三方插件

| 名称 | 功能描述 |
| ----- | ---- |
| [Google Analytics](https://github.com/GitbookIO/plugin-ga) | Google Analytics 追踪服务 |
| [Disqus](https://github.com/GitbookIO/plugin-disqus) | Disqus 评论插件 |
| [Autocover](https://github.com/GitbookIO/plugin-autocover) | 自动生成书本封面 |
| [Transform annoted quotes to notes](https://github.com/erixtekila/gitbook-plugin-richquotes) | 对 Markdown 引用进行二次渲染 |
| [Send code to console](https://github.com/erixtekila/gitbook-plugin-toconsole) | 在浏览器控制台中执行 JavaScript |
| [Bootstrap JavaScript 插件](https://github.com/mrpotes/gitbook-plugin-bootstrapjs) | 在 GitBook 中使用 [Bootstrap JavaScript 插件](http://getbootstrap.com/javascript) |
| [Piwik Open Analytics](https://github.com/emmanuel-keller/gitbook-plugin-piwik) | Piwik Open Analytics 数据追踪服务 |
| [Heading Anchors](https://github.com/rlmv/gitbook-plugin-anchors) | 标题上添加 GitHub 风格的锚点链接 |
| [JSBin](https://github.com/jcouyang/gitbook-plugin-jsbin) | [在 GitBook 中嵌入 JS 终端](http://jcouyang.gitbooks.io/functional-javascript/content/en/functor_&_monad/functor.html) |
| [GrVis](https://github.com/romanlytkin/gitbook-grvis) | 将 Markdown 文本转为 svg 格式的 Graphviz 图 |
| [PlantUml](https://github.com/romanlytkin/gitbook-plantuml) | 根据 Markdown 内容生成 svg 格式的 UML 图片 |
| [Mermaid](https://github.com/JozoVilcek/gitbook-plugin-mermaid) | 通过 [mermaid](https://github.com/knsv/mermaid) 渲染流程图、示意图 |


### 更多插件

你可以在[官方插件中心](http://plugins.gitbook.com/) 或者 [npm](https://www.npmjs.com/search?q=gitbook-plugin) 寻找更多插件。


### 序列图插件

[JS Sequence Diagram 插件](https://github.com/gmassanek/gitbook-plugin-js-sequence-diagram)
是一个 GitBook 生成序列图的插件，这里以它为例讲解如何安装插件。

首先在配置文件中加入插件名 ``js-sequence-diagram``，不包括 ``gitbook-`` 那部分：

```json
{
    "plugins": ["js-sequence-diagram"]
}
```

然后使用 gitbook 控制台工具安装：``gitbook install``。

JS Sequence Diagram 的基本使用如下：

    ```sequence
    Title: 标题

    A->B: 直线
    B-->C: 虚线
    C->>D: 箭头
    D-->>A: 虚线箭头
    ```

效果：

```sequence
Title: 标题

A->B: 直线
B-->C: 虚线
C->>D: 开箭头
D-->>A: 虚线开箭头
```

JS Sequence Diagram 的更多使用请移步[其文档](http://bramp.github.io/js-sequence-diagrams/)。

