Page({
    data:{
      optionsListData:[{
        order: 1,
        title: '排序item1'
      }, {
        order: 2,
        title: '排序item2'
      }, {
        order: 3,
        title: '排序item3'
      }, {
        order: 4,
        title: '排序item4'
      }, {
        order: 5,
        title: '排序item5'
      }],
      dragSelectedClass: "dragSelected",
      movableViewPosition: {
        x: 0,
        y: 0,
        className: "none",
        data: {}
      },
      scrollPosition: {
        everyOptionCell: 44,
        top: 32,
        scrollTop: 0,
        scrollY: true,
        scrollViewHeight: 600
      },
      selectItemInfo: {
        selectIndex: -1,
        selectPosition: 0,
        id: 0,
        title: '',
        order: ''
      }
    },
    onLoad: function (options) {
      var that = this;
      var { windowHeight } = wx.getSystemInfoSync();
      this.setData({
        'scrollPosition.scrollViewHeight': windowHeight-46
      });
    },

    cancelSort: function() {
      wx.showModal({
        title: '提示',
        content: '取消排序'
      })
    },
    updateSort: function() {
      wx.showModal({
        title: '提示',
        content: '确认提交新排序'
      })
    },

    bindscroll:function (event) {
      var scrollTop = event.detail.scrollTop;
      this.setData({
        'scrollPosition.scrollTop': scrollTop
      })
    },
    draggleTouch:function (event) {
      var touchType = event.type;
      switch(touchType){
        case "touchstart":
            this.scrollTouchStart(event);
            break;
        case "touchmove":
            this.scrollTouchMove(event);
            break;
        case "touchend":
            this.scrollTouchEnd(event);
            break;
      }
    },

    scrollTouchStart:function (event) {
      var firstTouchPosition = {
        x:event.changedTouches[0].pageX,
        y:event.changedTouches[0].pageY
      }
      // console.log("firstTouchPosition:",firstTouchPosition);
      var domData = this.getPositionDomByXY(firstTouchPosition);
      // console.log("domData:",domData);

      //movable-area滑块位置处理
      var movableX = 0;
      var movableY = firstTouchPosition.y-this.data.scrollPosition.top-this.data.scrollPosition.everyOptionCell/2;

      this.setData({
        movableViewPosition:{
          x:movableX,
          y:movableY,
          className:"",
          data:domData
        }
      })

      var id = domData.id;
      var secInfo = this.getOptionInfo(id);
      var { dragSelectedClass } = this.data;
      secInfo.selectPosition =  event.changedTouches[0].clientY;
      secInfo.selectClass = dragSelectedClass;

      this.data.optionsListData[secInfo.selectIndex].selectClass = dragSelectedClass;

      var optionsListData = this.data.optionsListData;

      this.setData({
        'scrollPosition.scrollY':false,
        selectItemInfo:secInfo,
        optionsListData:optionsListData,
        'scrollPosition.selectIndex':secInfo.selectIndex
      })
    },
    scrollTouchMove:function (event) {
      var selectItemInfo = this.data.selectItemInfo;
      var selectPosition = selectItemInfo.selectPosition;
      var moveDistance   = event.changedTouches[0].clientY;
      var everyOptionCell = this.data.scrollPosition.everyOptionCell;
      var optionsListData = this.data.optionsListData;
      var selectIndex = selectItemInfo.selectIndex;

      // console.log("event.changedTouches:",event.changedTouches);
      //movable-area滑块位置处理
      var movableX = 0;
      var movableY = event.changedTouches[0].pageY-this.data.scrollPosition.top-this.data.scrollPosition.everyOptionCell/2;


      this.setData({
        movableViewPosition:{
          x:movableX,
          y:movableY,
          className:"",
          data:this.data.movableViewPosition.data
        }
      })

      if(moveDistance - selectPosition > 0 && selectIndex < optionsListData.length - 1){
        if (optionsListData[selectIndex].id == selectItemInfo.id) {
          optionsListData.splice(selectIndex, 1);
          optionsListData.splice(++selectIndex, 0, selectItemInfo);
          selectPosition += everyOptionCell;
        }
      }

      if (moveDistance - selectPosition < 0 && selectIndex > 0) {
        if (optionsListData[selectIndex].id == selectItemInfo.id) {
          optionsListData.splice(selectIndex, 1);
          optionsListData.splice(--selectIndex, 0, selectItemInfo);
          selectPosition -= everyOptionCell;
        }
      }

      this.setData({
        'selectItemInfo.selectPosition': selectPosition,
        'selectItemInfo.selectIndex': selectIndex,
        optionsListData: optionsListData
      });
    },
    scrollTouchEnd:function (event) {
      var optionsListData = this.optionsDataTranlate(this.data.optionsListData,"");

      this.setData({
        optionsListData:optionsListData,
        'scrollPosition.scrollY':true,
        'movableViewPosition.className':"none"
      })
    },
    optionsDataTranlate: function (optionsList,selectClass) {
      for(var i=0,j=optionsList.length;i<j;i++){
        optionsList[i].selectClass = selectClass;
      }
      return optionsList;
    },
    getOptionInfo: function (id) {
      for(var i=0,l=this.data.optionsListData.length; i<l; i++){
        var optionData= this.data.optionsListData[i];
        if(optionData.id == id){
          optionData.selectIndex = i;
          return optionData;
        }
      }
      return {};
    },
    getPositionDomByXY: function (potions) {
      var y = potions.y-this.data.scrollPosition.top+this.data.scrollPosition.scrollTop;
      var optionsListData = this.data.optionsListData;
      var everyOptionCell = this.data.scrollPosition.everyOptionCell;
      for(var i=0,j=optionsListData.length;i<j;i++){
        if(y>=i*everyOptionCell&&y<(i+1)*everyOptionCell){
            return optionsListData[i];
        }
      }
      return optionsListData[0];
    }
});
