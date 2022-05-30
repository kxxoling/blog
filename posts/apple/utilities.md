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


## 实用命令

### 开启 Safari 开发者模式和 web 检查器

```
defaults write com.apple.Safari IncludeInternalDebugMenu -bool true && \
defaults write com.apple.Safari IncludeDevelopMenu -bool true && \
defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true && \
defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled -bool true && \
defaults write NSGlobalDomain WebKitDeveloperExtras -bool true
```

### 无法连接 Time Machine 时禁止/启动本地备份

```
sudo tmutil disablelocal # 禁止

sudo tmutil enablelocal # 启动
```

### 在终端安装 Command Line Tools

```
xcode-select --install
```

### 卸载无用的（iOS）模拟器

先列出来：``xcrun simctl list``

卸载无用的模拟器：``xcrun simctl delete unavailable``


### 推出所有挂载设备

还是 AppleScript 脚本：``osascript -e 'tell application "Finder" to eject (every disk whose ejectable is true)'``

建议添加到 .bashrc/.zshrc 中。

### 设置 Dock 的自动隐藏时间

```
defaults write com.apple.Dock autohide-delay -float 1000 && \
killall Dock
```

### 目录相关

- 隐藏文件夹：``chflags hidden /path/to/folder/``
- 取消文件夹的隐藏：``chflags unhidden /path/to/folder/``
- 显示所有文件扩展名：``defaults write NSGlobalDomain AppleShowAllExtensions -bool true``
- 显示隐藏的文件和目录：``defaults write com.apple.finder AppleShowAllFiles true``
- 取消隐藏文件的显示：``defaults write com.apple.finder AppleShowAllFiles false``
- 在标题栏显示全部路径：``defaults write com.apple.finder _FXShowPosixPathInTitle -bool true``
- ``CMD-q`` 退出 Finder 程序：``defaults write com.apple.finder QuitMenuItem -bool true && \
killall Finder``

### 元文件（``.DS_Store``等）相关

- 禁止向 USB 设备中写入元文件：``defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true``

### 获取打开的 Finder 位置

```
echo "$(osascript -e 'tell app "Finder" to POSIX path of (insertion location as alias)')"
```

### 键盘防连击间隔

并没有测试过：``defaults write NSGlobalDomain KeyRepeat -int 0.02``。


### 防止系统休眠

``caffeinate -u -t 3600``

### 查看电源设置

``sudo pmset -g``

### 设置系统自动休眠间隔

```
sudo pmset sleep 30
```

或者设置显示器休眠

```
sudo pmset displaysleep 15
```

或者禁止系统休眠

```
sudo pmset  -setcomputersleep Never
```


### 系统死机（freeze）时自动重启

``sudo systemsetup -setrestartfreeze on``（未测试，谨慎使用）

### 启用或禁用 ssh 远程登录

```
# 启用
sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist

# 禁用
sudo launchctl unload -w /System/Library/LaunchDaemons/ssh.plist
```

### 端口状况查询

```
sudo lsof -i :80
```

### 显示当前网络 SSID

```
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'
```

### 获取当前 IP 地址

```
ipconfig getifaddr en0defaults read /Library/Preferences/SystemConfiguration/com.apple.airport.preferences | grep LastConnected -A 7
```

### 显示无线网络密码

```
security find-generic-password -D "AirPort network password" -a "SSID" -gw
```


### 安全删除

命令是 ``srm``，使用和 ``rm`` 基本一样。例如：

```
srm /path/to/file
```

### 显示版本信息

```
$ sw_vers
ProductName:	Mac OS X
ProductVersion:	10.11.6
BuildVersion:	15G31
```

### 清空内存缓存

``sudo purge``

显示内存统计 ``vm_state``


### 截图

#### 取出截图中的阴影

```
defaults write com.apple.screencapture disable-shadow -bool true && \
killall SystemUIServer
```

#### 设置截图自动命名头部

并不会修改时间部分：

```
defaults write com.apple.screencapture name "Example name" && \
killall SystemUIServer
```

### 更新软件

```
sudo softwareupdate -ia
```

### Spotlight 索引

```
# 禁止索引某个目录
mdutil -i off -d /path/to/volume

# 启用（默认行为）
mdutil -i on /path/to/volume
```

### Spotlight 索引相关

#### 重建 Spotlight 索引

```
mdutil -E /path/to/volume
```

#### 使用 Spotlight 进行搜索

```
mdfind -name 'searchterm'
```

#### 显示 Spotlight 索引元数据

```
mdls /path/to/file
```


参考：

- [herrbischoff/awesome-osx-command-line](https://github.com/herrbischoff/awesome-osx-command-line)

