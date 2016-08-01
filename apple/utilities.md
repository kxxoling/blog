# macOS 独有的一些命令行程序

## 内置程序

### open

顾名思义，``open`` 是一个打开文件或目录的命令，当然也包括程序：

- 使用首选视频播放器打开 ``xxx.mp4``：``open xxx.mp4``
- 打开主目录：``open ~``
- 打开 Safari：``open /Applications/Safari.app/``


### pbcopy 和 pbpaste

pbcopy 和 pbpaste 是读取及写入系统剪贴板的命令，支持 Unix 管道操作，也就是说你可以 ``ls ~ | pbcopy`` 或者 ``pbcopy < blog.txt``。


### mdfind

mdfind 是 macOS 中 find 程序，由 mds 进程提供索引。


### screencapture

获取桌面截图。编写监控脚本的时候可能用得到。


### launchctl

launchd 是 macOS 中非常重要的程序，相当于 Linux 世界的 systemctl，launchctl 则提供了和 launchd 的交互。

常见用法：

- ``launchctl list``
- ``launchctl load /path/to/your/program.plist``

Launchd 脚本通常位于以下位置：

```
~/Library/LaunchAgents    
/Library/LaunchAgents          
/Library/LaunchDaemons
/System/Library/LaunchAgents
/System/Library/LaunchDaemons
```

### say

强大的语音阅读程序。

阅读一段话：``say "Never trust a computer you can't lift."`` 或者 ``say "你好，世界"``，当然，前提是你已经安装了对应语音的语音工具。

也可以将文本转化为音频：``say -f mynovel.txt -o myaudiobook.aiff``。


### 磁盘工具 diskutil

相当于 Linux 下的 du？


### 图片编辑工具 sips

相当于 Linux 中的 convert。

简单地缩放图片：``sips -z 100 200 image.png``

等比缩放：``sips --resampleHeight 100 image.png``。


## 非内置

### HomeBrew & HomeBrew Cask

相当于 Linux 各发行版中的包管理工具。

安装 HomeBrew：``/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"``

再安装 Cask：``brew tap caskroom/cask``。
