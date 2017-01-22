# 使用 ffmpeg 转换视频格式

ffmpeg 是 \*nix 系统下最流行的视频处理库，功能强大，并且提供了丰富的终端命令，实是日常视频处理的一大利器！

## 实例

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
