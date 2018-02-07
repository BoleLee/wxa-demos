Component({
  properties: {
    comments: {
      type: Array,
      value: []
    },
    total: {
      type: Number,
      value: 3
    }
  },
  data: {
    showCount: 1,
    animationData: [],
    auto: 2000,
    speed: 1000,
    circular: true,
    scrollWhenOne: false,
    ready: false,
    defaultIndex: 0,
    index: 0,
    timer: null,
    reInitTimer: null,
    isDone: false,
    height: 48
  },
  methods: {
    translate(offset, display, speed, callback) {
      if (speed >= 0) {
        /**
         * 创建一个动画实例
         */
        const animation = wx.createAnimation({
          duration: speed,
          timingFunction: 'ease-in-out',
          delay: 0,
          transformOrigin: '50% 50%'
        })

        var opacity = display ? 1 : 0
        animation.translateY(offset).opacity(opacity).step()

        typeof callback === 'function' && callback(animation.export())
      }
    },

    doAnimate(towards) {
      var prevIndex
      var nextIndex
      var pageHeight = this.data.height || 48
      var speed = this.data.speed || 300
      var circular = this.data.circular
      var total = this.data.total
      var currentIndex = this.data.index
      var showCount = this.data.showCount
      var that = this

      if (total === 0) return
      if (towards === 'next') {
        prevIndex = currentIndex - 1
        nextIndex = currentIndex + showCount
        if (prevIndex < 0) {
          prevIndex = total - 1
        }
        if (nextIndex > total - 1) {
          nextIndex = 0
        }
      }

      var newIndex
      if (towards === 'next') {
        if (currentIndex < total - 1) {
          newIndex = currentIndex + 1
        }
        if (currentIndex === total - 1) {
          newIndex = 0
        }
      }
      this.setData({
        index: newIndex
      })

      setTimeout(() => {
        this.setData({
          isDone: true
        })

        var animationData = []
        for (var i = 0; i < total; i++) {
          var offset = pageHeight * (i - newIndex)
          var display = 0
          if (newIndex <= i && i < newIndex + showCount) {
            display = 1
          }
          // 二次循环过渡时(index=0出现在可见范围内)，让往上滚动
          if (circular) {
            if (total > showCount) {
              // 最后一个进入可视区域，且在可视区域期间
              if (total - newIndex <= showCount && i + total - newIndex < showCount) {
                offset = pageHeight * (i + total - newIndex)
                display = 1
              }
              // 最后一个离开可视区域
              if (newIndex === 0 && i === total - 1) {
                offset = pageHeight * (i - total - newIndex)
              }
              if (newIndex === 0 && i > 0 && i < total - 1) {
                offset = pageHeight * (i - newIndex)
                display = i < showCount ? 1 : 0
              }
            }
            // 当 total <= showCount 时，使其有滚动效果
            if (total <= showCount) {
              offset = pageHeight * (i - 1)
              speed = 500
            }
          }
          this.translate(offset, display, speed, function(animation) {
            animationData.push(animation)
          })
        }

        this.setData({
          animationData: animationData
        }, function() {
          if (circular && towards === 'next') {
            setTimeout(() => {
              // 复位：回到其下一次即将出现的地方之下
              for (var i = 0; i < total; i++) {
                var offset
                var display = 0

                if (total > showCount) {
                  // 最后一个进入可视区域，且在可视区域期间
                  if (total - newIndex <= showCount && i < newIndex) {
                    offset = pageHeight * (i + total - newIndex)
                    display = i + total - newIndex < showCount ? 1 : 0
                    that.translate(offset, display, 0, function(animation) {
                      animationData[i] = animation
                    })
                  }
                  // 最后一个离开可视区域
                  if (newIndex === 0 && i === total - 1) {
                    offset = pageHeight * (i - newIndex)
                    that.translate(offset, display, 0, function(animation) {
                      animationData[i] = animation
                    })
                  }
                }
                // 当 total <= showCount
                if (total <= showCount) {
                  offset = pageHeight * (i + 1)
                  that.translate(offset, 0, 0, function(animation) {
                    animationData[i] = animation
                  })
                }
              }

              that.setData({
                animationData: animationData
              }, function() {
                if (total <= showCount) {
                  // 当 total <= showCount 时，使其滚动复位
                  setTimeout(() => {
                    for (var i = 0; i < total; i++) {
                      offset = pageHeight * i
                      that.translate(offset, 1, 500, function(animation) {
                        animationData[i] = animation
                      })
                    }

                    that.setData({
                      animationData: animationData
                    })
                  }, 10)
                }
              })
            }, speed + 10)
          }
        })
      }, 10)
    },

    next() {
      this.doAnimate('next')
      // console.log('doAnimate next')
    },

    initDatas() {
      // console.log('initing datas')
      var total = this.data.total
      var defaultIndex = this.data.defaultIndex
      var animationData = []
      var pageHeight = this.data.height
      var showCount = this.data.showCount

      this.setData({
        ready: true,
        index: defaultIndex
      })

      // items初始位置
      for (var i = 0; i < total; i++) {
        var offset = pageHeight * (i - defaultIndex)
        var display = 0
        if (defaultIndex <= i && i < defaultIndex + showCount) {
          display = 1
        }
        this.translate(offset, display, 0, function(animation) {
          animationData.push(animation)
        })
      }

      this.setData({
        animationData: animationData
      })
    },

    initTimer() {
      // console.log('initing timer')
      var total = this.data.total
      var auto = this.data.auto
      if (auto > 0 && !this.data.timer) {
        var interval = setInterval(() => {
          if (this.data.index > total - 1) {
            return this.clearTimer()
          }
          this.next()
        }, auto)

        this.setData({
          timer: interval
        })
      }
    },

    clearTimer() {
      clearInterval(this.data.timer)
      this.setData({
        timer: null
      })
    }
  },

  attached() {
    this.initDatas()
    this.initTimer()

    var that = this
    wx.getSystemInfo({
      success: function(res) {
        var rpxRatio = 750 / res.windowWidth
        var height = (96 / rpxRatio).toFixed(0)
        that.setData({
          height: height
        })
      }
    })
  },
  ready() {

  },
  detached() {
    if (this.data.timer) {
      this.clearTimer()
    }
    if (this.data.reInitTimer) {
      clearTimeout(this.data.reInitTimer)
      this.setData({
        reInitTimer: null
      })
    }
  }
})
