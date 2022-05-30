# 10 行 HTML 实现 AR 效果

[AR.js][arjs] 是一个 JS 实现的 [AR][ar] 库，只要保证浏览器支持 WebRTC 和 WebGL 就可以在浏览器环境中执行，所以并不支持 iOS 11 以下操作系统的浏览器。AR.js 使用起来也很简单，官方推荐了[一个 medium 上的教程](https://medium.com/arjs/augmented-reality-in-10-lines-of-html-4e193ea9fdbf)，教你如何使用 10 行 HTML 实现一个 AR 效果的网站。这里直接解释最终代码：

```html
<script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.5.0/aframe/examples/vendor/aframe/build/aframe.min.js"></script>
<script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.5.0/aframe/build/aframe-ar.js"></script>

<body style='margin : 0px; overflow: hidden;'>
    <a-scene embedded arjs='trackingMethod: best;'>
      <a-box position='0 0.5 0' material='opacity: 0.5;'></a-box>
      <a-camera-static/>
    </a-scene>
</body>
```

代码非常简单，首先是引用了 [a-frame][a-frame] 和 [aframe-ar][aframe-ar] 两个库。a-frame 是由 [MozillaVR][mozvr] 项目组提供的构建 VR 体验的库，基于另一个 3D 效果库 [three.js][three.js]，而 [aframe-ar] 就是 a-frame 的 AR 版本。

然后定义了一个 HTML ``body``，用于承载 HTML 元素。

之后在 ``body`` 中创建了一个 ``a-scene`` 元素。``a-scene`` 标签是 aframe-ar 提供的一个自定义标签，用于定义一个 3D 场景（scene），有了它我们就可以在其中进一步创建 3D 元素了。``a-scene`` 有一个 [``artoolkit``][artoolkit] 属性，我们指定使用摄像头作为 AR 目标。（根据文档指示，``artoolkit`` 还可以通过设置 ``sourceType`` 属性来指定以图片或者视频为目标。）

在 ``a-scene`` 中我们添加了一个 ``a-box`` 作为要展示的 AR 内容，根据属性它将会是在 AR 标记正上方半个单位高度处的一个透明立方体。

最后，在添加一个 ``a-camera-static`` 标签用于指定一个静态相机就大功告成了。在线演示：[CodePen](https://codepen.io/jeromeetienne/pen/mRqqzb)

我也仿照做了[稍微复杂点的例子](https://github.com/kxxoling/AR-Overload-Chick)，使用方法都是类似的，如果你的手机不支持 AR.js，也可以像我一样使用计算机摄像头代替。

[arjs]: https://github.com/jeromeetienne/AR.js/
[ar]: https://en.wikipedia.org/wiki/Augmented_reality
[a-frame]: https://aframe.io/
[aframe-ar]: https://github.com/jeromeetienne/AR.js/blob/master/aframe/README.md
[mozvr]: https://mozvr.com/
[three.js]: https://threejs.org/
[artoolkit]: https://github.com/jeromeetienne/AR.js/blob/master/aframe/README.md#artoolkit-system

