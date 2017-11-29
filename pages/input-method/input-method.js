Page({
  data: {
    inputValue1: '',
    inputValue2: '',
    inputValue3: '',
    inputValue4: ''
  },

  inputChange1: function(event) {
    var { value } = event.detail;
    this.setData({
      inputValue1: value
    })
  },

  inputChange2: function(event) {
    var { value } = event.detail;
    this.setData({
      inputValue2: value
    })
  },

  inputChange3: function(event) {
    var { value } = event.detail;
    this.setData({
      inputValue3: value
    })
  },

  inputChange4: function(event) {
    var { value } = event.detail;
    this.setData({
      inputValue4: value
    })
  },

  onLoad: function() {
    
  }
})