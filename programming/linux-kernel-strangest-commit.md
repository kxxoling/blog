# Linux kernel 代码中最奇怪的提交记录

大部分人都以为 git 只能合并两个提交，比如 Linux kernel 4.10-rc6 版本最近的提交记录的 hash 是 2c5d955，它的父提交记录分别是：

```
2c5d955 Merge branch 'parisc-4.10-3' of ...
|
*- 2ad5d52 parisc: Don't use BITS_PER_LONG in use ...
*- 53cd1ad Merge branch 'i2c/for-current' of ...
```

实际上，git 也支持“章鱼合并”（octopus merge，意指多父记录合并），对于大部分开发者，尤其是小项目的开发者来说，这一功能非常陌生：同时合并三四个提交不会让人糊涂吗？对于 Linux kernel 维护者来说，30 个连续的合并记录可能比一次合并 30 个提交更容易让人糊涂，这 30 个合并都是无冲突合并时尤其如此。

章鱼合并在 Linux kernel 的提交记录中可能比你想想中更为频繁，在 649,306 个提交记录中，包含了 46,930（7.2%）个合并记录，而合并记录的 3.3%（1,549 个）是章鱼合并。（以上数据截至提交 566cf87。）

```
$ git log --oneline | wc -l
   649306
$ git log --oneline --merges | wc -l
   46930
$ git log --oneline --min-parents=3 | wc -l
    1549
```

相比之下，Rails 提交记录中 20%（12,401 / 63,111）是合并记录，而其中没有一个是章鱼合并。Rails 作为流行项目的代表尤其如此，我认为可以得出大部分 git 用户并不知道其“章鱼合并”这一特性的结论。

那么问题来了，Linux kernel 源码库中最大的章鱼合并有多大？

```
$ (git log --min-parents=2 --pretty='format:%h %P' | \
  ruby -ne '/^(\w+) (.*)$/ =~ $_; puts "#{$2.split.count} #{$1}"' | \
  sort -n | \
  tail -1)
66 2cde51f
```

答案是 66！

```
$ git log -1 2cde51f
commit 2cde51fbd0f310c8a2c5f977e665c0ac3945b46d
Merge: 7471c5c c097d5f 74c375c 04c3a85 5095f55 4f53477
2f54d2a 56d37d8 192043c f467a0f bbe5803 3990c51 d754fa9
516ea4b 69ae848 25c1a63 f52c919 111bd7b aafa85e dd407a3
71467e4 0f7f3d1 8778ac6 0406a40 308a0f3 2650bc4 8cb7a36
323702b ef74940 3cec159 72aa62b 328089a 11db0da e1771bc
f60e547 a010ff6 5e81543 58381da 626bcac 38136bd 06b2bd2
8c5178f 8e6ad35 008ef94 f58c4fc4 2309d67 5c15371 b65ab73
26090a8 9ea6fbc 2c48643 1769267 f3f9a60 f25cf34 3f30026
fbbf7fe c3e8494 e40e0b5 50c9697 6358711 0112b62 a0a0591
b888edb d44008b 9a199b8 784cbf8
Author: Mark Brown <[email redacted for privacy]>
Date:   Thu Jan 2 13:01:55 2014 +0000

    Merge remote-tracking branches [65 remote branch names]
```

这导致了一些 git 记录可视化工具的崩溃，Linus Torvalds [非常生气](http://marc.info/?l=linux-kernel&m=139033182525831)：

> 我从 Takashi 那里拉取了 sound 相关的更新，当然也看到了你那个有 66 个父记录的合并。
>
> ……
>
> 拉取下来是没有问题了，但你要注意一些平衡，“章鱼合并是不错”，然而“上帝啊，这根本不是章鱼，这是魔神克苏鲁！”

总结：Linux kernel 源码库中有一些奇怪的提交记录，其中包括这个 66 父记录的章鱼合并，它包含了 22,445,760 行 diff 信息。

翻译节选自：[The Biggest and Weirdest Commits in Linux Kernel Git History](https://www.destroyallsoftware.com/blog/2017/the-biggest-and-weirdest-commits-in-linux-kernel-git-history)

