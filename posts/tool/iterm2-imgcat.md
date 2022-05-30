# 在 iTerm2 中查看图片

iTerm 2 2.9 版本带来了一个很重要的新命令──``imgcat``──类似于 ``cat`` 命令之于文本文件，``imgcat`` 提供了在终端查看图片的功能。使用方法很简单：``imgcat /path/to/your/image.jpg``。该命令支持常见的图片格式，但是展示较大尺寸的 gif 动图时会引起明显的卡顿。

不过，在 Python 中如何调用该功能呢？你也许会想到 ``shutils``，但是很明显这不会是我想要的！偶然的机会，我发现启动 Celery 命令时会展示项目的 logo，于是我猜想它通过某种方式调用了 iTerm2 的 API。经过一番调查发现，该功能实现在 ``celery/utils/term.py`` 文件中，代码提取出来如下：


```py
import os
import base64
import codecs


TERM = os.environ.get('TERM')
TERM_IS_SCREEN = TERM and TERM.startswith('screen')

_IMG_PRE = '\033Ptmux;\033\033]' if TERM_IS_SCREEN else '\033]'
_IMG_POST = '\a\033\\' if TERM_IS_SCREEN else '\a'


def _read_as_base64(path):
    with codecs.open(path, mode='rb') as fh:
        return base64.b64encode(fh.read())


def imgcat(path, inline=1, preserve_aspect_ratio=0, **kwargs):
    return '\n%s1337;File=inline=%d;preserveAspectRatio=%d:%s%s' % (
        _IMG_PRE, inline, preserve_aspect_ratio,
        _read_as_base64(path), _IMG_POST)
        
print imgcat('/path/to/your/image.jpg')
```

简单解释一下：

1. 这里 ``TERM_IS_SCREEN`` 是用来判断现在调用这段代码时正处于 Tmux/Screen 会话还是原生 iTerm2 tty 中，在 Tmux 会话中需要额外包含特定数据。

2. 使用 ``codecs`` 库打开图片文件。

3. ``base64`` 库对图片数据进行了 base64 编码。

4. 将 base64 编码后的图片数据和特定元数据混合并输出到标准输出流中。


不过我并没有找到这样做可以成功的原理，猜测只是对 iTerm2 内置的 ``imgcat`` 脚本翻译成了 Python。（内置 ``imgcat`` 命令的位置在 ``~/.iterm2/imgcat``，熟悉 shell 的可以自己看看，代码很简单。）

顺便在网上还找到了[另一个实现](https://github.com/fferri/py-imgcat/)，还提供了长宽限制：

```py
import os
from base64 import b64encode
from sys import stdout

def imgcat(data, width='auto', height='auto', preserveAspectRatio=False, inline=True, filename=''):
    '''
    The width and height are given as a number followed by a unit, or the word "auto".
        N: N character cells.
        Npx: N pixels.
        N%: N percent of the session's width or height.
        auto: The image's inherent size will be used to determine an appropriate dimension.
    '''

    buf = bytes()
    enc = 'utf-8'

    is_tmux = os.environ['TERM'].startswith('screen')

    # OSC
    buf += b'\033'
    if is_tmux: buf += b'Ptmux;\033\033'
    buf += b']'

    buf += b'1337;File='

    if filename:
        buf += b'name='
        buf += b64encode(filename.encode(enc))

    buf += b';size=%d' % len(data)
    buf += b';inline=%d' % int(inline)
    buf += b';width=%s' % width.encode(enc)
    buf += b';height=%s' % height.encode(enc)
    buf += b';preserveAspectRatio=%d' % int(preserveAspectRatio)
    buf += b':'
    buf += b64encode(data)

    # ST
    buf += b'\a'
    if is_tmux: buf += b'\033\\'

    buf += b'\n'

    stdout.buffer.write(buf)
    stdout.flush()
```


