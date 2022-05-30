# IPython 与 jupyter 相关概念介绍

## IPython

IPython 通常指的是一个 Python REPL shell。提供了远比 Python shell 强大的 shell 环境。
该名词本事即 Iteractive Python shell 的缩写。


## IPython notebook

IPython notebook 是一个基于 IPython REPL 的 web 应用，安装 IPython 后在终端输入 ``ipython notebook``
即可启动服务。

IPython 运行结果可以单独保存，格式为 .ipynb 。现 GitHub 已提供 IPython notebook 的在线预览。


## jupyter 和 jupyter notebook

jupyter 是把 IPython 和 Python 解释器剥离后的产物，将逐渐替代 IPython 独立发行。jupyter 可以和 Python 之外的
程序结合，提供新的、强大的服务。比如 Ruby REPL 环境 IRuby 和 Julia REPL 环境 IJulia。

相对的 jypyter 也提供 jupyter notebook。


## nbviewer

nbviewer 是 （jupyter） notebook viewer 的缩写，用于渲染 .ipynb 文件，并支持 HTML 和 PDF 输出。


## jupyterhub

类似于 git 和 GitHub，或者 docker 与 Docker Hub，jupyterhub 提供 jupyter 文档 托管服务，
相对于 GitHub 的 jupyter 支持，jupyterhub 提供更多的交互支持。

