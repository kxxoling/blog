# 使用 ffmpeg 转换视频格式

ffmpeg 是 \*nix 系统下最流行的音视频处理库，功能强大，并且提供了丰富的终端命令，实是日常视频处理的一大利器！

## 实例

### flac 格式转 mp3

音频格式转换非常简单：``ffmpeg -i input.flac -acodec libmp3lame output.mp3``。

ffmpeg 将会使用 libmp3lame 解码器将 ``input.flac`` 文件转换为 mp3 格式的 ``output.mp3`` 文件。

#### 批量格式转换

想要批量转换 flac 文件也是很常见的需求，我们可以结合 bash 命令来完成：

```sh
find . -name "*.flac" -exec bash -c 'ffmpeg -i "{}" -y "${0/.flac}.wav"' {} \;
```

### webm 转 gif 格式

webm 是 Google 提出的多媒体文件格式，包含了 VP8 影片轨和 Ogg Vorbis 音轨，按照 BSD 格式开源。webm 能够提供更高质量的在线视频，但是其支持程度并不如存在已久的 mp4 和动态图片格式 gif，因此有时候会有将其转换为 gif 格式的需求。我们用到的命令是：

    ffmpeg -i input.webm -vf "scale=400:-1,fps=10" output.gif

其作用是将 input.webm 格式的视频转换为横向宽度为 400px，纵向宽度保持比例的每秒 10 帧的 output.gif 图片。

当然，也可以将 gif 转换为 webm 格式：

    ffmpeg -i output.gif -c:v libvpx -auto-alt-ref 0 input.webm

如果出现“Unknown encoder libvpx”的问题，需要重新在重新编译安装 ffmpeg 以支持 libvpx 编码器：``brew reinstall ffmpeg --with-libvpx``。

转换为 mp4 格式：

    ffmpeg -i input.webm -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" output.mp4

这里 vf 参数的意义是，将视频的长宽强制转换为偶数，否则可能遇到“width not divisible by 2”的问题。

## 生成视频缩略图

### 生成封面

使用视频的第一帧作为封面：

```sh
ffmpeg -i your-video.mp4 -ss 00:00:00 -vframes 1 thumb.png
```

### 每 xx 秒生成一个缩略图

每分钟一张：

```sh
ffmpeg -i your-video.mp4 -vf fps=1/60 your-video-%03d.png
```

再将其合并：

```sh
ffmpeg -i your-video-%03d.png -filter_complex scale=-1:-1,tile=99x1:margin=10:padding=4 output.png
```

这里的 tile 长度设定为 99，应当改为缩略图的总数。

一步到位：

```sh
ffmpeg -ss 00:00:00 -i your-video.mp4 -vf 'select=not(mod(n\,24)),scale=-1:-1,tile=99*1' out.png
```

意思是从视频的 00:00:00 处开始，每 24 帧（一般动换都是 24 帧的）取一张图片，长宽不进行压缩，最后合成在 99*1 的方格中。
