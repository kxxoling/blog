# Vue.js 学习笔记

Vue.js 通常简称 Vue，是一个介于 Angular 和 Reactjs 之间的前端开发框架和库。

- 官方文档：[英文](http://vuejs.org/) [中文](http://cn.vuejs.org/)
- 官方索引：[awesome-vue](https://github.com/vuejs/awesome-vue)
- 项目源代码：[GitHub](https://github.com/vuejs/vue)
- 开发工具：
	- 命令行工具 [vue-cli](https://github.com/vuejs/vue-cli) （面向组件开放的项目都建议使用这个官方工具初始化）
	- Webpack 插件 [vue-loader](https://github.com/vuejs/vue-loader) （官方推荐）
	- Browserify 插件 [vueify](https://github.com/vuejs/vueify)
	- Chrome 插件 [vue-devtools](https://github.com/vuejs/vue-devtools)
- xhr
	- [vue-resource] （文档和代码都比较简单 ）
- UI 库：
	- [vue-strap] （不依赖 BootStrap 的 JS 和 jQurey，但是仍需要 BootStrap 的 CSS。）
	- [vue-antd] 蚂蚁金服 ant design 的 Vue 实现（不够完善，但是看起来比 [vue-strap] 好看些。
- 路由
	- [vue-router](https://github.com/vuejs/vue-router)（官方 router）
[lucius.cao@quesbook.com](mailto:lucius.cao@quesbook.com)

另外，我根据 Vue.js 的官方 demo 以及其它 demo 做了一个在线展示：[demo](http://gh.windrunner.info/vue-demos/)
（[source on GitHub](https://github.com/kxxoling/vue-demos)）


## 基本概念

入前面所说，Vue 的定位介于 Angular 和 Reactjs，既可以手动绑定 DOM 元素，也可以定义组件进行模块化开发。

### 双向绑定

Vue 作为一个 MVVM 框架，双向绑定是其最基本的特性。

数据的绑定、类／状态的绑定、样式绑定

动态数据的绑定（``computed``）


### 组件（核心）

#### template 标签

#### 插槽 slot
对于一个灵活的组件来说，可替换的组件非常重要。Vue 中提供了一个叫做 slot 的概念，使用 ``slot`` 标签作为内容插槽的占位符。

定义：

```html
<template>
  <div class="modal">
    <div class="modal-header">
      <slot name="header"></slot>
    </div>
    <div class="modal-content">
      <slot name="content"></slot>
    </div>
    <div class="modal-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

使用：

```html
<modal>
	<template slot="header"><!-- 声明替换 template 中的 header 槽 -->
		<h2>This is header</h2>
	</template>
	<div slot="body"><!-- template 标签不是必须的，可以指定槽元素 -->
		<p>Content body.</p>
	</div>
	<template slot="footer">
		<div>Footer</div>
	</template>
</modal>
```

#### 片段实例（）

下面几种情况会让实例变成一个片断实例：

- 模板包含多个顶级元素。
- 模板只包含普通文本。
- 模板只包含其它组件（其它组件可能是一个片段实例）。
- 模板只包含一个元素指令，如 <partial> 或 vue-router 的 <router-view>。
- 模板根节点有一个流程控制指令，如 v-if 或 v-for。

片段实例的问题在于，可能无法找到唯一对应的顶级元素，因此无法正常绑定 ``$el``。

大多数情况下不建议使用片段实例。

#### 递归组件

和函数的递归类似，需要组件名和跳出条件避免死循环。

#### 异步组件

可以理解为 templateUrl 的替代品。


### 指令

指令的作用和组件类似，相当于轻量级的组件。


### MixIn

跟 Python 等语言的 MixIn 很像。

### 事件与组件的生命周期

### 过渡动画

CSS 过渡和 JS 过渡

#### CSS 过渡

CSS 动画的原理是在触发创建和销毁事件时修改元素的类名，浏览器察觉样式变换后执行 CSS3 动画。

```html
<div v-if="show" transition="expand">hello</div>
<style>
/* 必需 */
.expand-transition {
  transition: all .3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}

/* .expand-enter 定义进入的开始状态 */
/* .expand-leave 定义离开的结束状态 */
.expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
</style>
```

过渡类名：

类名的添加和切换取决于 transition 特性的值。比如 transition="fade"，会有三个 CSS 类名：

- .fade-transition 始终保留在元素上。
- .fade-enter 定义进入过渡的开始状态。只应用一帧然后立即删除。
- .fade-leave 定义离开过渡的结束状态。在离开过渡开始时生效，在它结束后删除。

transition 特性没有值时默认类名是 .v-transition, .v-enter 和 .v-leave。

#### 配合 Animate.css 使用

引入 Animate.css 后注册 bounce 效果：

```js
Vue.transition('bounce', {
  enterClass: 'bounceInLeft',
  leaveClass: 'bounceOutRight'
})
```

就可以像上面那样使用了。


#### JS 过渡

### 过滤器

对数据进行额外的处理，使用管道符 ``|`` 分隔数据和过滤器，可以同时使用多个过滤器。

#### 自定义过滤器

过滤器通常是单参数函数，可以使用 ``Vue.filter(filterName, filterFunc)`` 方法全局注册。

#### 双向过滤器


## 自定义开发

### 自定义指令

### 插件开发


## 增强代码的可复用性

### 规范的命名约定

Vue 默认会自动转换 camelCase 和 PascalCase 的组件名为 kebab-case，以支持 HTML tag。

### 组件

组件应当定义好清晰的公开接口，允许外部环境通过 props 传递数据给组件，允许组件触发外部事件，使用 slot 提供可插拔的替换内容。


### 默认事件
[link](http://vuejs.org/api/#Options_\/_Lifecycle_Hooks)

1. init 组件实例初始化完毕，并未开始设置数据监控和事件、监控
2. created 数据监控、计算熟悉、方法、事件监控已就绪，DOM 未就绪，$el 尚不存在
3. beforeCompile 即将开始构建
4. compiled 构建已完成，指令已链接，$el 和 DOM 尚未就绪
5. ready $el 插入文档
6. attached
7. detached
8. beforeDestroy Vue 实例即将销毁
9. destroyed Vue 实例销毁完成

![图解 Vue 生命周期](/images/javascript/vue-lifecycle.png)

### 事件派发


## 常见问题

### Vue.js 和其它框架对比如何？该如何选择框架？

官方文档中[《对比其它框架》](http://cn.vuejs.org/guide/comparison.html)已经讲得很清楚了，也挺客观。

### Vue 项目应当怎样组织文件结构？

可以使用 vue-cli 工具自动生成：

```
├── src
│   ├── App.vue
│   ├── assets
│   │   └── favicon.ico
│   ├── components
│   │   └── HelloWorld.vue
│   ├── libs
│   │   └── xxx.coffee
│   ├── entry.js
│   ├── styles
│   │   └── base.scss
│   └── views
│      └── Hello.vue
├── test
│   └── unit
│       ├── Hello.spec.js
│       └── index.js
├── webpack.base.conf.js
├── webpack.dev.conf.js
├── webpack.prod.conf.js
├── package.json
├── index.html
├── README.md
├── dist
    ├── 构建结果
```

### 是否会提供类似 templateURL 的支持？

[官方的回答](http://vuejs.org/2015/10/28/why-no-template-url/)是不会考虑。
（[中文](https://segmentfault.com/a/1190000004174940) [中文2](http://www.jianshu.com/p/7f7f050c9edf)）

不过 Vue 提供了另一个相似的功能，也就是异步加载组件。

### 用做 SPA 的时候如何不重复渲染被隐藏的组件？

可以考虑使用 ``v-show`` 指令来代替 ``v-if``，可以使用 ``keep-alive`` 指令。
较新版本的 vue-loader 也提供了 ``keep-alive`` 的支持。

### 组件中数据同步问题？

虽然 Vue 提供了 ``:data.sync='obj'`` 这样的组件间数据双向绑定的写法，但对于复杂关联的数据，推荐使用
``$dispatch()`` 向上派发和 ``$broadcast()`` 向下广播事件。

### 父子组件间数据交换的最佳实践？

``$root``
消息
props
slot


## webpack 常见问题

### 引入未发布在 npm 中的第三方库

webpack 提供了 [expose-loader]：

```js
require('expose?本地名!../vendors/第三方库.js')
```

由于第三方库通常是以 JS 全局变量的形式进行注册，而 webpack 默认禁止这种行为，因此引入后需要注册才能使用。

[vue-resource]: https://github.com/vuejs/vue-resource
[vue-strap]: http://yuche.github.io/vue-strap/
[vue-antd]: https://github.com/okoala/vue-antd


