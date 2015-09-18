# IHaskell & notebook

[IHaskell] 是一个基于 IPython 的 Haskell REPL 环境，支持多行输入以及 Jupyter Notebook
扩展，以及 plot 等众多高级功能，能够大幅提高本地调试效率。相信每一个 Haskell
开发者都会喜欢上它。


## 安装

IHaskell 提供了 Ubuntu 和 Mac OS X 下的[安装脚本](https://github.com/gibiansky/IHaskell#install-using-installation-scripts)，
其它平台可以手动安装 IHaskell 的依赖和 IHaskell 本身：

### 安装依赖

IHaskell 是一个基于 IPython 和 Jupyter Notebook 的 Haskell REPL 环境，根据 Jupyter
接口规范，通过 ZeroMQ 和 Jupyter Notebook 交互。
因此在安装 IHaskell 之前首先需要安装 IPython、Jupyter Notebook、ZeroMQ 以及 Haskell
相关工具。

### 安装 IPython 和 Jupyter Notebook

推荐使用 pip 包管理工具安装两者，当然也可以使用 easy_install，在 Linux 环境下如果没有
easy_install 需要首先安装 Python 相关开发者工具（如 ``apt-get install python-setuptools ``）。

```sh
pip install ipython jupyter
```

### 安装 ZeroMQ

[ZeroMQ] 是一个类 Unix 系统下的异步通信工具安装方式：

Mac OS X： ``brew install zeromq --universal``

Ubuntu： ``sudo apt-get install libzmq3-dev``

通过源代码：

```sh
git clone git@github.com:zeromq/zeromq4-x.git libzmq && cd libzmq
./autogen.sh && ./configure && make
sudo make install
sudo ldconfig
```

### 安装 Haskell 及相关工具

安装 Haskell 及其包管理工具 cabal、ghc：

安装其它必要库：

```sh
cabal install happy cpphs
```

### 安装 IHaskell

使用 cabal 安装： ``cabal install ihaskell --reorder-goals``

或者下载安装最新版本：

```sh
git clone http://www.github.com/gibiansky/IHaskell
cd IHaskell
./build.sh ihaskell # Build and install IHaskell
```


## 运行 IHaskell 和 IHaskell Notebook

启动 IHaskell REPL 环境： ``ipython console --kernel haskell``

启动 IHaskell Notebook 前，首先需要在 Jupyter Notebook 中注册 IHaskell Kernel：
``ihaskell install``，然后运行 ``jupyter notebook`` 启动 Jupyter Notebook ，并新建一个
IHaskell kernel 的 Notebook。


## 高级功能

这里有一篇 [IHaskell Notebook 的在线介绍](http://nbviewer.ipython.org/github/gibiansky/IHaskell/blob/master/notebooks/IHaskell.ipynb)，
内容从入门到魔术命令，再到网络请求，再到图表输出都有涉及。


## 常见问题

### IHaskell 启动反应很慢

IHaskell REPL 的启动和反应都很慢，正在查找原因……

### 有没有 IDE 推荐？

可以试试 [Leksah]。


[IHaskell]: https://github.com/gibiansky/IHaskell
[Leksah]: http://leksah.org/

