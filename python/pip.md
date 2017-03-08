# pip 与 Pipfile

## pip 是什么？

pip 是一个 Python 包也是 Python 推荐的包管理程序，可以用于安装和管理 Python 包，Python 2.7.9+ 版本中已经自带了 pip 包。针对 Python2 和 3，pip 分别提供了 ``pip`` 和 ``pip3`` 两个命令。

## pip 常用命令

基本用法：``pip install SomePackage``，等效于 ``python -m pip install SomePackage``。

明确指定版本号：``pip install SomePackage==1.0.0``。

指定最小版本号：``pip install SomePackge>=1.0.0``。

指定版本号区间：``pip install SomePackage>=1.0.0,<2.0.0``。

pip 也支持直接从文件读取包列表以便批量安装，通常命名为 ``requirements.txt``，可以使用 ``pip install -r requirements.txt`` 来安装。``requirements.txt`` 文件内容是如下的扁平格式：

```
SomePackage1
SomePackge2>=1.0.0
SomePackage3>=1.0.0,<2.0.0
```

## ``Pipfile`` 与 ``Pipfile.lock``

``Pipfile`` 与 ``Pipfile.lock`` 是社区拟定的依赖管理文件，用于替代过于简陋的 ``requirements.txt`` 文件。

###  基本理念

-  ``Pipfile`` 文件是 [TOML](https://github.com/toml-lang/toml) 格式而不是 ``requirements.txt`` 这样的纯文本。
- 一个项目对应一个 ``Pipfile``，支持开发环境与正式环境区分。默认提供 ``default`` 和 ``development`` 区分。
- 提供版本锁支持，存为 ``Pipfile.lock``。

示例：

```toml
[[source]]
url = 'https://pypi.python.org/simple'
verify_ssl = true

[requires]
python_version = '2.7'

[packages]
requests = { extras = ['socks'] }
Django = '>1.10'
pinax = { git = 'git://github.com/pinax/pinax.git', ref = '1.4', editable = true }

[dev-packages]
nose = '*'
```

### PEP 508 支持

可以设置支持的运行环境：

```toml
[requires]
python_full_version = '3.6.0b1'

platform = 'windows'
```

### pip 支持

[pip](https://pip.pypa.io/en/stable/) 提供了 ``-p``/``--pipfile`` 参数用于安装 ``Pipfile``。

### ``Pipfile.lock``

``Pipfile.lock`` 是根据 ``Pipfile`` 和当前环境自动生成的 JSON 格式的依赖文件，**任何情况下都不要手动修改该文件！**

生成命令：``pip freeze -p Pipfile``。

或者：``pip freeze -p different_pipfile``，将会生成 ``different_pipfile.lock``。

## pipenv

[pipenv](https://github.com/kennethreitz/pipenv) 是 ``Pipfile`` 主要倡导者、requests 作者 Kenneth Reitz 的一个库，有机的结合了 Pipfile 、pip 和 virtualenv。

### 主要特性

- 根据 ``Pipfile`` 自动寻找项目根目录。
- 如果不存在，可以自动生成 ``Pipfile`` 和 ``Pipfile.lock``。
- 自动在项目目录的 ``.venv`` 目录创建虚拟环境。（暂时需要设置 ``export PIPENV_VENV_IN_PROJECT=1``）
- 自动管理 ``Pipfile`` 新安装和删除的包。
- 自动更新 pip。

### 基本命令

- ``pipenv --where``：寻找项目根目录。
- ``pipenv install``：安装 ``Pipfile`` 中所列的所有包。
- ``pipenv install --dev``：安装 ``Pipfile`` 中 dev 环境所列的所有包。
- ``pipenv uninstall``：卸载所有包。
- ``pipenv install pytest --dev``：在 ``dev`` 环境中安装 pytest 包。
- ``pipenv lock``：确认 ``Pipfile`` 中所有包已安装，并根据安装版本生成 ``Pipfile.lock``。
- ``pipenv shell``：应用虚拟环境。

最后，``Pipfile`` 和 ``pipenv`` 仍然是实验性特性，可能存在不稳定性和较大变动，注意关注最新变化！。

参考：

- [pypa/pipfile](https://github.com/pypa/pipfile)
- [Announcing pipenv](https://www.kennethreitz.org/essays/announcing-pipenv) by Kenneth Reitz
