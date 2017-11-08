## barrage ##

评论滚动显示组件，类似swiper，方向为vertical，增加淡入淡出效果。

### TODO ###

- **离开页面时定时器没有停止（wux component基类，在页面调用组件内的方法机制暂时不是很明白）**

  不知道如何在页面unload时调用组件的clearTimer方法，将页面中每个barrage组件的定时器停止，暂时采用了折中的方法，在页面中写个方法，遍历页面中的barrage组件，清除其定时器

- 当只有一条评论时，目前效果为不动，待寻找一条评论也一直滚动的实现方案；

### 说明 ###

- 组件代码位于```components/barrage```

- js: 此组件使用```wux```自定义组件的方式来拓展组件，依赖于其```Component基类(components/component.js)```，其作用在于将组件的数据和方法加入到页面中，变量会加前缀```$wux.barrage.testname```重命名, testname为其实例命名；

- xwss: 直接import使用

- 使用：见示例 ```pages/demos/barrage/barrage```

```
import { $wuxBarrage } from '../../../components/wux'

  $wuxBarrage.init('testname', {
    height: 48, // 高度，单位: px
    total: 3, // 子元素个数
    auto: 2000, // 滚动间隔，单位: ms
    speed: 1000, // 滚动速度，单位: ms
    circular: true, // 是否首尾衔接滚动
    defaultIndex: 0, // 初始索引
    scrollWhenOne: true // 只有一个是否滚动，暂无实现
  })

```

### 小程序自定义组件 ###

小程序已于2017-11-02开放了官方自定义组件公测功能，可根据文档开发符合需求的组件

