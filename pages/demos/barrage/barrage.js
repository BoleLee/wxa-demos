import { $wuxBarrage } from '../../../components/wux'

Page({
  data: {
    comments: [{
      id: 1,
      avatar_url: '../../../images/avatar.png',
      content: '这是滚动显示的评论'
    }, {
      id: 2,
      avatar_url: '../../../images/avatar.png',
      content: '评论加了淡入淡出效果'
    }, {
      id: 3,
      avatar_url: '../../../images/avatar.png',
      content: '需要使swipe的高度比弹幕的高度高一些，使其垂直居中'
    }]
  },
  onLoad() {
    var that = this;
    $wuxBarrage.init('test1', {
      comments: that.data.comments
    })
  },
  onUnload() {
    $wuxBarrage.unload();
  }
})