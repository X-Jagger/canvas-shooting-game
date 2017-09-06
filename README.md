题目来源：http://git.imweb.io/imweb-teacher/game
### demo-1:
监听空格与方向键，赋予相应的事件，然后canvas重绘，实现飞机的移动与子弹的射击。

每一个子弹是独立对象，继承自Bullet(),包含它自己的飞行动作，setInterval控制实现子弹的飞行。子弹飞出画布后，clearInterval()

飞行用x,y的改变重绘位置来实现。   

**性能不好**：每一个移动每一颗子弹都单独的重绘，而不是每一帧所有状态改变完了之后统一重绘。这就需要变量来保存下一次重绘的状态，然后再重绘~ （这个其实就是双缓冲吧）

**问题：**
- 1飞机移动不灵活,单次按键与长按之间转换不灵活，会有卡顿
- 2子弹达到两个以上时，画面中子弹闪烁严重
- 3子弹速度为什么会越来越快？


**尝试1：**另启画布，一画布画飞机，一画布画子弹..实现分层减少重绘... 依旧闪烁严重。
**尝试2：** requestAnimFrame,按帧统一重绘，通过变量保存子弹和飞机的状态，每次重绘前重新计算，更改状态变量，canvas再根据状态变量重绘

解决问题2子弹不闪烁了，但是子弹速度会越变越块...
解决了问题3，妈蛋，少了一个}，update放进了按键检测函数里
----------------
**尝试3：** ----为了解决问题1

单次按键与长按的区别在与是否有onkeyup，单独的onkeydown事件在
长按时会出现判断事件延迟，考虑通过变量控制按键状态,只有当确实
onkeyup等发生的时候才改变状态,长按的时候不改变状态

解决了问题1,飞机现在可以流畅飞行..但出现了新的问题，
问题4：键盘按键反应时间明显长于canvas重绘时间，导致按一下会使子弹出现很多个

**尝试4：** ----为了解决问题4：单按多个子弹
    
（1）给单次按键onkeydown设置定时器，延迟一会儿执行 -----没用
（2）在添加新子弹前将pressedSpace设为false ----- 成功 ，带来了新的问题，无法实现飞机边飞边按着子弹连射..
 (3)借用setTimeout判断单按和长按 实现单按空格子弹单射，长按空格子弹连射--成功！
 (4)还有一个问题，子弹连射只能静止的时候保持连射然后移动，
 不能在先移动的时候开启连射模式,这是因为左右移动的时候是一直有左右按键事件在触发，
 而此时如果一直按着空格发射子弹，其实是不会一直触发的，如何解决呢？

 BINGO！想到了，再设置一个变量，如果左或右被一直按着的话，
 此时一直按着空格，只有onkeydown事件，没有onkeyup事件，
 就设置pressedSpaceHeld为true  ----- 成功

 (5)带出下一个问题 移动的时候不能单发射击了...暂时不解决了..

### demo-2: 怪兽的移动与被打
**问题：**
- 左右不均等
- 相对距离在改变

(1)不停来回移动，到达边缘就改变方向 --- 成功
出现问题：每一行过后怪兽的x坐标都会增加2倍速度那么长!

终于找到了！ 妈蛋！最后边的那个怪兽碰到判断后少走了一步,

到左边的时候，第一个怪兽多向左走了一步，其他的向右走了一步，差两步

(2)可以行走和被打到的时候消失了~   出现个问题，子弹和怪兽被打的位置不搭,
子弹要右偏才能打到

找到原因了：ctx.moveTo(this.x += w / 2, this.y);子弹的x是飞机的最左边x

解决：var bullet = new Bullet(plane.x + w / 2, plane.y + w / 2, 10, 10);

### demo-3: 添加图片和开始页面

1.图片添加替换ctx.drawImage() ----成功

2.开始页面添加 : css应用： 都是block,不显示的时候设置display:name；
用data-status控制当前状态切换页面。   --- 成功

3.游戏结束想重新玩，点击后 所有物体移动速度加快？ 解决！

想重新玩只用init()初始新的飞机、子弹、怪兽,update()默认启动一次就不会停止