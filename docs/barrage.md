## barrage ##

评论滚动显示组件，类似swiper，方向为vertical，增加淡入淡出效果。

### TODO ###
- 当只有一条评论时，目前效果为不动，待寻找一条评论也一直滚动的实现方案；

- wxml使用```template```的方式import入页面，会报不知名错误，暂时为直接在页面中写wxml代码；

### 说明 ###

- 组件代码位于```components/barrage```

- js: 此组件使用```wux```自定义组件的方式来拓展组件，依赖于其```Component基类(components/component.js)```，其作用在于将组件的数据和方法加入到页面中，变量会加前缀```$wux.barrage.testname```重命名, testname为其实例命名；

- wxml: 此方式无slot功能，无法往组件中插入代码，所以内部的标签及数据比较死；不过不用引入template代码块的方式写入组件标签，而是直接在页面中写入，就没有什么影响，好在组件本身的标签也不多；

- xwss: 直接import使用

- 使用：见示例 ```pages/demos/barrage/barrage```

```
import { $wuxBarrage } from '../../../components/wux'

onLoad() {
  $wuxBarrage.init('testname', {
    comments: [{
      id: 1,
      avatar_url: '../../../images/avatar.png',
      content: '这是滚动显示的评论'
    }, {
      id: 2,
      avatar_url: '../../../images/avatar.png',
      content: '评论加了淡入淡出效果'
    }], // 评论内容
    auto: 2000, // 滚动间隔，单位: ms
    speed: 1000, // 滚动速度，单位: ms
    circular: true, // 是否首尾衔接滚动
    defaultIndex: 0, // 初始索引
    scrollWhenOne: true // 只有一个是否滚动，暂无实现
  })
}

```

### 小程序自定义组件 ###

小程序已于2017-11-02开放了官方自定义组件公测功能，可根据文档开发符合需求的组件

