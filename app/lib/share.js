
/**
 * Share to social media like sina weibo and renren.com.
 */
module.exports = {
    content: {
      title: '',
      body: '新发现一个极富创意的Office 365家庭高级版个人消费者网站，大家快来看看！参加#Office 全民创意总动员#活动，为自己创意网页署名并获得Office 365家庭高级版1年使用权和专属你的创意T-shirt！极富创意的你还等什么，标榜自己的时间到了！@微软NewOffice',
      url: "http://www.microsoft.com/china/officeconsumer/campaign?CR_CC=200327616"
    },
    getPicUrl: function() {
      return 'http://www.microsoft.com/china/officeconsumer/campaign/images/share2Img.jpg';
    },
    sina: function() {
      var that = this;
      window.open('http://v.t.sina.com.cn/share/share.php?title=' 
            + encodeURIComponent([that.content.title, that.content.body].join('')) 
            + '&url=' + encodeURIComponent(that.content.url)
            + '&pic='+ encodeURIComponent(that.getPicUrl()),
          '_blank');
    }, 
    renren: function() {
      var that = this;
      window.open('http://widget.renren.com/dialog/share?title=' 
            + encodeURIComponent(that.content.title) 
            + '&description=' + encodeURIComponent(that.content.body)
            + '&resourceUrl=' + encodeURIComponent(that.content.url)
            + '&pic=' + encodeURIComponent(that.getPicUrl()),
          '_blank');
    }
};