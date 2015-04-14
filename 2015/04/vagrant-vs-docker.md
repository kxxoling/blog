# Vagrant 与 Docker 的异同

早在使用 Docker 之前就听说与其前辈 Vagrant 之前的竞争与替代，但是一直没能够
真正认识到两者之间的区别和优缺点，这次腾出时间使用 Vagrant 终于对它们之间的优缺点
有了更深的认识。

埋头苦干一直不是我的风格，所以在比较 Vagrant 安装、下载期间细细阅读了多篇相关文章，
其中当然少不了 Vagrant 和 Docker 作者在 [StackOverflow]()
上的亲自解惑（[中文](http://linux.cn/article-3840-1-rss.html)）。


## 总结

很难认为 Vagrant 和 Docker 是一个层次上的东西，但是两者都在部署开发环境这一目的上
应用广泛。与 Vagrant 虚拟化等级相类似的是 Boot2Docker，都会在宿主机上建立一层虚拟机，
当然本来就设计于虚拟机管理的 Vagrant 在这一点上的强大和灵活性肯定不是 后者可比的，

Docker 真正的核心依赖于 Linux 内核的 xxx 模块，Boot2Docker 存在的目的就在于为 Docker
提供 Linux 的核心环境，换句话说，在 Linux 操作系统上直接运行 Docker 并不依赖 B2G。
相比之下，依赖于第三方虚拟机的 Vagrant 要庞大地多。


## Mac 下结合 Vagrant 和 Docker

由于在 Mac 中使用 Docker 需要 Boot2Docker，而 Boot2Docker 本身的功能孱弱导致 Docker
和宿主机之间的数据交换非常不便。考虑到 Vagrant 对资源共享的灵活性，以及 Docker 与其载体
之间的不完全隔离，使用 Vagrant 为 Docker 提供一个轻量的运行环境会是个不错的选择方案。
