/**
 * 循环滑动卡片, 依赖zepto或jquery
 * @author superbill2012@qq.com
 * @version 0.1.0
 * @example
 *   $('mySelector').swipeCard({
 *     itemSelector: 'li', // 可选, 卡片元素选择器, 默认li
 *     direction: 'both', // 可选, 默认两个方向都可以旋转
 *     maxAngle: '35', // 可选, 默认最大转动角度 35度
 *     triggerAngle: '25', // 可选, 触发顶部卡片消失时至少达到这个角度. 默认25度
 *     transitionDuration: '0.5', // 可选, 过渡时间, 默认 0.5s
 *     transitionTimingFunction: 'ease', // 可选, 缓动函数, 默认 ease
 *     useOpacity: true, // 可选, 滑动的时候是否透明, 默认true
 *   });
 */
;(function($){
  /**
   * 
   * @param {Object} options 选项
   */
  function SwipeCard(options) {
    this.$el = $(options.selector);
    this.itemSelector = options.itemSelector || 'li';
    this.$items = this.$el.children(this.itemSelector);

    // 旋转方向 'left' || 'right' || 'both'
    this.direction = options.direction || 'both';
    // 最大旋转角度
    this.maxAngle = options.maxAngle || 35;
    // 触发调整顺序时的角度
    this.triggerAngle = options.triggerAngle || 15;
    // 过渡效果设置
    this.transitionDuration = parseFloat(options.transitionDuration || '0.5');
    this.transitionTimingFunction = options.transitionTimingFunction || 'ease';

    // 最大旋转角度对应的滑动距离
    this.maxWidth = this.$items.width();
    this.elLength = this.$items.length;
    // 是否使用透明
    this.useOpacity = options.useOpacity === undefined? true : options.useOpacity;

    this.init();
    this.bindEvents();

  }
  SwipeCard.prototype = {
    constructor: SwipeCard,
    init: function() {
      this.$el.css({'position': 'relative', 'overflow': 'hidden'});
      var $item, position;
      this.$items.each(function() {
        $item = $(this);
        position = $item.position();
        $item.css({'position':'absolute', 'left': position.left, 'top': position.top});
        $item.data('origin-opacity', $item.css('opacity'));
      });
    },
    // 绑定事件
    bindEvents: function() {
      var itemSelector = this.itemSelector;
      var direction = this.direction;
      var maxAngle = this.maxAngle;
      var triggerAngle = this.triggerAngle;
      var maxWidth = this.maxWidth;
      var rotate = this.rotate.bind(this);
      var restore = this.restore.bind(this);
      var reOrder = this.reOrder.bind(this);
      var $items = this.$items;
      var startX, endX, touch, currentLength = 0, prevLength ,angle;
      this.$el
        .delegate(itemSelector, 'touchstart', function(e) {
          $items.css('transition','none');
          startX = e.touches[0].pageX;
          return false;
        }.bind(this))
        .delegate(itemSelector, 'touchmove', function(e) {
          // 上一次偏移距离
          prevLength = currentLength;

          // 当次计算偏移距离
          endX = e.touches[0].pageX;
          currentLength = endX - startX;
          currentLength = currentLength > maxWidth ? maxWidth : currentLength;
          // 计算相应比例角度
          angle = maxAngle * currentLength/maxWidth;
          // 旋转各个卡片
          (this.checkDirection(angle) && rotate(angle));
          return false;
        }.bind(this))
        .delegate(itemSelector, 'touchend', function(e) {
            if (!this.checkDirection(angle)) {
              return;
            }
            if ((angle < -triggerAngle && currentLength <= prevLength) 
                || (angle > triggerAngle && currentLength >= prevLength)
               ){
              reOrder(angle);
            } else {
              restore();
            }
            return false;
        }.bind(this));

        this.$el.click(function(){
          $(this).toggleClass('active');
        })
    },

    checkDirection: function(angle) {
      var direction = this.direction;
      return (direction == 'both' 
            || (direction == 'left' && angle <=0)
            || (direction == 'right' && angle >=0)
          );
    },
    // 旋转卡片
    rotate: function(angle) {
      var $items = this.$items;
      var calFactor = this.calFactor.bind(this);
      var useOpacity = this.useOpacity;
      var transformOrigin = angle>0 ? 'right bottom' : 'left bottom';
      var $item, css = {}, factor, transform ;
      $items.each(function(index) {
        $item = $(this);
        factor = calFactor(index);
        transform  = 'rotateZ(' + angle * factor  + 'deg)';
        css = {
          '-webkit-transform-origin': transformOrigin,
          '-moz-transform-origin': transformOrigin,
          '-ms-transform-origin': transformOrigin,
          'transform-origin': transformOrigin,
          '-webkit-transform': transform,
          '-moz-transform': transform,
          '-ms-transform': transform,
          'transform': transform,
          '-webkit-transition': 'none',
          '-moz-transition': 'none',
          '-ms-transition': 'none',
          'transition': 'none',
          'opacity': useOpacity? (1-factor/2) : $item.data('origin-opacity')
        };
        $item.css(css);
      });
    },
    // 恢复卡片
    restore: function() {
      var $items = this.$items;
      var $item;
      var transition = 'all ' + this.transitionDuration + 's ' + this.transitionTimingFunction;
      $items.each(function(index) {
        $item = $(this);
        $item.css({
          '-webkit-transform': 'rotateZ(0deg)',
          '-moz-transform': 'rotateZ(0deg)',
          '-ms-transform': 'rotateZ(0deg)',
          'transform': 'rotateZ(0deg)',
          'opacity': $item.data('origin-opacity'),
          '-webkit-transition': transition,
          '-moz-transition': transition,
          '-ms-transition': transition,
          'transition': transition
        });
      });
    },

    // 调整顺序
    reOrder: function(angle) {
      // 由于$items保存在内存中, 它不会重新从dom中获取, 所以要手动调整$items元素的顺序
      var $items = this.$items;
      var topEl = [].pop.call($items);
      [].unshift.call($items, topEl);
      var $topEl = $(topEl);
      
      var originLeft = $topEl.css('left');

      var width = $topEl.width();
      var marginLeft = parseFloat($topEl.css('margin-left'));
      var marginRight = parseFloat($topEl.css('margin-right'));
      var css = {'opacity': 0};
      css.left = angle < 0 ? (-width - marginRight + 'px') : (this.$el.width() - marginLeft);
      $topEl.css(css);

      setTimeout(function() {
        $topEl.parent().prepend($topEl);
        $topEl.css({
          '-webkit-transition': 'none',
          '-moz-transition': 'none',
          '-ms-transition': 'none',
          'transition': 'none',
          'left': originLeft,
          'opacity':$topEl.data('origin-opacity')
        });
      }.bind(this), this.transitionDuration* 1000);

      // 重置旋转
      this.restore();
    },

    calFactor: function(index) {
      return Math.pow(index/this.elLength, 2);
    }
  }

  $.fn.swipeCard = function(options) {
    options = options || {};
    options.selector = this;
    return new SwipeCard(options);
  }

})($)

