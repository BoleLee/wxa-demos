import Component from '../component'

export default {
  /**
   * 默认参数
   */
  setDefaults() {
    return {
      comments: [],
      animationData: [],
      auto: 2000, 
      speed: 1000, 
      circular: true,
      scrollWhenOne: false,
      ready: false,
      height: 48,
      defaultIndex: 0,
      index: 0,
      timer: null,
      reInitTimer: null,
      isDone: false
    }
  },

  init(id, opts = {}) {
    const options = Object.assign({}, this.setDefaults(), opts)
    console.log('barrage initing')

    const component = new Component({
      scope: `$wux.barrage.${id}`,
      data: options,
      methods: {
        translate(index, offset, display, speed, callback) {
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

            var opacity = display ? 1 : 0;
            animation.translateY(offset).opacity(opacity).step();

            typeof callback == 'function' && callback(animation.export())
          }
        },
        doAnimate(towards) {
          var barrage = this.getComponentData();
          var prevIndex, nextIndex;
          var pageHeight = barrage.height;
          var speed = barrage.speed || 300;
          var circular = barrage.circular;
          var total = barrage.comments.length;
          var currentIndex = barrage.index;
          var scrollWhenOne = barrage.scrollWhenOne;
          var that = this;

          if (total === 0) return;
          
          if (towards === 'next') {
            prevIndex = currentIndex - 1;
            nextIndex = currentIndex + 1;
            if (prevIndex < 0) {
              prevIndex = total - 1;
            }
            if (nextIndex > total-1) {
              nextIndex = 0;
            }
          }

          var newIndex;
          if (towards === 'next') {
            if (currentIndex < total - 1) {
              newIndex = currentIndex + 1;
            }
            if (currentIndex === total - 1) {
              newIndex = 0;
            }
          }
          this.page.setData({
            [`$wux.barrage.${id}.index`]: newIndex
          })

          setTimeout(() => {
            this.page.setData({
              [`$wux.barrage.${id}.isDone`]: true
            })

            var animationData = [];
            for(var i = 0; i < total; i++) {
              var offset = pageHeight * (i - newIndex);
              var display = i === newIndex ? 1 : 0;
              if(circular && newIndex == 0 && i > newIndex) {
                offset = pageHeight * (i - total - newIndex);
              }
              // if(scrollWhenOne && total == 1 && i == newIndex) {
              //   offset = pageHeight * -1;
              //   speed = speed / 3;
              // }
              this.translate(i, offset, display, speed, function(animation) {
                animationData.push(animation);
              });
            }

            this.page.setData({
              [`$wux.barrage.${id}.animationData`]: animationData
            }, function() {

              if(circular && towards == 'next') {
                setTimeout(() => {
                  for(var i = 0; i < total; i++) {
                    var offset;
                    if(i < newIndex) {
                      offset = pageHeight * (i + total - newIndex);
                      console.log(i+': '+offset)
                      that.translate(i, offset, 0, 0, function(animation) {
                        that.page.setData({
                          [`$wux.barrage.${id}.animationData[${i}]`]: animation
                        })
                      });
                    }
                    if(i > newIndex && newIndex == 0) {
                      offset = pageHeight * (i - newIndex);
                      console.log(i+': '+offset)
                      that.translate(i, offset, 0, 0, function(animation) {
                        that.page.setData({
                          [`$wux.barrage.${id}.animationData[${i}]`]: animation
                        })
                      })
                    }
                    // if(scrollWhenOne && total == 1 && i == newIndex) {
                    //   console.log(i+': '+0)
                    //   that.translate(i, pageHeight, 0, 0, function(animation) {
                    //     that.page.setData({
                    //       [`$wux.barrage.${id}.animationData[${i}]`]: animation
                    //     }, function() {
                    //       that.translate(i, 0, 1, speed/3, function(animation) {
                    //         that.page.setData({
                    //           [`$wux.barrage.${id}.animationData[${i}]`]: animation
                    //         })
                    //       })
                    //     })
                    //   })
                    // }
                  }
                }, speed+10);
              }
            })
          }, 10);
        },

        next() {
          this.doAnimate('next');
          console.log('doAnimate next')
        },
        getRect: function(cb){
          var that = this;
          wx.createSelectorQuery().select('.barrage-swipe').boundingClientRect(function(rect){
            that.page.setData({
              [`$wux.barrage.${id}.height`]: rect.height
            })
            console.log(rect)
            typeof cb == 'function' && cb()
          }).exec()
        },
        initDatas() {
          console.log('initing datas');
          var barrage = this.getComponentData();
          var total = barrage.comments.length;
          var defaultIndex = barrage.defaultIndex;
          var animationData = [];
          var pageHeight = barrage.height;
          console.log('pageHeight: '+pageHeight);

          this.page.setData({
            [`$wux.barrage.${id}.ready`]: true,
            [`$wux.barrage.${id}.index`]: defaultIndex
          })

          // items初始位置
          for (var i = 0; i < total; i++) {
            var offset = pageHeight * (i - defaultIndex);
            var display = i === defaultIndex ? 1 : 0;
            this.translate(i, offset, display, 0, function(animation) {
              animationData.push(animation);
            });
          }

          this.page.setData({
            [`$wux.barrage.${id}.animationData`]: animationData
          })
        },
        initTimer() {
          console.log('initing timer');
          var barrage = this.getComponentData();
          var total = barrage.comments.length;
          var auto = barrage.auto;
          if (auto > 0 && !barrage.timer) {

            var interval = setInterval(() => {
              if (barrage.index > total - 1) {
                return this.clearTimer();
              }
              this.next();
            }, auto);

            this.page.setData({
              [`$wux.barrage.${id}.timer`]: interval
            })
          }
        },

        clearTimer() {
          var barrage = this.getComponentData();
          clearInterval(barrage.timer);
          this.page.setData({
            [`$wux.barrage.${id}.timer`]: null
          })
        },

        unload() {
          var barrage = this.getComponentData();
          if (barrage.timer) {
            this.clearTimer();
          }
          if (barrage.reInitTimer) {
            clearTimeout(barrage.reInitTimer);
            this.page.setData({
              [`$wux.barrage.${id}.reInitTimer`]: null
            })
          }
        }
      }
    })

    console.log(component)
    component.getRect(function() {
      component.initDatas();
      component.initTimer();
    });
  }
}
