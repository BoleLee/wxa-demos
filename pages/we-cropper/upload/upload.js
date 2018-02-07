import weCropper from '../../../vendor/weCropper/weCropper.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
  data:  {
  	cropperOpt: {
			id: 'cropper',
			width,
			height,
			scale: 2.5,
			zoom: 8,
			cut: {
				x: (width - 350) / 2,
				y: (height - 381) / 2,
				width: 350,
				height: 381
			}
		}
	},
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    this.wecropper.getCropperImage((image) => {
      if (image) {
        //  获取到裁剪后的图片
        wx.redirectTo({
          url: `../index/index?image=${image}`
        })
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap () {
  	const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        let src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

				self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad (option) {
    // do something
		const { cropperOpt } = this.data
    const { src } = option
    if (src) {
      Object.assign(cropperOpt, { src })

			new weCropper(cropperOpt)
				.on('ready', function (ctx) {
					console.log(`wecropper is ready for work!`)
				})
				.on('beforeImageLoad', (ctx) => {
					console.log(`before picture loaded, i can do something`)
					console.log(`current canvas context:`, ctx)
					wx.showToast({
						title: '上传中',
						icon: 'loading',
						duration: 20000
					})
				})
				.on('imageLoad', (ctx) => {
					console.log(`picture loaded`)
					console.log(`current canvas context:`, ctx)
					wx.hideToast()
				})
    }
  }
})
