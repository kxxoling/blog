# 表单提交中 ``Content-Type`` 该选什么？

``multipart/form-data`` 与 ``application/x-www-form-urlencoded`` 是表单请求 header 中最常见的两种 ``Content-Type`` 值了，StackOverflow 上[就有一个关于这两者区别的提问。](http://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data)

**TLDR：简单来说，除非你需要上传文件，否则都优先使用 ``application/x-www-form-urlencoded``。**

这两个 MIME 类型是所有标准客户代理（通常是浏览器）都支持的 ``Content-Type`` 值，根据传送文件大小的不同，两者的效率大相径庭。

``application/x-www-form-urlencoded`` 在传送数据时实际上是向后端传送以 ``&`` 符号分隔的名-值对，名和值使用 ``=`` 进行分隔。例如：

    var1=value1&var2=value2
    
[标准规格文档](http://www.w3.org/TR/html401/interact/forms.html)中是这样说的：

> [Reserved and] non-alphanumeric characters are replaced by `%HH', a percent sign and two hexadecimal digits representing the ASCII code of the character

也就是说，对于 1 字节非字母和数字数据，都需要占用 3 字节的空间，对于大型二进制文件来说这是非常没有效率的。

这正是 ``multipart/form-data`` 存在的原因，它会将所有“名-值”对都当作 MIME 的一部分传送，每个部分间以特殊的分隔符隔开，每个部分都有自己的 MIME 信息，比如 ``Content-Type``，以及 ``Content-Disposition`` 作为每个部分“值”对应的“名”。在每个部分的 MIME 信息中还可以指定编解码类型以节省带宽，可以选择 base64 或者纯二进制。

因此回答者不推荐优先使用 ``multipart/form-data``，他认为 web 表单数据内容大多数情况下以字母和数字为主，将表单内容放入 MIME header 中带来的负面影响要高于编解码效率上的好处。不过在中文环境下，大多数表单的内容都是 Unicode 字符为主，优先使用 ``multipart/form-data`` 也许会更好。
