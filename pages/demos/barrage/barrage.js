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
    }],
    oneComment: [{
      id: 1,
      avatar_url: '../../../images/avatar.png',
      content: '这是滚动显示的评论'
    }],

    swipeArr: [{
      comments: [{
        id: 1,
        avatar_url: '../../../images/avatar.png',
        content: '1-1这是滚动显示的评论'
      }, {
        id: 2,
        avatar_url: '../../../images/avatar.png',
        content: '1-2评论加了淡入淡出效果'
      }, {
        id: 3,
        avatar_url: '../../../images/avatar.png',
        content: '1-3需要使swipe的高度比弹幕的高度高一些，使其垂直居中'
      }]
    }, {
      comments: [{
        id: 1,
        avatar_url: '../../../images/avatar.png',
        content: '2-1这是滚动显示的评论'
      }, {
        id: 2,
        avatar_url: '../../../images/avatar.png',
        content: '2-2评论加了淡入淡出效果'
      }]
    }]
  },
  onLoad() {
    var that = this;
    var rpxRatio;

    wx.getSystemInfo({  
      success: function( res ) {  
        rpxRatio = 750/res.clientWidth;
      }
    });

    var height = Math.round(96/rpxRatio);

    $wuxBarrage.init('test1', {
      height: height,
      total: that.data.comments.length
    })
    $wuxBarrage.init('test2', {
      height: height,
      total: that.data.oneComment.length,
      scrollWhenOne: true
    })

    var { swipeArr } = that.data;
    swipeArr.forEach(function(item, index) {
      var name = `swipe-${index}`;
      $wuxBarrage.init(name, {
        height: height,
        total: item.comments.length
      })
    })
  },
  onUnload() {
    // TODO 清除定时器
  }
})
