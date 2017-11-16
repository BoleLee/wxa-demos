## barrage ##

评论滚动显示组件，类似swiper，方向为vertical，增加淡入淡出效果。

### 更新 ###

- [新增] 支持同时显示多条评论，默认为1条，配置参数：showCount，显示区域高度需同时变化

- [优化] 当总评论数<=显示数（total <= showCount）时，若circular为true，使其有滚动效果

### 说明 ###

- 组件代码位于```components/barrage```

- js: 此组件使用```wux```自定义组件的方式来拓展组件，依赖于其```Component基类(components/component.js)```，其作用在于将组件的数据和方法加入到页面中，变量会加前缀```$wux.barrage.testname```重命名, testname为其实例命名；

- xwss: 直接import使用，可按需求修改

- 使用：见示例 ```pages/demos/barrage/barrage```

```
import { $wuxBarrage } from '../../../components/wux'

  $wuxBarrage.init('testname', {
    height: 48, // 每次滚动高度，单位: px
    total: 3, // 评论总数
    showCount: 1, // 显示评论数
    auto: 2000, // 滚动间隔，单位: ms
    speed: 1000, // 滚动速度，单位: ms
    circular: true, // 是否首尾衔接滚动
    defaultIndex: 0, // 初始索引
    scrollWhenOne: true // 只有一个是否滚动，暂无实现
  })

```

### 小程序自定义组件 ###

小程序已于2017-11-02开放了官方自定义组件公测功能，可根据文档开发符合需求的组件

