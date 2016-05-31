# JavaScript 中 ``void`` 的正确用法

经常能看到网页中存在 ``<a href="javascript:void(0)">some link</a>`` 这样的写法却不明白什么意思，其实 [StackOverflow 上](http://stackoverflow.com/questions/1291942/what-does-javascriptvoid0-mean)已经有一个不错的解释了。

要了解这段代码的意思，首先需要知道 JavaScript 中 ``void`` 有什么用处。``void`` 是一个很早就存在于 JS 中的操作符（而不是函数），通常的用法是 ``void(0)``（相当于 ``void 0``），返回 ``undefined`` 原始值。

上面强调了是 ``undefined`` 原始值是因为，由于 ``undefined`` 并不是 JS 保留字，因此在旧版本的浏览器中是可以被重新赋值的。使用 ``void(0)`` 就不需要担心 ``undefined`` 被覆盖的情况了。

那么为什么要把 ``href`` 值设置为 ``javascript:void(0)`` 呢？因为浏览器在链接被点击时跳转到后面的 JS 的执行结果的 URL，由于 ``void(0)`` 返回 ``undefined``，是一个错误的返回值，浏览器并不会真的跳转。

另一种常见的替代方法是使用 ``<a href="#">``，不过你在链接的 onclick 事件的最后一顶要记得返回 ``false``，否则页面会滚回页面的顶部。

``<a href="#">`` 的另一个坏处是会跟使用锚点做标记的 SPA 发生冲突，因此一定要注意使用的限制。

不过，对于这种行内按钮的需求我们也可以使用其它解决方案，比如 ``<button type="button"`` 或者 ``<input type="button">``，最后使用 CSS 统一样式即可。


扩展阅读：

- [为什么要使用 ``href="javascript:void(0);"``？](http://www.zhangxinxu.com/wordpress/2013/01/why-use-href-javascript-void0/)
- [void 运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/void)



