## scrollable-tab-view ##

### 标签 ###

- 导航 <-> scroll-view, scroll-x=true, 导航多时可滚动显示

- 内容区 <-> swiper&swiper-item, 除了点击导航切换tab, 左右滑动也可切换tab; 内部嵌入 scroll-view, scroll-y=true，当tab内容超出一页时可滚动

### 数据与事件 ###
**数据：**
- tabs

- activeTab

- navSliderLeft: 导航指示条位置，用px为单位位置较准确

- tabBarScrollLeft: 导航条滚动位置，用px为单位位置较准确

- rpxRatio: 设备像素比，单位折算为px时用

- tabWidth: 每个导航tab的宽度，单位rpx

- winWidth: 屏幕宽度，750rpx

- navHeight: 导航栏高度，单位rpx

- swiperHeight: 内容区高度，rpx, 屏幕高度中除了导航栏高度外，剩下的为内容区高度

**事件：**

- updateTabBarScroll: 更新导航栏滚动位置

- _updateSelectedPage: 更新当前tab

- handlerTabTap: 点击导航tab切换

- swiperChange: 左右滑动内容区切换

### 样式 ###
- .withAnimate 导航指示条切换过渡动画

- 导航条样式：
  .navbar { white-space: nowrap; } 
  .navbar__item { display: inline-block }
  

