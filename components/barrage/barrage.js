import Component from '../component'

export default {
  /**
   * 默认参数
   */
  setDefaults() {
    return {
      comments: [],
      animationData: [],
      translateYArr: [],
      defaultIndex: 0,
      auto: 2000, 
      speed: 1000, 
      fade: true,
      continuous: true,
      ready: false,
      index: 0,
      dragging: false,
      animating: false,
      timer: null,
      reInitTimer: null,
      noDrag: false,
      isDone: false,
      height: 48
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
          const barrage = this.getComponentData();
          var fade = barrage.fade;

          if (speed) {
            this.page.setData({
              [`$wux.barrage.${id}.animating`]: true
            })

            /**
             * 创建一个动画实例
             */
            const animation = wx.createAnimation({
              duration: speed,
              timingFunction: 'ease-in-out',
              delay: 50
            })

            var opacity = display ? 1 : 0;
            animation.translateY(offset).opacity(opacity).step();

            this.page.setData({
              [`$wux.barrage.${id}.animationData[${index}]`]: animation.export()
            })

            var called = false;

            var transitionEndCallback = () => {
              if (called) return;
              called = true;
              this.page.setData({
                [`$wux.barrage.${id}.animating`]: true
              })

              // TODO 取消动画？
              if (callback) {
                callback.apply(this, arguments);
              }
            };
          }
        },
        doAnimate(towards) {
          var barrage = this.getComponentData();
          var prevIndex, nextIndex, currentIndex, pageHeight, offsetTop;
          var speed = barrage.speed || 300;
          var continuous = barrage.continuous;
          var total = barrage.comments.length;
          var index = barrage.index;

          if (total === 0) return;

          pageHeight = barrage.height;
          currentIndex = index;
          prevIndex = index - 1;
          nextIndex = index + 1;
          if (continuous) {
            if (!prevIndex) {
              prevIndex = total - 1;
            }
            if (nextIndex > total-1) {
              nextIndex = 0;
            }
          }

          var newIndex;

          if (towards === 'next') {
            if (index < total - 1) {
              newIndex = index + 1;
            }
            if (continuous && index === total - 1) {
              newIndex = 0;
            }
          }

          var callback = () => {
            if (newIndex !== undefined) {
              this.page.setData({
                [`$wux.barrage.${id}.index`]: newIndex
              })
            }
          };

          setTimeout(() => {
            this.page.setData({
              [`$wux.barrage.${id}.isDone`]: true
            })

            // TODO items的新位置translate
            var translateYArr = [];
            for(var i = 0; i < total; i++) {
              var offset = pageHeight * (i - newIndex);
              var display = i === newIndex ? 1 : 0;
              this.translate(i, offset, display);

              translateYArr.push(offset);
            }
            console.log('translating')

            this.page.setData({
              [`$wux.barrage.${id}.translateYArr`]: translateYArr
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
          var translateYArr = [];
          var pageHeight = barrage.height;
          console.log('pageHeight: '+pageHeight);

          this.page.setData({
            [`$wux.barrage.${id}.ready`]: true,
            [`$wux.barrage.${id}.index`]: defaultIndex
          })

          for (var i = 0; i < total; i++) {
            animationData.push('');

            // TODO items初始位置
            var offset = pageHeight * (i - defaultIndex);
            var display = i === defaultIndex ? 1 : 0;
            this.translate(i, offset, display);

            translateYArr.push(offset)
          }

          this.page.setData({
            [`$wux.barrage.${id}.animationData`]: animationData,
            [`$wux.barrage.${id}.translateYArr`]: translateYArr
          })
        },
        initTimer() {
          console.log('initing timer');
          var barrage = this.getComponentData();
          var total = barrage.comments.length;
          var auto = barrage.auto;
          if (auto > 0 && !barrage.timer) {

            var interval = setInterval(() => {
              if (!barrage.continuous && (barrage.index >= total - 1)) {
                return this.clearTimer();
              }
              if (!barrage.dragging && !barrage.animating) {
                this.next();
              }
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
