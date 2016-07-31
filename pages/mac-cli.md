# 常用 CLI 应用

## HomeBrew & HomeBrew Cask

Homebrew 是 Mac 下最好用的包管理器，推荐所有控制台应用都尽可能使用 brew 管理。

安装 [HomeBrew](http://brew.sh)：

```sh
ruby -e “$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)”
```

Homebrew Cask 是 Homebrew 的插件，作为 Homebrew 在 GUI 应用上的补充。

安装 [HomeBrew Cask](https://github.com/caskroom/homebrew-cask)：

```sh
brew install caskroom/cask/brew-cask
```

检查程序的状态：``brew info <app_name>``

安装了多个版本时切换激活版本：

    brew switch <app_name> <version>

### 安装特定版本

1. 先 tap 历史仓库：``brew tap homebrew/versions``
2. 列出可安装版本：输入 ``brew install homebrew/versions/<app_name>``  后按 TAB 键
3. 安装：``brew install homebrew/versions/<app_name><version>``

或者在 [Homebrew-versions](https://github.com/Homebrew/homebrew-versions) 仓库中找到特定 Formula 的特定版本，然后直接安装：``https://github.com/Homebrew/homebrew-versions``


## zsh & oh-my-zsh!

被称为终极 shell 也没什么问题。Mac 已经预装了 zsh ，只需要安装 `oh-my-zsh!` 即可：

```sh
curl -L https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh | sh
```

或者：

```sh
wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O - | sh
```

Ubuntu 中需要先注册 zsh 可用：

```sh
command -v zsh | sudo tee -a /etc/shells
chsh -s "$(command -v zsh)" "${USER}"
```

切换 sh 之后可能需要重新登录才能生效。


## tree

显示目录的树状图

常用命令 ``tree -L2`` 这样的命令显示最对两级目录内容。


## htop

 一个比 top 更强大、易用的终端任务管理器。


## autojump

在常用目录间快速跳转，命令是 ``j 目录部分名称``，使用 ``jo`` 替代 ``j`` 可以打开目录。

``jo`` 仅支持 Mac 。


## IPython ＋ ptpython ＋ Jupyter notebook

目前最强大的 Python REPL 环境。


## ag

文件查找命令，类似于 `ack`。


## ncdu

磁盘空间占用分析。


## dos2unix

换行符转换工具（Windows下换行符是 ``\r\n``，OS X 是 ``\n``）


## coreutils & advcopy

Unix 命令增强。手动安装即可提供基本功能，不过为了安装 ``advcopy`` 我还是下载了源代码，
打了补丁之后编译安装了一遍：

```shell
wget http://ftp.gnu.org/gnu/coreutils/coreutils-8.23.tar.xz
tar xvJf coreutils-8.23.tar.xz
cd coreutils-8.23/
wget https://raw.githubusercontent.com/felixonmars/aur-mirror/master/advcopy/advcpmv-0.5-8.23.patch
patch -p1 -i advcpmv-0.5-8.23.patch
./configure –-without-gmp –-program-prefix g $(brew diy)
make && make install
brew link coreutils
```

如果 ``./configure ...`` 那条命令执行失败，可以去掉参数重新编译，然后手动添加软链接：

```sh
ln -s src/cp /usr/local/bin/
alias cp="cp -gR"
```

这样就可以将编译出来的可执行文件链接到应用程序目录。


## mpv-player

```
brew tap mpv-player/mpv
brew cask install mpv
```


## git

最流行的分布式代码管理工具。Mac 自带了 git ，不过还是推荐通过 brew 来安装最新的 git 程序和插件。

git 教程：[小猫都能学会的 git 教程](http://www.davidrevoy.com/article193/guide-building-krita-on-linux-for-cats)


## pip & gem & npm & cnpm

pip 以外的所有 Python 应用都应该使用 pip 来安装！

gem 是 Ruby 的包管理器，安装 compass / puppet / vagrant 等 Ruby 应用时离不开 gem。
gem 源也是被干扰得最厉害的，建议使用淘宝镜像：

    gem sources --add https://ruby.taobao.org/ --remove https://rubygems.org/

npm 是 node.js 包管理器，cnpm 是 淘宝提供的 npm 替代品，不过现在速度似乎是官方源更快一些。

    brew install npm    # 会同时安装 node 和 npm

Ubuntu 官方源的 node.js 太古老，可以从 node.js 官方源安装：

    curl -sL https://deb.nodesource.com/setup_5.x | sh -  # setup_5.x 换成 setup_4.x 就可以安装最新的 Node.js 4


## sphinx

Python 社区的文档管理标准，著名的文档托管服务 [ReadTheDocs](http://rtfd.org) 服务就是基于其搭建，
支持 i18n，配合 Python 注释自动生成非常方便。


## LiveReload

[LiveReload](https://github.com/lepture/python-livereload) 是使用 Python 开发的自动刷新工具，
可以配合 livereload Chrome 插件使用。

文档：[en](https://github.com/lepture/python-livereload)



## virtualenv & VirtualEnvWrapper

virtualenv 提供了 Python 虚拟环境的隔离，但是命令复杂，目录的管理也比较混乱，VirtualEnvWrapper 基于它提供了更简易的命令和操作。



## tmux

控制台中的标签页管理工具以及分屏管理工具。


## Vim

目前最常用的编辑器是 Vim，配置主要来自胡淼的 [dot-vim](https://github.com/humiaozuzu/dot-vimrc)，
也有一些自己的特别配置。安装：

```sh
mv ~/.vim ~/.vim.orig
mv ~/.vimrc ~/.vimrc.orig
git clone git://github.com/humiaozuzu/dot-vimrc.git ~/.vim
ln -s ~/.vim/vimrc ~/.vimrc
git clone https://github.com/gmarik/vundle.git ~/.vim/bundle/vundle
vim +BundleClean +BundleInstall +qall
```


## aria2

[aira2](http://aria2.sourceforge.net/) 是 OS X 和 Linux 下通用的下载工具，可以安装在路由器、NAS 等 Linux 机器上。

配合 [YAAW](https://github.com/binux/yaaw) 或者 [webui-arias2](https://github.com/ziahamza/webui-aria2) 非常方便。

附：
* [aria2 配置示例](http://blog.binux.me/2012/12/aria2-examples/)
* [YAAW](http://binux.github.io/yaaw/)
* [Aria2 & YAAW 使用说明](http://aria2c.com/usage.html)


## 终端录制工具 asciinema

[asciinema](https://asciinema.org/) 是一个终端录制及分享工具，支持 Mac 和 Linux 操作系统。Mac 下可以使用 HomeBrew 进行安装：``brew install asciinema``。

asciinema 的使用也非常简单，输入下面的命令将开启一个 tty 开始录制：

```sh
asciinema rec
```

其使用方式和本地的 shell 环境基本一致。按下组合键 ``Ctrl+d`` 可以退出录制环境，并自动上传。

安装 asciinema 时会在本地生成一个独一无二的认证 token，在官网注册好帐号后，输入 ``asciinema auth`` 可以将自己的帐号和 token 相关联，并加以管理。

官网的注册方式是基于 email 的认证，会自动获取 gavatar 头像作为你站内的头像。关联成功后的页面如下：

![asciinema 关联成功](/images/asciinema-reg.png)
