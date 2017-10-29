
## 解析 ##

### 视图：3个主要部分 ###

- 点击区域 view(touch-area): 排序按钮出现的位置

- 可移动区域 movable-area && 当前移动的item movable-view

- 内容列表区域 scroll-view 

### 数据与事件 ###

**数据：**
- optionsListData: Array, 要排序的内容数组

- dragSelectedClass: String 

- movableViewPosition: Object, 可移动区域的位置信息

- scrollPosition: Object, 内容列表区域的位置信息

- selectItemInfo

**事件：**
- cancelSort: 取消排序，按项目需求

- updateSort: 更新排序，按项目需求

- bindscroll: 内容列表区域的滚动

- draggleTouch: 点击区域拖动事件，分``` scrollTouchStart, scrollTouchMove, scrollTouchEnd ```

- optionsDataTranlate

- getOptionInfo 

- getPositionDomByXY


