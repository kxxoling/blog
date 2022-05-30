# Filco Majestouch 2 Convertible 拆解

这台 Filco Majestouch 2 Convertible 两年前坏掉后就没再当作蓝牙键盘使用了，
这次趁着维修的机会自己也拆解了一遍看看它的构造，看到网上并没有类似的拆解图，于是发出来抛砖引玉。
之前并没有过键盘拆解经验，所以这会是一篇非常浅显的拆解图解。


## 拆解过程

首先看看键盘背面，为了拆解键盘，你首先需要拆解掉所有的固定螺丝，如下图红色椭圆显示，共三颗六角螺丝。
你将会不可避免地破坏掉保修凭证，不过 Filco 并不提供全球联保，于是我就放心大胆的动手了！

拆掉所有螺丝后，需要拆解按扣，键盘的后方（下图上方）两个，前方（下方）4 个，上方 2
个属于非常好拆的类型，下面 4 个最好事先准备好专业的工具。

![键盘背面](/images/keyboards/m2c-back.jpg)

拆开暗扣后请勿用力分离，因为还有电源线连接在 PCB 板和后盖之间，而且这跟电源线的长度并没有很大伸缩空间。
如下图：

![正面电源线](/images/keyboards/m2c-front.jpg)

电源线只需要拔开即可。然后需要做的就是拔出蓝牙模块，蓝牙模块的脚针很结实，
不是过分暴力的话应该都没什么问题。拆解后全图：

![拆解后全部模块](/images/keyboards/m2c-full.jpg)

红色部分是暗扣，蓝色部分是蓝牙模块及其在主板上的接口。

蓝牙模块背面接口：

![蓝牙模块背面](/images/keyboards/m2c-main-chip.jpg)

蓝色圆圈中是 Filco Majestouch 2 Convertible 的 Mini USB 接口，M2C 并没有提供 Micro USB 接口；
蓝色方块中的是蓝牙模块在主板上的针脚接口；红色椭圆中是电源接口的背面。

![蓝牙模块接口](/images/keyboards/m2c-interface.jpg)

其它图片：

![背面全貌](/images/keyboards/m2c-full-back.jpg)

![DIP 开关](/images/keyboards/m2c-dip.jpg)


## 总结

这款 Filco Majestouch 2 Convertible 是日式键位、茶轴，配合博通的蓝牙 2.0 模块，可以快速在
4 台已配置设备间切换，使用起来还算方便。

茶轴的手感适中，但是在长时间打字的情况下，使用体验并不如手感更轻、键程更长的青轴和电容，
因此我现在的主要输入设备已经换成了 Filco Minila Air 和 RealForce 87 USB。
茶轴给我的感觉更多的是一种折中：没有黑轴的费力、青轴的吵闹、电容的昂贵，各方面都不突出，
但依然能很好地完成自己的使命。

这款 M2C 在维修后出现了一些问题，无法和 OS X 10.10 的 MacBook Air 以及 iOS 8 系统的 iPhone 5
正常连接，问题的表现是：能够正常搜索并确认连接，在输入验证数字串后，MMBA/iPhone
显示已连接状态，而 M2C 依然在等待连接。而连接 Windows 系统和 iOS 6 系统的 iPhone 4
并没有出现任何问题，目前的推断是 Apple 系统升级带来的蓝牙兼容问题。以 Apple 对待系统问题的态度，
指望他们来发现并修复问题是没有希望了。

