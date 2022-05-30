# 使用 Homebrew

## 如何贡献

### 报告 bug

- 运行 ``brew update`` 两次
- 运行并观察 ``brew docter`` 的检测结果
- 对照[常见问题列表](http://docs.brew.sh/Troubleshooting.html)
- 在项目库创建一个新 issue。

### 更新 formula

- 检查 PR 列表，查看是否已有重复 PR
- 运行 ``brew bump-formula-pr --strict foo --url=...`` 并至少提供 ``--sha256=...`` 或 ``--tag=...``  或 ``--revision=...``。

### 创建新 formula

- 运行 ``brew create $URL`` 来创建
- 从源安装：``brew install --build-from-source foo``
- 审查新创建的 formula：``brew audit --new-formula foo``
- 提交到仓库：``git commit -m "foo 2.3.4 (new formula)"``。
- 创建新 PR 并等待合并。

### 修正 formula 信息

- ``brew edit foo`` 来创建编辑
- 先不用管 ``bottle``
- ``brew uninstall --force foo``、``brew install --build-from-source foo``、``brew test foo`` 以及 ``brew audit --strict foo``
- 提交修改：``git commit -m "foo: fix <insert details>"``
- 创建新 PR 并修复相关测试。

参考：[Contributing to Homebrew](https://github.com/Homebrew/homebrew-core/blob/master/CONTRIBUTING.md)

