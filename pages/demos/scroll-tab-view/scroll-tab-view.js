Page({
  data: {
    tabs: [{
      name: '周一',
      content: 'tab1'
    }, {
      name: '周二',
      content: 'tab2'
    }, {
      name: '周三',
      content: 'tab3'
    }, {
      name: '周四',
      content: 'tab4'
    }, {
      name: '周五',
      content: 'tab5'
    }, {
      name: '周六',
      content: 'tab6'
    }, {
      name: '周日',
      content: 'tab7'
    }],

    activeTab: 0,
    navSliderLeft: 0, // px
    tabBarScrollLeft: 0, // px
    rpxRatio: 2,
    tabWidth: 108, // rpx
    winWidth: 750, // rpx
    navHeight: 104, // rpx
    swiperHeight: 507 // px
  },

  onLoad: function () {
    var that = this;
    var { navHeight, tabWidth, activeTab } = that.data;

    try {     
      // swiper高度自适应
      wx.getSystemInfo({  
        success: function( res ) {  
          var clientHeight = res.windowHeight,
              clientWidth = res.windowWidth,
              rpxRatio = 750/clientWidth;
          var swiperHeight = (clientHeight*rpxRatio-navHeight)/rpxRatio;

          that.setData( {
            swiperHeight: swiperHeight,
            rpxRatio: rpxRatio,
            navSliderLeft: Math.round(tabWidth*activeTab/rpxRatio)
          });
        }
      });
    } catch (e) {
    }
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  // 监测更新tab-bar的滚动位置
  updateTabBarScroll() {
    let { activeTab, tabWidth, winWidth, rpxRatio } = this.data;
    var tabOffset = tabWidth*(activeTab+1);
    var result = 0;
    
    var minOffset = winWidth-tabWidth;
    var maxScroll = tabWidth*7 - winWidth;

    if(tabOffset <= minOffset) {
      result = 0;

    } else if (minOffset < tabOffset && tabOffset < maxScroll) {
      result = tabOffset - winWidth/2+tabWidth/2;

    } else if(maxScroll <= tabOffset) {
      result = maxScroll;
    }

    this.setData({
      tabBarScrollLeft: Math.round(result/rpxRatio)
    })
  },
  _updateSelectedPage(page) {
    var { tabWidth, rpxRatio } = this.data;
    this.setData({
      activeTab: page,
      navSliderLeft: Math.round(tabWidth*page/rpxRatio)
    })
    this.updateTabBarScroll();
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  },
  swiperChange(e) {
    this._updateSelectedPage(e.detail.current);
  }
})