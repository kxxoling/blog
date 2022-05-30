# git 简单配置

在使用 git 之前最好先配置一下，会给你带来更好的使用体验。
你可以使用 git 命令对 git 进行配置，也可以手动编辑 git 配置文件，这个文件通常是 ``~/.gitconfig``。

在正式使用 git 之前，你通常需要配置自己的身份——包括自己的名字和邮箱，这会在 git 的提交记录中显示： 

```shell
git config --global user.name "Kane Blueriver"
git config --global user.email "kxxoling@gmail.com"
```

配置成功后，你将会发现 git 配置文件中多出了这几行：

```ini
[user]
name = kxxoling
email = kxxoling@gmail.com
```

如果你和我一样使用 OS X 操作系统，那么最好输入下面这行命令：

```
git config --global credential.helper osxkeychain # 设置 Mac KeyChain 工具来提交 git 验证信息
```

会在 git 配置文件添加两行：

```ini
[credential]
helper = osxkeychain
```

这会为 git 提供 OS X 的密钥链权限，这样就避免每次都需要重复输入帐号密码了。

如果你不是使用密码登录（HTTP/HTTPS 协议），而是 RSA 密钥认证（SSH 协议），或者需要为特定仓库指定登录密钥，可以在 ``ssh 配置文件``中指定：

```
Host github.com
 IdentityFile ~/.ssh/github_kxxoling_rsa
 User kxxoling
```

这样在使用 ssh 协议连接指定仓库时就会根据 ssh 的配置选择指定密钥进行身份认证了。

