/* ========================================================================
 * Bootstrap: affix.js v3.3.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.1'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && colliderTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $('body').height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: alert.js v3.3.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.1'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: button.js v3.3.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.1'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);
;
+function($){var Carousel=function(element,options){this.$element=$(element);this.$indicators=this.$element.find(".carousel-indicators");this.options=options;this.paused=this.sliding=this.interval=this.$active=this.$items=null;this.options.keyboard&&this.$element.on("keydown.bs.carousel",$.proxy(this.keydown,this));this.options.pause=="hover"&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",$.proxy(this.pause,this)).on("mouseleave.bs.carousel",$.proxy(this.cycle,
this))};Carousel.VERSION="3.3.1";Carousel.TRANSITION_DURATION=600;Carousel.DEFAULTS={interval:5E3,pause:"hover",wrap:true,keyboard:true};Carousel.prototype.keydown=function(e){if(/input|textarea/i.test(e.target.tagName))return;switch(e.which){case 37:this.prev();break;case 39:this.next();break;default:return}e.preventDefault()};Carousel.prototype.cycle=function(e){e||(this.paused=false);this.interval&&clearInterval(this.interval);this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,
this),this.options.interval));return this};Carousel.prototype.getItemIndex=function(item){this.$items=item.parent().children(".item");return this.$items.index(item||this.$active)};Carousel.prototype.getItemForDirection=function(direction,active){var delta=direction=="prev"?-1:1;var activeIndex=this.getItemIndex(active);var itemIndex=(activeIndex+delta)%this.$items.length;return this.$items.eq(itemIndex)};Carousel.prototype.to=function(pos){var that=this;var activeIndex=this.getItemIndex(this.$active=
this.$element.find(".item.active"));if(pos>this.$items.length-1||pos<0)return;if(this.sliding)return this.$element.one("slid.bs.carousel",function(){that.to(pos)});if(activeIndex==pos)return this.pause().cycle();return this.slide(pos>activeIndex?"next":"prev",this.$items.eq(pos))};Carousel.prototype.pause=function(e){e||(this.paused=true);if(this.$element.find(".next, .prev").length&&$.support.transition){this.$element.trigger($.support.transition.end);this.cycle(true)}this.interval=clearInterval(this.interval);
return this};Carousel.prototype.next=function(){if(this.sliding)return;return this.slide("next")};Carousel.prototype.prev=function(){if(this.sliding)return;return this.slide("prev")};Carousel.prototype.slide=function(type,next){var $active=this.$element.find(".item.active");var $next=next||this.getItemForDirection(type,$active);var isCycling=this.interval;var direction=type=="next"?"left":"right";var fallback=type=="next"?"first":"last";var that=this;if(!$next.length){if(!this.options.wrap)return;
$next=this.$element.find(".item")[fallback]()}if($next.hasClass("active"))return this.sliding=false;var relatedTarget=$next[0];var slideEvent=$.Event("slide.bs.carousel",{relatedTarget:relatedTarget,direction:direction});this.$element.trigger(slideEvent);if(slideEvent.isDefaultPrevented())return;this.sliding=true;isCycling&&this.pause();if(this.$indicators.length){this.$indicators.find(".active").removeClass("active");var $nextIndicator=$(this.$indicators.children()[this.getItemIndex($next)]);$nextIndicator&&
$nextIndicator.addClass("active")}var slidEvent=$.Event("slid.bs.carousel",{relatedTarget:relatedTarget,direction:direction});if($.support.transition&&this.$element.hasClass("slide")){$next.addClass(type);$next[0].offsetWidth;$active.addClass(direction);$next.addClass(direction);$active.one("bsTransitionEnd",function(){$next.removeClass([type,direction].join(" ")).addClass("active");$active.removeClass(["active",direction].join(" "));that.sliding=false;setTimeout(function(){that.$element.trigger(slidEvent)},
0)}).emulateTransitionEnd(Carousel.TRANSITION_DURATION)}else{$active.removeClass("active");$next.addClass("active");this.sliding=false;this.$element.trigger(slidEvent)}isCycling&&this.cycle();return this};function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data("bs.carousel");var options=$.extend({},Carousel.DEFAULTS,$this.data(),typeof option=="object"&&option);var action=typeof option=="string"?option:options.slide;if(!data)$this.data("bs.carousel",data=new Carousel(this,
options));if(typeof option=="number")data.to(option);else if(action)data[action]();else if(options.interval)data.pause().cycle()})}var old=$.fn.carousel;$.fn.carousel=Plugin;$.fn.carousel.Constructor=Carousel;$.fn.carousel.noConflict=function(){$.fn.carousel=old;return this};var clickHandler=function(e){var href;var $this=$(this);var $target=$($this.attr("data-target")||(href=$this.attr("href"))&&href.replace(/.*(?=#[^\s]+$)/,""));if(!$target.hasClass("carousel"))return;var options=$.extend({},$target.data(),
$this.data());var slideIndex=$this.attr("data-slide-to");if(slideIndex)options.interval=false;Plugin.call($target,options);if(slideIndex)$target.data("bs.carousel").to(slideIndex);e.preventDefault()};$(document).on("click.bs.carousel.data-api","[data-slide]",clickHandler).on("click.bs.carousel.data-api","[data-slide-to]",clickHandler);$(window).on("load",function(){$('[data-ride="carousel"]').each(function(){var $carousel=$(this);Plugin.call($carousel,$carousel.data())})})}(jQuery);;
/* ========================================================================
 * Bootstrap: collapse.js v3.3.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);
;
+function($){var backdrop=".dropdown-backdrop";var toggle='[data-toggle="dropdown"]';var Dropdown=function(element){$(element).on("click.bs.dropdown",this.toggle)};Dropdown.VERSION="3.3.1";Dropdown.prototype.toggle=function(e){var $this=$(this);if($this.is(".disabled, :disabled"))return;var $parent=getParent($this);var isActive=$parent.hasClass("open");clearMenus();if(!isActive){if("ontouchstart"in document.documentElement&&!$parent.closest(".navbar-nav").length)$('<div class="dropdown-backdrop"/>').insertAfter($(this)).on("click",
clearMenus);var relatedTarget={relatedTarget:this};$parent.trigger(e=$.Event("show.bs.dropdown",relatedTarget));if(e.isDefaultPrevented())return;$this.trigger("focus").attr("aria-expanded","true");$parent.toggleClass("open").trigger("shown.bs.dropdown",relatedTarget)}return false};Dropdown.prototype.keydown=function(e){if(!/(38|40|27|32)/.test(e.which)||/input|textarea/i.test(e.target.tagName))return;var $this=$(this);e.preventDefault();e.stopPropagation();if($this.is(".disabled, :disabled"))return;
var $parent=getParent($this);var isActive=$parent.hasClass("open");if(!isActive&&e.which!=27||isActive&&e.which==27){if(e.which==27)$parent.find(toggle).trigger("focus");return $this.trigger("click")}var desc=" li:not(.divider):visible a";var $items=$parent.find('[role="menu"]'+desc+', [role="listbox"]'+desc);if(!$items.length)return;var index=$items.index(e.target);if(e.which==38&&index>0)index--;if(e.which==40&&index<$items.length-1)index++;if(!~index)index=0;$items.eq(index).trigger("focus")};
function clearMenus(e){if(e&&e.which===3)return;$(backdrop).remove();$(toggle).each(function(){var $this=$(this);var $parent=getParent($this);var relatedTarget={relatedTarget:this};if(!$parent.hasClass("open"))return;$parent.trigger(e=$.Event("hide.bs.dropdown",relatedTarget));if(e.isDefaultPrevented())return;$this.attr("aria-expanded","false");$parent.removeClass("open").trigger("hidden.bs.dropdown",relatedTarget)})}function getParent($this){var selector=$this.attr("data-target");if(!selector){selector=
$this.attr("href");selector=selector&&/#[A-Za-z]/.test(selector)&&selector.replace(/.*(?=#[^\s]*$)/,"")}var $parent=selector&&$(selector);return $parent&&$parent.length?$parent:$this.parent()}function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data("bs.dropdown");if(!data)$this.data("bs.dropdown",data=new Dropdown(this));if(typeof option=="string")data[option].call($this)})}var old=$.fn.dropdown;$.fn.dropdown=Plugin;$.fn.dropdown.Constructor=Dropdown;$.fn.dropdown.noConflict=
function(){$.fn.dropdown=old;return this};$(document).on("click.bs.dropdown.data-api",clearMenus).on("click.bs.dropdown.data-api",".dropdown form",function(e){e.stopPropagation()}).on("click.bs.dropdown.data-api",toggle,Dropdown.prototype.toggle).on("keydown.bs.dropdown.data-api",toggle,Dropdown.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="menu"]',Dropdown.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="listbox"]',Dropdown.prototype.keydown)}(jQuery);;
+function($){var Modal=function(element,options){this.options=options;this.$body=$(document.body);this.$element=$(element);this.$backdrop=this.isShown=null;this.scrollbarWidth=0;if(this.options.remote)this.$element.find(".modal-content").load(this.options.remote,$.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};Modal.VERSION="3.3.1";Modal.TRANSITION_DURATION=300;Modal.BACKDROP_TRANSITION_DURATION=150;Modal.DEFAULTS={backdrop:true,keyboard:true,show:true};Modal.prototype.toggle=
function(_relatedTarget){return this.isShown?this.hide():this.show(_relatedTarget)};Modal.prototype.show=function(_relatedTarget){var that=this;var e=$.Event("show.bs.modal",{relatedTarget:_relatedTarget});this.$element.trigger(e);if(this.isShown||e.isDefaultPrevented())return;this.isShown=true;this.checkScrollbar();this.setScrollbar();this.$body.addClass("modal-open");this.escape();this.resize();this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',$.proxy(this.hide,this));this.backdrop(function(){var transition=
$.support.transition&&that.$element.hasClass("fade");if(!that.$element.parent().length)that.$element.appendTo(that.$body);that.$element.show().scrollTop(0);if(that.options.backdrop)that.adjustBackdrop();that.adjustDialog();if(transition)that.$element[0].offsetWidth;that.$element.addClass("in").attr("aria-hidden",false);that.enforceFocus();var e=$.Event("shown.bs.modal",{relatedTarget:_relatedTarget});transition?that.$element.find(".modal-dialog").one("bsTransitionEnd",function(){that.$element.trigger("focus").trigger(e)}).emulateTransitionEnd(Modal.TRANSITION_DURATION):
that.$element.trigger("focus").trigger(e)})};Modal.prototype.hide=function(e){if(e)e.preventDefault();e=$.Event("hide.bs.modal");this.$element.trigger(e);if(!this.isShown||e.isDefaultPrevented())return;this.isShown=false;this.escape();this.resize();$(document).off("focusin.bs.modal");this.$element.removeClass("in").attr("aria-hidden",true).off("click.dismiss.bs.modal");$.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",$.proxy(this.hideModal,this)).emulateTransitionEnd(Modal.TRANSITION_DURATION):
this.hideModal()};Modal.prototype.enforceFocus=function(){$(document).off("focusin.bs.modal").on("focusin.bs.modal",$.proxy(function(e){if(this.$element[0]!==e.target&&!this.$element.has(e.target).length)this.$element.trigger("focus")},this))};Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard)this.$element.on("keydown.dismiss.bs.modal",$.proxy(function(e){e.which==27&&this.hide()},this));else if(!this.isShown)this.$element.off("keydown.dismiss.bs.modal")};Modal.prototype.resize=
function(){if(this.isShown)$(window).on("resize.bs.modal",$.proxy(this.handleUpdate,this));else $(window).off("resize.bs.modal")};Modal.prototype.hideModal=function(){var that=this;this.$element.hide();this.backdrop(function(){that.$body.removeClass("modal-open");that.resetAdjustments();that.resetScrollbar();that.$element.trigger("hidden.bs.modal")})};Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove();this.$backdrop=null};Modal.prototype.backdrop=function(callback){var that=
this;var animate=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate;this.$backdrop=$('<div class="modal-backdrop '+animate+'" />').prependTo(this.$element).on("click.dismiss.bs.modal",$.proxy(function(e){if(e.target!==e.currentTarget)return;this.options.backdrop=="static"?this.$element[0].focus.call(this.$element[0]):this.hide.call(this)},this));if(doAnimate)this.$backdrop[0].offsetWidth;this.$backdrop.addClass("in");if(!callback)return;
doAnimate?this.$backdrop.one("bsTransitionEnd",callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callback()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var callbackRemove=function(){that.removeBackdrop();callback&&callback()};$.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callbackRemove()}else if(callback)callback()};Modal.prototype.handleUpdate=
function(){if(this.options.backdrop)this.adjustBackdrop();this.adjustDialog()};Modal.prototype.adjustBackdrop=function(){this.$backdrop.css("height",0).css("height",this.$element[0].scrollHeight)};Modal.prototype.adjustDialog=function(){var modalIsOverflowing=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&modalIsOverflowing?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!modalIsOverflowing?this.scrollbarWidth:
""})};Modal.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})};Modal.prototype.checkScrollbar=function(){this.bodyIsOverflowing=document.body.scrollHeight>document.documentElement.clientHeight;this.scrollbarWidth=this.measureScrollbar()};Modal.prototype.setScrollbar=function(){var bodyPad=parseInt(this.$body.css("padding-right")||0,10);if(this.bodyIsOverflowing)this.$body.css("padding-right",bodyPad+this.scrollbarWidth)};Modal.prototype.resetScrollbar=function(){this.$body.css("padding-right",
"")};Modal.prototype.measureScrollbar=function(){var scrollDiv=document.createElement("div");scrollDiv.className="modal-scrollbar-measure";this.$body.append(scrollDiv);var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth;this.$body[0].removeChild(scrollDiv);return scrollbarWidth};function Plugin(option,_relatedTarget){return this.each(function(){var $this=$(this);var data=$this.data("bs.modal");var options=$.extend({},Modal.DEFAULTS,$this.data(),typeof option=="object"&&option);if(!data)$this.data("bs.modal",
data=new Modal(this,options));if(typeof option=="string")data[option](_relatedTarget);else if(options.show)data.show(_relatedTarget)})}var old=$.fn.modal;$.fn.modal=Plugin;$.fn.modal.Constructor=Modal;$.fn.modal.noConflict=function(){$.fn.modal=old;return this};$(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(e){var $this=$(this);var href=$this.attr("href");var $target=$($this.attr("data-target")||href&&href.replace(/.*(?=#[^\s]+$)/,""));var option=$target.data("bs.modal")?
"toggle":$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data());if($this.is("a"))e.preventDefault();$target.one("show.bs.modal",function(showEvent){if(showEvent.isDefaultPrevented())return;$target.one("hidden.bs.modal",function(){$this.is(":visible")&&$this.trigger("focus")})});Plugin.call($target,option,this)})}(jQuery);;
+function($){var Tooltip=function(element,options){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null;this.init("tooltip",element,options)};Tooltip.VERSION="3.3.1";Tooltip.TRANSITION_DURATION=150;Tooltip.DEFAULTS={animation:true,placement:"top",selector:false,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:false,container:false,viewport:{selector:"body",
padding:0}};Tooltip.prototype.init=function(type,element,options){this.enabled=true;this.type=type;this.$element=$(element);this.options=this.getOptions(options);this.$viewport=this.options.viewport&&$(this.options.viewport.selector||this.options.viewport);var triggers=this.options.trigger.split(" ");for(var i=triggers.length;i--;){var trigger=triggers[i];if(trigger=="click")this.$element.on("click."+this.type,this.options.selector,$.proxy(this.toggle,this));else if(trigger!="manual"){var eventIn=
trigger=="hover"?"mouseenter":"focusin";var eventOut=trigger=="hover"?"mouseleave":"focusout";this.$element.on(eventIn+"."+this.type,this.options.selector,$.proxy(this.enter,this));this.$element.on(eventOut+"."+this.type,this.options.selector,$.proxy(this.leave,this))}}this.options.selector?this._options=$.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()};Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS};Tooltip.prototype.getOptions=function(options){options=
$.extend({},this.getDefaults(),this.$element.data(),options);if(options.delay&&typeof options.delay=="number")options.delay={show:options.delay,hide:options.delay};return options};Tooltip.prototype.getDelegateOptions=function(){var options={};var defaults=this.getDefaults();this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value});return options};Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data("bs."+
this.type);if(self&&self.$tip&&self.$tip.is(":visible")){self.hoverState="in";return}if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions());$(obj.currentTarget).data("bs."+this.type,self)}clearTimeout(self.timeout);self.hoverState="in";if(!self.options.delay||!self.options.delay.show)return self.show();self.timeout=setTimeout(function(){if(self.hoverState=="in")self.show()},self.options.delay.show)};Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?
obj:$(obj.currentTarget).data("bs."+this.type);if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions());$(obj.currentTarget).data("bs."+this.type,self)}clearTimeout(self.timeout);self.hoverState="out";if(!self.options.delay||!self.options.delay.hide)return self.hide();self.timeout=setTimeout(function(){if(self.hoverState=="out")self.hide()},self.options.delay.hide)};Tooltip.prototype.show=function(){var e=$.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(e);
var inDom=$.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(e.isDefaultPrevented()||!inDom)return;var that=this;var $tip=this.tip();var tipId=this.getUID(this.type);this.setContent();$tip.attr("id",tipId);this.$element.attr("aria-describedby",tipId);if(this.options.animation)$tip.addClass("fade");var placement=typeof this.options.placement=="function"?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement;var autoToken=/\s?auto?\s?/i;var autoPlace=
autoToken.test(placement);if(autoPlace)placement=placement.replace(autoToken,"")||"top";$tip.detach().css({top:0,left:0,display:"block"}).addClass(placement).data("bs."+this.type,this);this.options.container?$tip.appendTo(this.options.container):$tip.insertAfter(this.$element);var pos=this.getPosition();var actualWidth=$tip[0].offsetWidth;var actualHeight=$tip[0].offsetHeight;if(autoPlace){var orgPlacement=placement;var $container=this.options.container?$(this.options.container):this.$element.parent();
var containerDim=this.getPosition($container);placement=placement=="bottom"&&pos.bottom+actualHeight>containerDim.bottom?"top":placement=="top"&&pos.top-actualHeight<containerDim.top?"bottom":placement=="right"&&pos.right+actualWidth>containerDim.width?"left":placement=="left"&&pos.left-actualWidth<containerDim.left?"right":placement;$tip.removeClass(orgPlacement).addClass(placement)}var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight);this.applyPlacement(calculatedOffset,
placement);var complete=function(){var prevHoverState=that.hoverState;that.$element.trigger("shown.bs."+that.type);that.hoverState=null;if(prevHoverState=="out")that.leave(that)};$.support.transition&&this.$tip.hasClass("fade")?$tip.one("bsTransitionEnd",complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()}};Tooltip.prototype.applyPlacement=function(offset,placement){var $tip=this.tip();var width=$tip[0].offsetWidth;var height=$tip[0].offsetHeight;var marginTop=parseInt($tip.css("margin-top"),
10);var marginLeft=parseInt($tip.css("margin-left"),10);if(isNaN(marginTop))marginTop=0;if(isNaN(marginLeft))marginLeft=0;offset.top=offset.top+marginTop;offset.left=offset.left+marginLeft;$.offset.setOffset($tip[0],$.extend({using:function(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)})}},offset),0);$tip.addClass("in");var actualWidth=$tip[0].offsetWidth;var actualHeight=$tip[0].offsetHeight;if(placement=="top"&&actualHeight!=height)offset.top=offset.top+height-actualHeight;
var delta=this.getViewportAdjustedDelta(placement,offset,actualWidth,actualHeight);if(delta.left)offset.left+=delta.left;else offset.top+=delta.top;var isVertical=/top|bottom/.test(placement);var arrowDelta=isVertical?delta.left*2-width+actualWidth:delta.top*2-height+actualHeight;var arrowOffsetPosition=isVertical?"offsetWidth":"offsetHeight";$tip.offset(offset);this.replaceArrow(arrowDelta,$tip[0][arrowOffsetPosition],isVertical)};Tooltip.prototype.replaceArrow=function(delta,dimension,isHorizontal){this.arrow().css(isHorizontal?
"left":"top",50*(1-delta/dimension)+"%").css(isHorizontal?"top":"left","")};Tooltip.prototype.setContent=function(){var $tip=this.tip();var title=this.getTitle();$tip.find(".tooltip-inner")[this.options.html?"html":"text"](title);$tip.removeClass("fade in top bottom left right")};Tooltip.prototype.hide=function(callback){var that=this;var $tip=this.tip();var e=$.Event("hide.bs."+this.type);function complete(){if(that.hoverState!="in")$tip.detach();that.$element.removeAttr("aria-describedby").trigger("hidden.bs."+
that.type);callback&&callback()}this.$element.trigger(e);if(e.isDefaultPrevented())return;$tip.removeClass("in");$.support.transition&&this.$tip.hasClass("fade")?$tip.one("bsTransitionEnd",complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete();this.hoverState=null;return this};Tooltip.prototype.fixTitle=function(){var $e=this.$element;if($e.attr("title")||typeof $e.attr("data-original-title")!="string")$e.attr("data-original-title",$e.attr("title")||"").attr("title","")};Tooltip.prototype.hasContent=
function(){return this.getTitle()};Tooltip.prototype.getPosition=function($element){$element=$element||this.$element;var el=$element[0];var isBody=el.tagName=="BODY";var elRect=el.getBoundingClientRect();if(elRect.width==null)elRect=$.extend({},elRect,{width:elRect.right-elRect.left,height:elRect.bottom-elRect.top});var elOffset=isBody?{top:0,left:0}:$element.offset();var scroll={scroll:isBody?document.documentElement.scrollTop||document.body.scrollTop:$element.scrollTop()};var outerDims=isBody?{width:$(window).width(),
height:$(window).height()}:null;return $.extend({},elRect,scroll,outerDims,elOffset)};Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=="bottom"?{top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}:placement=="top"?{top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}:placement=="left"?{top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}:{top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width}};
Tooltip.prototype.getViewportAdjustedDelta=function(placement,pos,actualWidth,actualHeight){var delta={top:0,left:0};if(!this.$viewport)return delta;var viewportPadding=this.options.viewport&&this.options.viewport.padding||0;var viewportDimensions=this.getPosition(this.$viewport);if(/right|left/.test(placement)){var topEdgeOffset=pos.top-viewportPadding-viewportDimensions.scroll;var bottomEdgeOffset=pos.top+viewportPadding-viewportDimensions.scroll+actualHeight;if(topEdgeOffset<viewportDimensions.top)delta.top=
viewportDimensions.top-topEdgeOffset;else if(bottomEdgeOffset>viewportDimensions.top+viewportDimensions.height)delta.top=viewportDimensions.top+viewportDimensions.height-bottomEdgeOffset}else{var leftEdgeOffset=pos.left-viewportPadding;var rightEdgeOffset=pos.left+viewportPadding+actualWidth;if(leftEdgeOffset<viewportDimensions.left)delta.left=viewportDimensions.left-leftEdgeOffset;else if(rightEdgeOffset>viewportDimensions.width)delta.left=viewportDimensions.left+viewportDimensions.width-rightEdgeOffset}return delta};
Tooltip.prototype.getTitle=function(){var title;var $e=this.$element;var o=this.options;title=$e.attr("data-original-title")||(typeof o.title=="function"?o.title.call($e[0]):o.title);return title};Tooltip.prototype.getUID=function(prefix){do prefix+=~~(Math.random()*1E6);while(document.getElementById(prefix));return prefix};Tooltip.prototype.tip=function(){return this.$tip=this.$tip||$(this.options.template)};Tooltip.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")};
Tooltip.prototype.enable=function(){this.enabled=true};Tooltip.prototype.disable=function(){this.enabled=false};Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled};Tooltip.prototype.toggle=function(e){var self=this;if(e){self=$(e.currentTarget).data("bs."+this.type);if(!self){self=new this.constructor(e.currentTarget,this.getDelegateOptions());$(e.currentTarget).data("bs."+this.type,self)}}self.tip().hasClass("in")?self.leave(self):self.enter(self)};Tooltip.prototype.destroy=function(){var that=
this;clearTimeout(this.timeout);this.hide(function(){that.$element.off("."+that.type).removeData("bs."+that.type)})};function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data("bs.tooltip");var options=typeof option=="object"&&option;var selector=options&&options.selector;if(!data&&option=="destroy")return;if(selector){if(!data)$this.data("bs.tooltip",data={});if(!data[selector])data[selector]=new Tooltip(this,options)}else if(!data)$this.data("bs.tooltip",data=new Tooltip(this,
options));if(typeof option=="string")data[option]()})}var old=$.fn.tooltip;$.fn.tooltip=Plugin;$.fn.tooltip.Constructor=Tooltip;$.fn.tooltip.noConflict=function(){$.fn.tooltip=old;return this}}(jQuery);;
+function($){var Popover=function(element,options){this.init("popover",element,options)};if(!$.fn.tooltip)throw new Error("Popover requires tooltip.js");Popover.VERSION="3.3.1";Popover.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'});Popover.prototype=$.extend({},$.fn.tooltip.Constructor.prototype);Popover.prototype.constructor=
Popover;Popover.prototype.getDefaults=function(){return Popover.DEFAULTS};Popover.prototype.setContent=function(){var $tip=this.tip();var title=this.getTitle();var content=this.getContent();$tip.find(".popover-title")[this.options.html?"html":"text"](title);$tip.find(".popover-content").children().detach().end()[this.options.html?typeof content=="string"?"html":"append":"text"](content);$tip.removeClass("fade top bottom left right in");if(!$tip.find(".popover-title").html())$tip.find(".popover-title").hide()};
Popover.prototype.hasContent=function(){return this.getTitle()||this.getContent()};Popover.prototype.getContent=function(){var $e=this.$element;var o=this.options;return $e.attr("data-content")||(typeof o.content=="function"?o.content.call($e[0]):o.content)};Popover.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};Popover.prototype.tip=function(){if(!this.$tip)this.$tip=$(this.options.template);return this.$tip};function Plugin(option){return this.each(function(){var $this=
$(this);var data=$this.data("bs.popover");var options=typeof option=="object"&&option;var selector=options&&options.selector;if(!data&&option=="destroy")return;if(selector){if(!data)$this.data("bs.popover",data={});if(!data[selector])data[selector]=new Popover(this,options)}else if(!data)$this.data("bs.popover",data=new Popover(this,options));if(typeof option=="string")data[option]()})}var old=$.fn.popover;$.fn.popover=Plugin;$.fn.popover.Constructor=Popover;$.fn.popover.noConflict=function(){$.fn.popover=
old;return this}}(jQuery);;
+function($){function ScrollSpy(element,options){var process=$.proxy(this.process,this);this.$body=$("body");this.$scrollElement=$(element).is("body")?$(window):$(element);this.options=$.extend({},ScrollSpy.DEFAULTS,options);this.selector=(this.options.target||"")+" .nav li > a";this.offsets=[];this.targets=[];this.activeTarget=null;this.scrollHeight=0;this.$scrollElement.on("scroll.bs.scrollspy",process);this.refresh();this.process()}ScrollSpy.VERSION="3.3.1";ScrollSpy.DEFAULTS={offset:10};ScrollSpy.prototype.getScrollHeight=
function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)};ScrollSpy.prototype.refresh=function(){var offsetMethod="offset";var offsetBase=0;if(!$.isWindow(this.$scrollElement[0])){offsetMethod="position";offsetBase=this.$scrollElement.scrollTop()}this.offsets=[];this.targets=[];this.scrollHeight=this.getScrollHeight();var self=this;this.$body.find(this.selector).map(function(){var $el=$(this);var href=$el.data("target")||$el.attr("href");
var $href=/^#./.test(href)&&$(href);return $href&&$href.length&&$href.is(":visible")&&[[$href[offsetMethod]().top+offsetBase,href]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){self.offsets.push(this[0]);self.targets.push(this[1])})};ScrollSpy.prototype.process=function(){var scrollTop=this.$scrollElement.scrollTop()+this.options.offset;var scrollHeight=this.getScrollHeight();var maxScroll=this.options.offset+scrollHeight-this.$scrollElement.height();var offsets=this.offsets;var targets=
this.targets;var activeTarget=this.activeTarget;var i;if(this.scrollHeight!=scrollHeight)this.refresh();if(scrollTop>=maxScroll)return activeTarget!=(i=targets[targets.length-1])&&this.activate(i);if(activeTarget&&scrollTop<offsets[0]){this.activeTarget=null;return this.clear()}for(i=offsets.length;i--;)activeTarget!=targets[i]&&scrollTop>=offsets[i]&&(!offsets[i+1]||scrollTop<=offsets[i+1])&&this.activate(targets[i])};ScrollSpy.prototype.activate=function(target){this.activeTarget=target;this.clear();
var selector=this.selector+'[data-target="'+target+'"],'+this.selector+'[href="'+target+'"]';var active=$(selector).parents("li").addClass("active");if(active.parent(".dropdown-menu").length)active=active.closest("li.dropdown").addClass("active");active.trigger("activate.bs.scrollspy")};ScrollSpy.prototype.clear=function(){$(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data("bs.scrollspy");
var options=typeof option=="object"&&option;if(!data)$this.data("bs.scrollspy",data=new ScrollSpy(this,options));if(typeof option=="string")data[option]()})}var old=$.fn.scrollspy;$.fn.scrollspy=Plugin;$.fn.scrollspy.Constructor=ScrollSpy;$.fn.scrollspy.noConflict=function(){$.fn.scrollspy=old;return this};$(window).on("load.bs.scrollspy.data-api",function(){$('[data-spy="scroll"]').each(function(){var $spy=$(this);Plugin.call($spy,$spy.data())})})}(jQuery);;
+function($){var Tab=function(element){this.element=$(element)};Tab.VERSION="3.3.1";Tab.TRANSITION_DURATION=150;Tab.prototype.show=function(){var $this=this.element;var $ul=$this.closest("ul:not(.dropdown-menu)");var selector=$this.data("target");if(!selector){selector=$this.attr("href");selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,"")}if($this.parent("li").hasClass("active"))return;var $previous=$ul.find(".active:last a");var hideEvent=$.Event("hide.bs.tab",{relatedTarget:$this[0]});var showEvent=
$.Event("show.bs.tab",{relatedTarget:$previous[0]});$previous.trigger(hideEvent);$this.trigger(showEvent);if(showEvent.isDefaultPrevented()||hideEvent.isDefaultPrevented())return;var $target=$(selector);this.activate($this.closest("li"),$ul);this.activate($target,$target.parent(),function(){$previous.trigger({type:"hidden.bs.tab",relatedTarget:$this[0]});$this.trigger({type:"shown.bs.tab",relatedTarget:$previous[0]})})};Tab.prototype.activate=function(element,container,callback){var $active=container.find("> .active");
var transition=callback&&$.support.transition&&($active.length&&$active.hasClass("fade")||!!container.find("> .fade").length);function next(){$active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",false);element.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",true);if(transition){element[0].offsetWidth;element.addClass("in")}else element.removeClass("fade");if(element.parent(".dropdown-menu"))element.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",
true);callback&&callback()}$active.length&&transition?$active.one("bsTransitionEnd",next).emulateTransitionEnd(Tab.TRANSITION_DURATION):next();$active.removeClass("in")};function Plugin(option){return this.each(function(){var $this=$(this);var data=$this.data("bs.tab");if(!data)$this.data("bs.tab",data=new Tab(this));if(typeof option=="string")data[option]()})}var old=$.fn.tab;$.fn.tab=Plugin;$.fn.tab.Constructor=Tab;$.fn.tab.noConflict=function(){$.fn.tab=old;return this};var clickHandler=function(e){e.preventDefault();
Plugin.call($(this),"show")};$(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',clickHandler).on("click.bs.tab.data-api",'[data-toggle="pill"]',clickHandler)}(jQuery);;
+function($){function transitionEnd(){var el=document.createElement("bootstrap");var transEndEventNames={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var name in transEndEventNames)if(el.style[name]!==undefined)return{end:transEndEventNames[name]};return false}$.fn.emulateTransitionEnd=function(duration){var called=false;var $el=this;$(this).one("bsTransitionEnd",function(){called=true});var callback=
function(){if(!called)$($el).trigger($.support.transition.end)};setTimeout(callback,duration);return this};$(function(){$.support.transition=transitionEnd();if(!$.support.transition)return;$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}})}(jQuery);;
/*!
 * SmartMenus jQuery Plugin - v0.9.7 - August 25, 2014
 * http://www.smartmenus.org/
 *
 * Copyright 2014 Vasil Dinkov, Vadikom Web Ltd.
 * http://vadikom.com
 *
 * Licensed MIT
 */

(function($) {

	var menuTrees = [],
		IE = !!window.createPopup, // detect it for the iframe shim
		mouse = false, // optimize for touch by default - we will detect for mouse input
		mouseDetectionEnabled = false;

	// Handle detection for mouse input (i.e. desktop browsers, tablets with a mouse, etc.)
	function initMouseDetection(disable) {
		var eNS = '.smartmenus_mouse';
		if (!mouseDetectionEnabled && !disable) {
			// if we get two consecutive mousemoves within 2 pixels from each other and within 300ms, we assume a real mouse/cursor is present
			// in practice, this seems like impossible to trick unintentianally with a real mouse and a pretty safe detection on touch devices (even with older browsers that do not support touch events)
			var firstTime = true,
				lastMove = null;
			$(document).bind(getEventsNS([
				['mousemove', function(e) {
					var thisMove = { x: e.pageX, y: e.pageY, timeStamp: new Date().getTime() };
					if (lastMove) {
						var deltaX = Math.abs(lastMove.x - thisMove.x),
							deltaY = Math.abs(lastMove.y - thisMove.y);
	 					if ((deltaX > 0 || deltaY > 0) && deltaX <= 2 && deltaY <= 2 && thisMove.timeStamp - lastMove.timeStamp <= 300) {
							mouse = true;
							// if this is the first check after page load, check if we are not over some item by chance and call the mouseenter handler if yes
							if (firstTime) {
								var $a = $(e.target).closest('a');
								if ($a.is('a')) {
									$.each(menuTrees, function() {
										if ($.contains(this.$root[0], $a[0])) {
											this.itemEnter({ currentTarget: $a[0] });
											return false;
										}
									});
								}
								firstTime = false;
							}
						}
					}
					lastMove = thisMove;
				}],
				[touchEvents() ? 'touchstart' : 'pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut', function(e) {
					if (isTouchEvent(e.originalEvent)) {
						mouse = false;
					}
				}]
			], eNS));
			mouseDetectionEnabled = true;
		} else if (mouseDetectionEnabled && disable) {
			$(document).unbind(eNS);
			mouseDetectionEnabled = false;
		}
	}

	function isTouchEvent(e) {
		return !/^(4|mouse)$/.test(e.pointerType);
	}

	// we use this just to choose between toucn and pointer events when we need to, not for touch screen detection
	function touchEvents() {
		return 'ontouchstart' in window;
	}

	// returns a jQuery bind() ready object
	function getEventsNS(defArr, eNS) {
		if (!eNS) {
			eNS = '';
		}
		var obj = {};
		$.each(defArr, function(index, value) {
			obj[value[0].split(' ').join(eNS + ' ') + eNS] = value[1];
		});
		return obj;
	}

	$.SmartMenus = function(elm, options) {
		this.$root = $(elm);
		this.opts = options;
		this.rootId = ''; // internal
		this.$subArrow = null;
		this.subMenus = []; // all sub menus in the tree (UL elms) in no particular order (only real - e.g. UL's in mega sub menus won't be counted)
		this.activatedItems = []; // stores last activated A's for each level
		this.visibleSubMenus = []; // stores visible sub menus UL's
		this.showTimeout = 0;
		this.hideTimeout = 0;
		this.scrollTimeout = 0;
		this.clickActivated = false;
		this.zIndexInc = 0;
		this.$firstLink = null; // we'll use these for some tests
		this.$firstSub = null; // at runtime so we'll cache them
		this.disabled = false;
		this.$disableOverlay = null;
		this.isTouchScrolling = false;
		this.init();
	};

	$.extend($.SmartMenus, {
		hideAll: function() {
			$.each(menuTrees, function() {
				this.menuHideAll();
			});
		},
		destroy: function() {
			while (menuTrees.length) {
				menuTrees[0].destroy();
			}
			initMouseDetection(true);
		},
		prototype: {
			init: function(refresh) {
				var self = this;

				if (!refresh) {
					menuTrees.push(this);

					this.rootId = (new Date().getTime() + Math.random() + '').replace(/\D/g, '');

					if (this.$root.hasClass('sm-rtl')) {
						this.opts.rightToLeftSubMenus = true;
					}

					// init root (main menu)
					var eNS = '.smartmenus';
					this.$root
						.data('smartmenus', this)
						.attr('data-smartmenus-id', this.rootId)
						.dataSM('level', 1)
						.bind(getEventsNS([
							['mouseover focusin', $.proxy(this.rootOver, this)],
							['mouseout focusout', $.proxy(this.rootOut, this)]
						], eNS))
						.delegate('a', getEventsNS([
							['mouseenter', $.proxy(this.itemEnter, this)],
							['mouseleave', $.proxy(this.itemLeave, this)],
							['mousedown', $.proxy(this.itemDown, this)],
							['focus', $.proxy(this.itemFocus, this)],
							['blur', $.proxy(this.itemBlur, this)],
							['click', $.proxy(this.itemClick, this)],
							['touchend', $.proxy(this.itemTouchEnd, this)]
						], eNS));

					// hide menus on tap or click outside the root UL
					eNS += this.rootId;
					if (this.opts.hideOnClick) {
						$(document).bind(getEventsNS([
							['touchstart', $.proxy(this.docTouchStart, this)],
							['touchmove', $.proxy(this.docTouchMove, this)],
							['touchend', $.proxy(this.docTouchEnd, this)],
							// for Opera Mobile < 11.5, webOS browser, etc. we'll check click too
							['click', $.proxy(this.docClick, this)]
						], eNS));
					}
					// hide sub menus on resize
					$(window).bind(getEventsNS([['resize orientationchange', $.proxy(this.winResize, this)]], eNS));

					if (this.opts.subIndicators) {
						this.$subArrow = $('<span/>').addClass('d');
						if (this.opts.subIndicatorsText) {
							this.$subArrow.html(this.opts);
						}
					}

					// make sure mouse detection is enabled
					initMouseDetection();
				}

				// init sub menus
				this.$firstSub = this.$root.find('ul').each(function() { self.menuInit($(this)); }).eq(0);

				this.$firstLink = this.$root.find('a').eq(0);

				// find current item
				if (this.opts.markCurrentItem) {
					var reDefaultDoc = /(index|default)\.[^#\?\/]*/i,
						reHash = /#.*/,
						locHref = window.location.href.replace(reDefaultDoc, ''),
						locHrefNoHash = locHref.replace(reHash, '');
					this.$root.find('a').each(function() {
						var href = this.href.replace(reDefaultDoc, ''),
							$this = $(this);
						if (href == locHref || href == locHrefNoHash) {
							$this.addClass('current');
							if (self.opts.markCurrentTree) {
								$this.parent().parentsUntil('[data-smartmenus-id]', 'li').children('a').addClass('current');
							}
						}
					});
				}
			},
			destroy: function() {
				this.menuHideAll();
				var eNS = '.smartmenus';
				this.$root
					.removeData('smartmenus')
					.removeAttr('data-smartmenus-id')
					.removeDataSM('level')
					.unbind(eNS)
					.undelegate(eNS);
				eNS += this.rootId;
				$(document).unbind(eNS);
				$(window).unbind(eNS);
				if (this.opts.subIndicators) {
					this.$subArrow = null;
				}
				var self = this;
				$.each(this.subMenus, function() {
					if (this.hasClass('mega-menu')) {
						this.find('ul').removeDataSM('in-mega');
					}
					if (this.dataSM('shown-before')) {
						if (self.opts.subMenusMinWidth || self.opts.subMenusMaxWidth) {
							this.css({ width: '', minWidth: '', maxWidth: '' }).removeClass('sm-nowrap');
						}
						if (this.dataSM('scroll-arrows')) {
							this.dataSM('scroll-arrows').remove();
						}
						this.css({ zIndex: '', top: '', left: '', marginLeft: '', marginTop: '', display: '' });
					}
					if (self.opts.subIndicators) {
						this.dataSM('parent-a').removeClass('has-submenu').children('span.sub-arrow').remove();
					}
					this.removeDataSM('shown-before')
						.removeDataSM('ie-shim')
						.removeDataSM('scroll-arrows')
						.removeDataSM('parent-a')
						.removeDataSM('level')
						.removeDataSM('beforefirstshowfired')
						.parent().removeDataSM('sub');
				});
				if (this.opts.markCurrentItem) {
					this.$root.find('a.current').removeClass('current');
				}
				this.$root = null;
				this.$firstLink = null;
				this.$firstSub = null;
				if (this.$disableOverlay) {
					this.$disableOverlay.remove();
					this.$disableOverlay = null;
				}
				menuTrees.splice($.inArray(this, menuTrees), 1);
			},
			disable: function(noOverlay) {
				if (!this.disabled) {
					this.menuHideAll();
					// display overlay over the menu to prevent interaction
					if (!noOverlay && !this.opts.isPopup && this.$root.is(':visible')) {
						var pos = this.$root.offset();
						this.$disableOverlay = $('<div class="sm-jquery-disable-overlay"/>').css({
							position: 'absolute',
							top: pos.top,
							left: pos.left,
							width: this.$root.outerWidth(),
							height: this.$root.outerHeight(),
							zIndex: this.getStartZIndex(true),
							opacity: 0
						}).appendTo(document.body);
					}
					this.disabled = true;
				}
			},
			docClick: function(e) {
				if (this.isTouchScrolling) {
					this.isTouchScrolling = false;
					return;
				}
				// hide on any click outside the menu or on a menu link
				if (this.visibleSubMenus.length && !$.contains(this.$root[0], e.target) || $(e.target).is('a')) {
					this.menuHideAll();
				}
			},
			docTouchEnd: function(e) {
				if (!this.lastTouch) {
					return;
				}
				if (this.visibleSubMenus.length && (this.lastTouch.x2 === undefined || this.lastTouch.x1 == this.lastTouch.x2) && (this.lastTouch.y2 === undefined || this.lastTouch.y1 == this.lastTouch.y2) && (!this.lastTouch.target || !$.contains(this.$root[0], this.lastTouch.target))) {
					if (this.hideTimeout) {
						clearTimeout(this.hideTimeout);
						this.hideTimeout = 0;
					}
					// hide with a delay to prevent triggering accidental unwanted click on some page element
					var self = this;
					this.hideTimeout = setTimeout(function() { self.menuHideAll(); }, 350);
				}
				this.lastTouch = null;
			},
			docTouchMove: function(e) {
				if (!this.lastTouch) {
					return;
				}
				var touchPoint = e.originalEvent.touches[0];
				this.lastTouch.x2 = touchPoint.pageX;
				this.lastTouch.y2 = touchPoint.pageY;
			},
			docTouchStart: function(e) {
				var touchPoint = e.originalEvent.touches[0];
				this.lastTouch = { x1: touchPoint.pageX, y1: touchPoint.pageY, target: touchPoint.target };
			},
			enable: function() {
				if (this.disabled) {
					if (this.$disableOverlay) {
						this.$disableOverlay.remove();
						this.$disableOverlay = null;
					}
					this.disabled = false;
				}
			},
			getClosestMenu: function(elm) {
				var $closestMenu = $(elm).closest('ul');
				while ($closestMenu.dataSM('in-mega')) {
					$closestMenu = $closestMenu.parent().closest('ul');
				}
				return $closestMenu[0] || null;
			},
			getHeight: function($elm) {
				return this.getOffset($elm, true);
			},
			// returns precise width/height float values
			getOffset: function($elm, height) {
				var old;
				if ($elm.css('display') == 'none') {
					old = { position: $elm[0].style.position, visibility: $elm[0].style.visibility };
					$elm.css({ position: 'absolute', visibility: 'hidden' }).show();
				}
				var box = $elm[0].getBoundingClientRect && $elm[0].getBoundingClientRect(),
					val = box && (height ? box.height || box.bottom - box.top : box.width || box.right - box.left);
				if (!val && val !== 0) {
					val = height ? $elm[0].offsetHeight : $elm[0].offsetWidth;
				}
				if (old) {
					$elm.hide().css(old);
				}
				return val;
			},
			getStartZIndex: function(root) {
				var zIndex = parseInt(this[root ? '$root' : '$firstSub'].css('z-index'));
				if (!root && isNaN(zIndex)) {
					zIndex = parseInt(this.$root.css('z-index'));
				}
				return !isNaN(zIndex) ? zIndex : 1;
			},
			getTouchPoint: function(e) {
				return e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;
			},
			getViewport: function(height) {
				var name = height ? 'Height' : 'Width',
					val = document.documentElement['client' + name],
					val2 = window['inner' + name];
				if (val2) {
					val = Math.min(val, val2);
				}
				return val;
			},
			getViewportHeight: function() {
				return this.getViewport(true);
			},
			getViewportWidth: function() {
				return this.getViewport();
			},
			getWidth: function($elm) {
				return this.getOffset($elm);
			},
			handleEvents: function() {
				return !this.disabled && this.isCSSOn();
			},
			handleItemEvents: function($a) {
				return this.handleEvents() && !this.isLinkInMegaMenu($a);
			},
			isCollapsible: function() {
				return this.$firstSub.css('position') == 'static';
			},
			isCSSOn: function() {
				return this.$firstLink.css('display') == 'block';
			},
			isFixed: function() {
				var isFixed = this.$root.css('position') == 'fixed';
				if (!isFixed) {
					this.$root.parentsUntil('body').each(function() {
						if ($(this).css('position') == 'fixed') {
							isFixed = true;
							return false;
						}
					});
				}
				return isFixed;
			},
			isLinkInMegaMenu: function($a) {
				return !$a.parent().parent().dataSM('level');
			},
			isTouchMode: function() {
				return !mouse || this.isCollapsible();
			},
			itemActivate: function($a) {
				var $li = $a.parent(),
					$ul = $li.parent(),
					level = $ul.dataSM('level');
				// if for some reason the parent item is not activated (e.g. this is an API call to activate the item), activate all parent items first
				if (level > 1 && (!this.activatedItems[level - 2] || this.activatedItems[level - 2][0] != $ul.dataSM('parent-a')[0])) {
					var self = this;
					$($ul.parentsUntil('[data-smartmenus-id]', 'ul').get().reverse()).add($ul).each(function() {
						self.itemActivate($(this).dataSM('parent-a'));
					});
				}
				// hide any visible deeper level sub menus
				if (this.visibleSubMenus.length > level) {
					this.menuHideSubMenus(!this.activatedItems[level - 1] || this.activatedItems[level - 1][0] != $a[0] ? level - 1 : level);
				}
				// save new active item and sub menu for this level
				this.activatedItems[level - 1] = $a;
				this.visibleSubMenus[level - 1] = $ul;
				if (this.$root.triggerHandler('activate.smapi', $a[0]) === false) {
					return;
				}
				// show the sub menu if this item has one
				var $sub = $li.dataSM('sub');
				if ($sub && (this.isTouchMode() || (!this.opts.showOnClick || this.clickActivated))) {
					this.menuShow($sub);
				}
			},
			itemBlur: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				this.$root.triggerHandler('blur.smapi', $a[0]);
			},
			itemClick: function(e) {
				if (this.isTouchScrolling) {
					this.isTouchScrolling = false;
					e.stopPropagation();
					return false;
				}
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				$a.removeDataSM('mousedown');
				if (this.$root.triggerHandler('click.smapi', $a[0]) === false) {
					return false;
				}
				var $sub = $a.parent().dataSM('sub');
				if (this.isTouchMode()) {
					// undo fix: prevent the address bar on iPhone from sliding down when expanding a sub menu
					if ($a.dataSM('href')) {
						$a.attr('href', $a.dataSM('href')).removeDataSM('href');
					}
					// if the sub is not visible
					if ($sub && (!$sub.dataSM('shown-before') || !$sub.is(':visible'))) {
						// try to activate the item and show the sub
						this.itemActivate($a);
						// if "itemActivate" showed the sub, prevent the click so that the link is not loaded
						// if it couldn't show it, then the sub menus are disabled with an !important declaration (e.g. via mobile styles) so let the link get loaded
						if ($sub.is(':visible')) {
							return false;
						}
					}
				} else if (this.opts.showOnClick && $a.parent().parent().dataSM('level') == 1 && $sub) {
					this.clickActivated = true;
					this.menuShow($sub);
					return false;
				}
				if ($a.hasClass('disabled')) {
					return false;
				}
				if (this.$root.triggerHandler('select.smapi', $a[0]) === false) {
					return false;
				}
			},
			itemDown: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				$a.dataSM('mousedown', true);
			},
			itemEnter: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (!this.isTouchMode()) {
					if (this.showTimeout) {
						clearTimeout(this.showTimeout);
						this.showTimeout = 0;
					}
					var self = this;
					this.showTimeout = setTimeout(function() { self.itemActivate($a); }, this.opts.showOnClick && $a.parent().parent().dataSM('level') == 1 ? 1 : this.opts.showTimeout);
				}
				this.$root.triggerHandler('mouseenter.smapi', $a[0]);
			},
			itemFocus: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				// fix (the mousedown check): in some browsers a tap/click produces consecutive focus + click events so we don't need to activate the item on focus
				if ((!this.isTouchMode() || !$a.dataSM('mousedown')) && (!this.activatedItems.length || this.activatedItems[this.activatedItems.length - 1][0] != $a[0])) {
					this.itemActivate($a);
				}
				this.$root.triggerHandler('focus.smapi', $a[0]);
			},
			itemLeave: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (!this.isTouchMode()) {
					if ($a[0].blur) {
						$a[0].blur();
					}
					if (this.showTimeout) {
						clearTimeout(this.showTimeout);
						this.showTimeout = 0;
					}
				}
				$a.removeDataSM('mousedown');
				this.$root.triggerHandler('mouseleave.smapi', $a[0]);
			},
			itemTouchEnd: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				// prevent the address bar on iPhone from sliding down when expanding a sub menu
				var $sub = $a.parent().dataSM('sub');
				if ($a.attr('href').charAt(0) !== '#' && $sub && (!$sub.dataSM('shown-before') || !$sub.is(':visible'))) {
					$a.dataSM('href', $a.attr('href'));
					$a.attr('href', '#');
				}
			},
			menuFixLayout: function($ul) {
				// fixes a menu that is being shown for the first time
				if (!$ul.dataSM('shown-before')) {
					$ul.hide().dataSM('shown-before', true);
				}
			},
			menuHide: function($sub) {
				if (this.$root.triggerHandler('beforehide.smapi', $sub[0]) === false) {
					return;
				}
				$sub.stop(true, true);
				if ($sub.is(':visible')) {
					var complete = function() {
						// unset z-index
						$sub.css('z-index', '');
					};
					// if sub is collapsible (mobile view)
					if (this.isCollapsible()) {
						if (this.opts.collapsibleHideFunction) {
							this.opts.collapsibleHideFunction.call(this, $sub, complete);
						} else {
							$sub.hide(this.opts.collapsibleHideDuration, complete);
						}
					} else {
						if (this.opts.hideFunction) {
							this.opts.hideFunction.call(this, $sub, complete);
						} else {
							$sub.hide(this.opts.hideDuration, complete);
						}
					}
					// remove IE iframe shim
					if ($sub.dataSM('ie-shim')) {
						$sub.dataSM('ie-shim').remove();
					}
					// deactivate scrolling if it is activated for this sub
					if ($sub.dataSM('scroll')) {
						this.menuScrollStop($sub);
						$sub.css({ 'touch-action': '', '-ms-touch-action': '' })
							.unbind('.smartmenus_scroll').removeDataSM('scroll').dataSM('scroll-arrows').hide();
					}
					// unhighlight parent item
					$sub.dataSM('parent-a').removeClass('highlighted');
					var level = $sub.dataSM('level');
					this.activatedItems.splice(level - 1, 1);
					this.visibleSubMenus.splice(level - 1, 1);
					this.$root.triggerHandler('hide.smapi', $sub[0]);
				}
			},
			menuHideAll: function() {
				if (this.showTimeout) {
					clearTimeout(this.showTimeout);
					this.showTimeout = 0;
				}
				// hide all subs
				this.menuHideSubMenus();
				// hide root if it's popup
				if (this.opts.isPopup) {
					this.$root.stop(true, true);
					if (this.$root.is(':visible')) {
						if (this.opts.hideFunction) {
							this.opts.hideFunction.call(this, this.$root);
						} else {
							this.$root.hide(this.opts.hideDuration);
						}
						// remove IE iframe shim
						if (this.$root.dataSM('ie-shim')) {
							this.$root.dataSM('ie-shim').remove();
						}
					}
				}
				this.activatedItems = [];
				this.visibleSubMenus = [];
				this.clickActivated = false;
				// reset z-index increment
				this.zIndexInc = 0;
			},
			menuHideSubMenus: function(level) {
				if (!level)
					level = 0;
				for (var i = this.visibleSubMenus.length - 1; i > level; i--) {
					this.menuHide(this.visibleSubMenus[i]);
				}
			},
			menuIframeShim: function($ul) {
				// create iframe shim for the menu
				if (IE && this.opts.overlapControlsInIE && !$ul.dataSM('ie-shim')) {
					$ul.dataSM('ie-shim', $('<iframe/>').attr({ src: 'javascript:0', tabindex: -9 })
						.css({ position: 'absolute', top: 'auto', left: '0', opacity: 0, border: '0' })
					);
				}
			},
			menuInit: function($ul) {
				if (!$ul.dataSM('in-mega')) {
					this.subMenus.push($ul);
					// mark UL's in mega drop downs (if any) so we can neglect them
					if ($ul.hasClass('mega-menu')) {
						$ul.find('ul').dataSM('in-mega', true);
					}
					// get level (much faster than, for example, using parentsUntil)
					var level = 2,
						par = $ul[0];
					while ((par = par.parentNode.parentNode) != this.$root[0]) {
						level++;
					}
					// cache stuff
					$ul.dataSM('parent-a', $ul.prevAll('a').eq(-1))
						.dataSM('level', level)
						.parent().dataSM('sub', $ul);
					// add sub indicator to parent item
					if (this.opts.subIndicators) {
						$ul.dataSM('parent-a').addClass('has-submenu')[this.opts.subIndicatorsPos](this.$subArrow.clone());
					}
				}
			},
			menuPosition: function($sub) {
				var $a = $sub.dataSM('parent-a'),
					$ul = $sub.parent().parent(),
					level = $sub.dataSM('level'),
					subW = this.getWidth($sub),
					subH = this.getHeight($sub),
					itemOffset = $a.offset(),
					itemX = itemOffset.left,
					itemY = itemOffset.top,
					itemW = this.getWidth($a),
					itemH = this.getHeight($a),
					$win = $(window),
					winX = $win.scrollLeft(),
					winY = $win.scrollTop(),
					winW = this.getViewportWidth(),
					winH = this.getViewportHeight(),
					horizontalParent = $ul.hasClass('sm') && !$ul.hasClass('sm-vertical'),
					subOffsetX = level == 2 ? this.opts.mainMenuSubOffsetX : this.opts.subMenusSubOffsetX,
					subOffsetY = level == 2 ? this.opts.mainMenuSubOffsetY : this.opts.subMenusSubOffsetY,
					x, y;
				if (horizontalParent) {
					x = this.opts.rightToLeftSubMenus ? itemW - subW - subOffsetX : subOffsetX;
					y = this.opts.bottomToTopSubMenus ? -subH - subOffsetY : itemH + subOffsetY;
				} else {
					x = this.opts.rightToLeftSubMenus ? subOffsetX - subW : itemW - subOffsetX;
					y = this.opts.bottomToTopSubMenus ? itemH - subOffsetY - subH : subOffsetY;
				}
				if (this.opts.keepInViewport && !this.isCollapsible()) {
					var absX = itemX + x,
						absY = itemY + y;
					if (this.opts.rightToLeftSubMenus && absX < winX) {
						x = horizontalParent ? winX - absX + x : itemW - subOffsetX;
					} else if (!this.opts.rightToLeftSubMenus && absX + subW > winX + winW) {
						x = horizontalParent ? winX + winW - subW - absX + x : subOffsetX - subW;
					}
					if (!horizontalParent) {
						if (subH < winH && absY + subH > winY + winH) {
							y += winY + winH - subH - absY;
						} else if (subH >= winH || absY < winY) {
							y += winY - absY;
						}
					}
					// do we need scrolling?
					// 0.49 used for better precision when dealing with float values
					if (horizontalParent && (absY + subH > winY + winH + 0.49 || absY < winY) || !horizontalParent && subH > winH + 0.49) {
						var self = this;
						if (!$sub.dataSM('scroll-arrows')) {
							$sub.dataSM('scroll-arrows', $([$('<span class="scroll-up"><span class="scroll-up-arrow"></span></span>')[0], $('<span class="scroll-down"><span class="scroll-down-arrow"></span></span>')[0]])
								.bind({
									mouseenter: function() {
										$sub.dataSM('scroll').up = $(this).hasClass('scroll-up');
										self.menuScroll($sub);
									},
									mouseleave: function(e) {
										self.menuScrollStop($sub);
										self.menuScrollOut($sub, e);
									},
									'mousewheel DOMMouseScroll': function(e) { e.preventDefault(); }
								})
								.insertAfter($sub)
							);
						}
						// bind scroll events and save scroll data for this sub
						var eNS = '.smartmenus_scroll';
						$sub.dataSM('scroll', {
								step: 1,
								// cache stuff for faster recalcs later
								itemH: itemH,
								subH: subH,
								arrowDownH: this.getHeight($sub.dataSM('scroll-arrows').eq(1))
							})
							.bind(getEventsNS([
								['mouseover', function(e) { self.menuScrollOver($sub, e); }],
								['mouseout', function(e) { self.menuScrollOut($sub, e); }],
								['mousewheel DOMMouseScroll', function(e) { self.menuScrollMousewheel($sub, e); }]
							], eNS))
							.dataSM('scroll-arrows').css({ top: 'auto', left: '0', marginLeft: x + (parseInt($sub.css('border-left-width')) || 0), width: subW - (parseInt($sub.css('border-left-width')) || 0) - (parseInt($sub.css('border-right-width')) || 0), zIndex: $sub.css('z-index') })
								.eq(horizontalParent && this.opts.bottomToTopSubMenus ? 0 : 1).show();
						// when a menu tree is fixed positioned we allow scrolling via touch too
						// since there is no other way to access such long sub menus if no mouse is present
						if (this.isFixed()) {
							$sub.css({ 'touch-action': 'none', '-ms-touch-action': 'none' })
								.bind(getEventsNS([
									[touchEvents() ? 'touchstart touchmove touchend' : 'pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp', function(e) {
										self.menuScrollTouch($sub, e);
									}]
								], eNS));
						}
					}
				}
				$sub.css({ top: 'auto', left: '0', marginLeft: x, marginTop: y - itemH });
				// IE iframe shim
				this.menuIframeShim($sub);
				if ($sub.dataSM('ie-shim')) {
					$sub.dataSM('ie-shim').css({ zIndex: $sub.css('z-index'), width: subW, height: subH, marginLeft: x, marginTop: y - itemH });
				}
			},
			menuScroll: function($sub, once, step) {
				var data = $sub.dataSM('scroll'),
					$arrows = $sub.dataSM('scroll-arrows'),
					y = parseFloat($sub.css('margin-top')),
					end = data.up ? data.upEnd : data.downEnd,
					diff;
				if (!once && data.velocity) {
					data.velocity *= 0.9;
					diff = data.velocity;
					if (diff < 0.5) {
						this.menuScrollStop($sub);
						return;
					}
				} else {
					diff = step || (once || !this.opts.scrollAccelerate ? this.opts.scrollStep : Math.floor(data.step));
				}
				// hide any visible deeper level sub menus
				var level = $sub.dataSM('level');
				if (this.visibleSubMenus.length > level) {
					this.menuHideSubMenus(level - 1);
				}
				var newY = data.up && end <= y || !data.up && end >= y ? y : (Math.abs(end - y) > diff ? y + (data.up ? diff : -diff) : end);
				$sub.add($sub.dataSM('ie-shim')).css('margin-top', newY);
				// show opposite arrow if appropriate
				if (mouse && (data.up && newY > data.downEnd || !data.up && newY < data.upEnd)) {
					$arrows.eq(data.up ? 1 : 0).show();
				}
				// if we've reached the end
				if (newY == end) {
					if (mouse) {
						$arrows.eq(data.up ? 0 : 1).hide();
					}
					this.menuScrollStop($sub);
				} else if (!once) {
					if (this.opts.scrollAccelerate && data.step < this.opts.scrollStep) {
						data.step += 0.5;
					}
					var self = this;
					this.scrollTimeout = setTimeout(function() { self.menuScroll($sub); }, this.opts.scrollInterval);
				}
			},
			menuScrollMousewheel: function($sub, e) {
				if (this.getClosestMenu(e.target) == $sub[0]) {
					e = e.originalEvent;
					var up = (e.wheelDelta || -e.detail) > 0;
					if ($sub.dataSM('scroll-arrows').eq(up ? 0 : 1).is(':visible')) {
						$sub.dataSM('scroll').up = up;
						this.menuScroll($sub, true);
					}
				}
				e.preventDefault();
			},
			menuScrollOut: function($sub, e) {
				if (mouse) {
					if (!/^scroll-(up|down)/.test((e.relatedTarget || '').className) && ($sub[0] != e.relatedTarget && !$.contains($sub[0], e.relatedTarget) || this.getClosestMenu(e.relatedTarget) != $sub[0])) {
						$sub.dataSM('scroll-arrows').css('visibility', 'hidden');
					}
				}
			},
			menuScrollOver: function($sub, e) {
				if (mouse) {
					if (!/^scroll-(up|down)/.test(e.target.className) && this.getClosestMenu(e.target) == $sub[0]) {
						this.menuScrollRefreshData($sub);
						var data = $sub.dataSM('scroll');
						$sub.dataSM('scroll-arrows').eq(0).css('margin-top', data.upEnd).end()
							.eq(1).css('margin-top', data.downEnd + data.subH - data.arrowDownH).end()
							.css('visibility', 'visible');
					}
				}
			},
			menuScrollRefreshData: function($sub) {
				var data = $sub.dataSM('scroll'),
					$win = $(window),
					vportY = $win.scrollTop() - $sub.dataSM('parent-a').offset().top - data.itemH;
				$.extend(data, {
					upEnd: vportY,
					downEnd: vportY + this.getViewportHeight() - data.subH
				});
			},
			menuScrollStop: function($sub) {
				if (this.scrollTimeout) {
					clearTimeout(this.scrollTimeout);
					this.scrollTimeout = 0;
					$.extend($sub.dataSM('scroll'), {
						step: 1,
						velocity: 0
					});
					return true;
				}
			},
			menuScrollTouch: function($sub, e) {
				e = e.originalEvent;
				if (isTouchEvent(e)) {
					var touchPoint = this.getTouchPoint(e);
					// neglect event if we touched a visible deeper level sub menu
					if (this.getClosestMenu(touchPoint.target) == $sub[0]) {
						var data = $sub.dataSM('scroll');
						if (/(start|down)$/i.test(e.type)) {
							if (this.menuScrollStop($sub)) {
								// if we were scrolling, just stop and don't activate any link on the first touch
								e.preventDefault();
								this.isTouchScrolling = true;
							} else {
								this.isTouchScrolling = false;
							}
							// update scroll data since the user might have zoomed, etc.
							this.menuScrollRefreshData($sub);
							// extend it with the touch properties
							$.extend(data, {
								touchY: touchPoint.pageY,
								touchTimestamp: e.timeStamp,
								velocity: 0
							});
						} else if (/move$/i.test(e.type)) {
							var prevY = data.touchY;
							if (prevY !== undefined && prevY != touchPoint.pageY) {
								this.isTouchScrolling = true;
								$.extend(data, {
									up: prevY < touchPoint.pageY,
									touchY: touchPoint.pageY,
									touchTimestamp: e.timeStamp,
									velocity: data.velocity + Math.abs(touchPoint.pageY - prevY) * 0.5
								});
								this.menuScroll($sub, true, Math.abs(data.touchY - prevY));
							}
							e.preventDefault();
						} else { // touchend/pointerup
							if (data.touchY !== undefined) {
								// check if we need to scroll
								if (e.timeStamp - data.touchTimestamp < 120 && data.velocity > 0) {
									data.velocity *= 0.5;
									this.menuScrollStop($sub);
									this.menuScroll($sub);
									e.preventDefault();
								}
								delete data.touchY;
							}
						}
					}
				}
			},
			menuShow: function($sub) {
				if (!$sub.dataSM('beforefirstshowfired')) {
					$sub.dataSM('beforefirstshowfired', true);
					if (this.$root.triggerHandler('beforefirstshow.smapi', $sub[0]) === false) {
						return;
					}
				}
				if (this.$root.triggerHandler('beforeshow.smapi', $sub[0]) === false) {
					return;
				}
				this.menuFixLayout($sub);
				$sub.stop(true, true);
				if (!$sub.is(':visible')) {
					// set z-index
					$sub.css('z-index', this.zIndexInc = (this.zIndexInc || this.getStartZIndex()) + 1);
					// highlight parent item
					if (this.opts.keepHighlighted || this.isCollapsible()) {
						$sub.dataSM('parent-a').addClass('highlighted');
					}
					// min/max-width fix - no way to rely purely on CSS as all UL's are nested
					if (this.opts.subMenusMinWidth || this.opts.subMenusMaxWidth) {
						$sub.css({ width: 'auto', minWidth: '', maxWidth: '' }).addClass('sm-nowrap');
						if (this.opts.subMenusMinWidth) {
						 	$sub.css('min-width', this.opts.subMenusMinWidth);
						}
						if (this.opts.subMenusMaxWidth) {
						 	var noMaxWidth = this.getWidth($sub);
						 	$sub.css('max-width', this.opts.subMenusMaxWidth);
							if (noMaxWidth > this.getWidth($sub)) {
								$sub.removeClass('sm-nowrap').css('width', this.opts.subMenusMaxWidth);
							}
						}
					}
					this.menuPosition($sub);
					// insert IE iframe shim
					if ($sub.dataSM('ie-shim')) {
						$sub.dataSM('ie-shim').insertBefore($sub);
					}
					var complete = function() {
						// fix: "overflow: hidden;" is not reset on animation complete in jQuery < 1.9.0 in Chrome when global "box-sizing: border-box;" is used
						$sub.css('overflow', '');
					};
					// if sub is collapsible (mobile view)
					if (this.isCollapsible()) {
						if (this.opts.collapsibleShowFunction) {
							this.opts.collapsibleShowFunction.call(this, $sub, complete);
						} else {
							$sub.show(this.opts.collapsibleShowDuration, complete);
						}
					} else {
						if (this.opts.showFunction) {
							this.opts.showFunction.call(this, $sub, complete);
						} else {
							$sub.show(this.opts.showDuration, complete);
						}
					}
					// save new sub menu for this level
					this.visibleSubMenus[$sub.dataSM('level') - 1] = $sub;
					this.$root.triggerHandler('show.smapi', $sub[0]);
				}
			},
			popupHide: function(noHideTimeout) {
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				var self = this;
				this.hideTimeout = setTimeout(function() {
					self.menuHideAll();
				}, noHideTimeout ? 1 : this.opts.hideTimeout);
			},
			popupShow: function(left, top) {
				if (!this.opts.isPopup) {
					alert('SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.');
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				this.menuFixLayout(this.$root);
				this.$root.stop(true, true);
				if (!this.$root.is(':visible')) {
					this.$root.css({ left: left, top: top });
					// IE iframe shim
					this.menuIframeShim(this.$root);
					if (this.$root.dataSM('ie-shim')) {
						this.$root.dataSM('ie-shim').css({ zIndex: this.$root.css('z-index'), width: this.getWidth(this.$root), height: this.getHeight(this.$root), left: left, top: top }).insertBefore(this.$root);
					}
					// show menu
					var self = this,
						complete = function() {
							self.$root.css('overflow', '');
						};
					if (this.opts.showFunction) {
						this.opts.showFunction.call(this, this.$root, complete);
					} else {
						this.$root.show(this.opts.showDuration, complete);
					}
					this.visibleSubMenus[0] = this.$root;
				}
			},
			refresh: function() {
				this.menuHideAll();
				this.$root.find('ul').each(function() {
						var $this = $(this);
						if ($this.dataSM('scroll-arrows')) {
							$this.dataSM('scroll-arrows').remove();
						}
					})
					.removeDataSM('in-mega')
					.removeDataSM('shown-before')
					.removeDataSM('ie-shim')
					.removeDataSM('scroll-arrows')
					.removeDataSM('parent-a')
					.removeDataSM('level')
					.removeDataSM('beforefirstshowfired');
				this.$root.find('a.has-submenu').removeClass('has-submenu')
					.parent().removeDataSM('sub');
				if (this.opts.subIndicators) {
					this.$root.find('span.sub-arrow').remove();
				}
				if (this.opts.markCurrentItem) {
					this.$root.find('a.current').removeClass('current');
				}
				this.subMenus = [];
				this.init(true);
			},
			rootOut: function(e) {
				if (!this.handleEvents() || this.isTouchMode() || e.target == this.$root[0]) {
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				if (!this.opts.showOnClick || !this.opts.hideOnClick) {
					var self = this;
					this.hideTimeout = setTimeout(function() { self.menuHideAll(); }, this.opts.hideTimeout);
				}
			},
			rootOver: function(e) {
				if (!this.handleEvents() || this.isTouchMode() || e.target == this.$root[0]) {
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
			},
			winResize: function(e) {
				if (!this.handleEvents()) {
					// we still need to resize the disable overlay if it's visible
					if (this.$disableOverlay) {
						var pos = this.$root.offset();
	 					this.$disableOverlay.css({
							top: pos.top,
							left: pos.left,
							width: this.$root.outerWidth(),
							height: this.$root.outerHeight()
						});
					}
					return;
				}
				// hide sub menus on resize - on mobile do it only on orientation change
				if (!this.isCollapsible() && (!('onorientationchange' in window) || e.type == 'orientationchange')) {
					if (this.activatedItems.length) {
						this.activatedItems[this.activatedItems.length - 1][0].blur();
					}
					this.menuHideAll();
				}
			}
		}
	});

	$.fn.dataSM = function(key, val) {
		if (val) {
			return this.data(key + '_smartmenus', val);
		}
		return this.data(key + '_smartmenus');
	}

	$.fn.removeDataSM = function(key) {
		return this.removeData(key + '_smartmenus');
	}

	$.fn.smartmenus = function(options) {
		if (typeof options == 'string') {
			var args = arguments,
				method = options;
			Array.prototype.shift.call(args);
			return this.each(function() {
				var smartmenus = $(this).data('smartmenus');
				if (smartmenus && smartmenus[method]) {
					smartmenus[method].apply(smartmenus, args);
				}
			});
		}
		var opts = $.extend({}, $.fn.smartmenus.defaults, options);
		return this.each(function() {
			new $.SmartMenus(this, opts);
		});
	}

	// default settings
	$.fn.smartmenus.defaults = {
		isPopup:		false,		// is this a popup menu (can be shown via the popupShow/popupHide methods) or a permanent menu bar
		mainMenuSubOffsetX:	0,		// pixels offset from default position
		mainMenuSubOffsetY:	0,		// pixels offset from default position
		subMenusSubOffsetX:	0,		// pixels offset from default position
		subMenusSubOffsetY:	0,		// pixels offset from default position
		subMenusMinWidth:	'10em',		// min-width for the sub menus (any CSS unit) - if set, the fixed width set in CSS will be ignored
		subMenusMaxWidth:	'20em',		// max-width for the sub menus (any CSS unit) - if set, the fixed width set in CSS will be ignored
		subIndicators: 		true,		// create sub menu indicators - creates a SPAN and inserts it in the A
		subIndicatorsPos: 	'prepend',	// position of the SPAN relative to the menu item content ('prepend', 'append')
		subIndicatorsText:	'+',		// [optionally] add text in the SPAN (e.g. '+') (you may want to check the CSS for the sub indicators too)
		scrollStep: 		30,		// pixels step when scrolling long sub menus that do not fit in the viewport height
		scrollInterval:		30,		// interval between each scrolling step
		scrollAccelerate:	true,		// accelerate scrolling or use a fixed step
		showTimeout:		250,		// timeout before showing the sub menus
		hideTimeout:		500,		// timeout before hiding the sub menus
		showDuration:		0,		// duration for show animation - set to 0 for no animation - matters only if showFunction:null
		showFunction:		null,		// custom function to use when showing a sub menu (the default is the jQuery 'show')
							// don't forget to call complete() at the end of whatever you do
							// e.g.: function($ul, complete) { $ul.fadeIn(250, complete); }
		hideDuration:		0,		// duration for hide animation - set to 0 for no animation - matters only if hideFunction:null
		hideFunction:		function($ul, complete) { $ul.fadeOut(200, complete); },	// custom function to use when hiding a sub menu (the default is the jQuery 'hide')
							// don't forget to call complete() at the end of whatever you do
							// e.g.: function($ul, complete) { $ul.fadeOut(250, complete); }
		collapsibleShowDuration:0,		// duration for show animation for collapsible sub menus - matters only if collapsibleShowFunction:null
		collapsibleShowFunction:function($ul, complete) { $ul.slideDown(200, complete); },	// custom function to use when showing a collapsible sub menu
							// (i.e. when mobile styles are used to make the sub menus collapsible)
		collapsibleHideDuration:0,		// duration for hide animation for collapsible sub menus - matters only if collapsibleHideFunction:null
		collapsibleHideFunction:function($ul, complete) { $ul.slideUp(200, complete); },	// custom function to use when hiding a collapsible sub menu
							// (i.e. when mobile styles are used to make the sub menus collapsible)
		showOnClick:		false,		// show the first-level sub menus onclick instead of onmouseover (matters only for mouse input)
		hideOnClick:		true,		// hide the sub menus on click/tap anywhere on the page
		keepInViewport:		true,		// reposition the sub menus if needed to make sure they always appear inside the viewport
		keepHighlighted:	true,		// keep all ancestor items of the current sub menu highlighted (adds the 'highlighted' class to the A's)
		markCurrentItem:	false,		// automatically add the 'current' class to the A element of the item linking to the current URL
		markCurrentTree:	true,		// add the 'current' class also to the A elements of all ancestor items of the current item
		rightToLeftSubMenus:	false,		// right to left display of the sub menus (check the CSS for the sub indicators' position)
		bottomToTopSubMenus:	false,		// bottom to top display of the sub menus
		overlapControlsInIE:	true		// make sure sub menus appear on top of special OS controls in IE (i.e. SELECT, OBJECT, EMBED, etc.)
	};

})(jQuery);;
/*!
 * SmartMenus jQuery Plugin Bootstrap Addon - v0.1.1 - August 25, 2014
 * http://www.smartmenus.org/
 *
 * Copyright 2014 Vasil Dinkov, Vadikom Web Ltd.
 * http://vadikom.com
 *
 * Licensed MIT
 */

(function($) {

	// init ondomready
	$(function() {

		// init all menus
		$('ul.navbar-nav').each(function() {
				var $this = $(this);
				$this.addClass('sm').smartmenus({

						// these are some good default options that should work for all
						// you can, of course, tweak these as you like
						subMenusSubOffsetX: 2,
						subMenusSubOffsetY: -6,
						subIndicatorsPos: 'append',
						subIndicatorsText: '...',
						collapsibleShowFunction: null,
						collapsibleHideFunction: null,
						rightToLeftSubMenus: $this.hasClass('navbar-right'),
						bottomToTopSubMenus: $this.closest('.navbar').hasClass('navbar-fixed-bottom')
					})
					// set Bootstrap's "active" class to SmartMenus "current" items (should someone decide to enable markCurrentItem: true)
					.find('a.current').parent().addClass('active');
			})
			.bind({
				// set/unset proper Bootstrap classes for some menu elements
				'show.smapi': function(e, menu) {
					var $menu = $(menu),
						$scrollArrows = $menu.dataSM('scroll-arrows'),
						obj = $(this).data('smartmenus');
					if ($scrollArrows) {
						// they inherit border-color from body, so we can use its background-color too
						$scrollArrows.css('background-color', $(document.body).css('background-color'));
					}
					$menu.parent().addClass('open' + (obj.isCollapsible() ? ' collapsible' : ''));
				},
				'hide.smapi': function(e, menu) {
					$(menu).parent().removeClass('open collapsible');
				},
				// click the parent item to toggle the sub menus (and reset deeper levels and other branches on click)
				/*'click.smapi': function(e, item) {
					var obj = $(this).data('smartmenus');
					if (obj.isCollapsible()) {
						var $item = $(item),
							$sub = $item.parent().dataSM('sub');
						if ($sub && $sub.dataSM('shown-before') && $sub.is(':visible')) {
							obj.itemActivate($item);
							obj.menuHide($sub);
							return false;
						}
					}
				}*/
			});

	});

	// fix collapsible menu detection for Bootstrap 3
	$.SmartMenus.prototype.isCollapsible = function() {
		return this.$firstLink.parent().css('float') != 'left';
	};

})(jQuery);;
!function(d){function f(){return new Date(Date.UTC.apply(Date,arguments))}function b(){var g=new Date();return f(g.getUTCFullYear(),g.getUTCMonth(),g.getUTCDate())}var a=function(h,g){var i=this;this.element=d(h);this.language=g.language||this.element.data("date-language")||"en";this.language=this.language in e?this.language:this.language.split("-")[0];this.language=this.language in e?this.language:"en";this.isRTL=e[this.language].rtl||false;this.format=c.parseFormat(g.format||this.element.data("date-format")||e[this.language].format||"dd/mm/yyyy");this.isInline=false;this.isInput=this.element.is("input");this.component=this.element.is(".date")?this.element.find(".add-on, .btn"):false;this.hasInput=this.component&&this.element.find("input").length;if(this.component&&this.component.length===0){this.component=false}this._attachEvents();this.forceParse=true;if("forceParse" in g){this.forceParse=g.forceParse}else{if("dateForceParse" in this.element.data()){this.forceParse=this.element.data("date-force-parse")}}this.picker=d(c.template).appendTo(this.isInline?this.element:"body").on({click:d.proxy(this.click,this),mousedown:d.proxy(this.mousedown,this)});if(this.isInline){this.picker.addClass("datepicker-inline")}else{this.picker.addClass("datepicker-dropdown dropdown-menu")}if(this.isRTL){this.picker.addClass("datepicker-rtl");this.picker.find(".prev i, .next i").toggleClass("icon-arrow-left icon-arrow-right")}d(document).on("mousedown",function(j){if(d(j.target).closest(".datepicker.datepicker-inline, .datepicker.datepicker-dropdown").length===0){i.hide()}});this.autoclose=false;if("autoclose" in g){this.autoclose=g.autoclose}else{if("dateAutoclose" in this.element.data()){this.autoclose=this.element.data("date-autoclose")}}this.keyboardNavigation=true;if("keyboardNavigation" in g){this.keyboardNavigation=g.keyboardNavigation}else{if("dateKeyboardNavigation" in this.element.data()){this.keyboardNavigation=this.element.data("date-keyboard-navigation")}}this.viewMode=this.startViewMode=0;switch(g.startView||this.element.data("date-start-view")){case 2:case"decade":this.viewMode=this.startViewMode=2;break;case 1:case"year":this.viewMode=this.startViewMode=1;break}this.minViewMode=g.minViewMode||this.element.data("date-min-view-mode")||0;if(typeof this.minViewMode==="string"){switch(this.minViewMode){case"months":this.minViewMode=1;break;case"years":this.minViewMode=2;break;default:this.minViewMode=0;break}}this.viewMode=this.startViewMode=Math.max(this.startViewMode,this.minViewMode);this.todayBtn=(g.todayBtn||this.element.data("date-today-btn")||false);this.todayHighlight=(g.todayHighlight||this.element.data("date-today-highlight")||false);this.calendarWeeks=false;if("calendarWeeks" in g){this.calendarWeeks=g.calendarWeeks}else{if("dateCalendarWeeks" in this.element.data()){this.calendarWeeks=this.element.data("date-calendar-weeks")}}if(this.calendarWeeks){this.picker.find("tfoot th.today").attr("colspan",function(j,k){return parseInt(k)+1})}this.weekStart=((g.weekStart||this.element.data("date-weekstart")||e[this.language].weekStart||0)%7);this.weekEnd=((this.weekStart+6)%7);this.startDate=-Infinity;this.endDate=Infinity;this.daysOfWeekDisabled=[];this.setStartDate(g.startDate||this.element.data("date-startdate"));this.setEndDate(g.endDate||this.element.data("date-enddate"));this.setDaysOfWeekDisabled(g.daysOfWeekDisabled||this.element.data("date-days-of-week-disabled"));this.fillDow();this.fillMonths();this.update();this.showMode();if(this.isInline){this.show()}};a.prototype={constructor:a,_events:[],_attachEvents:function(){this._detachEvents();if(this.isInput){this._events=[[this.element,{focus:d.proxy(this.show,this),keyup:d.proxy(this.update,this),keydown:d.proxy(this.keydown,this)}]]}else{if(this.component&&this.hasInput){this._events=[[this.element.find("input"),{focus:d.proxy(this.show,this),keyup:d.proxy(this.update,this),keydown:d.proxy(this.keydown,this)}],[this.component,{click:d.proxy(this.show,this)}]]}else{if(this.element.is("div")){this.isInline=true}else{this._events=[[this.element,{click:d.proxy(this.show,this)}]]}}}for(var g=0,h,j;g<this._events.length;g++){h=this._events[g][0];j=this._events[g][1];h.on(j)}},_detachEvents:function(){for(var g=0,h,j;g<this._events.length;g++){h=this._events[g][0];j=this._events[g][1];h.off(j)}this._events=[]},show:function(g){this.picker.show();this.height=this.component?this.component.outerHeight():this.element.outerHeight();this.update();this.place();d(window).on("resize",d.proxy(this.place,this));if(g){g.preventDefault()}this.element.trigger({type:"show",date:this.date})},hide:function(g){if(this.isInline){return}if(!this.picker.is(":visible")){return}this.picker.hide();d(window).off("resize",this.place);this.viewMode=this.startViewMode;this.showMode();if(!this.isInput){d(document).off("mousedown",this.hide)}if(this.forceParse&&(this.isInput&&this.element.val()||this.hasInput&&this.element.find("input").val())){this.setValue()}this.element.trigger({type:"hide",date:this.date})},remove:function(){this._detachEvents();this.picker.remove();delete this.element.data().datepicker;if(!this.isInput){delete this.element.data().date}},getDate:function(){var g=this.getUTCDate();return new Date(g.getTime()+(g.getTimezoneOffset()*60000))},getUTCDate:function(){return this.date},setDate:function(g){this.setUTCDate(new Date(g.getTime()-(g.getTimezoneOffset()*60000)))},setUTCDate:function(g){this.date=g;this.setValue()},setValue:function(){var g=this.getFormattedDate();if(!this.isInput){if(this.component){this.element.find("input").val(g)}this.element.data("date",g)}else{this.element.val(g)}},getFormattedDate:function(g){if(g===undefined){g=this.format}return c.formatDate(this.date,g,this.language)},setStartDate:function(g){this.startDate=g||-Infinity;if(this.startDate!==-Infinity){this.startDate=c.parseDate(this.startDate,this.format,this.language)}this.update();this.updateNavArrows()},setEndDate:function(g){this.endDate=g||Infinity;if(this.endDate!==Infinity){this.endDate=c.parseDate(this.endDate,this.format,this.language)}this.update();this.updateNavArrows()},setDaysOfWeekDisabled:function(g){this.daysOfWeekDisabled=g||[];if(!d.isArray(this.daysOfWeekDisabled)){this.daysOfWeekDisabled=this.daysOfWeekDisabled.split(/,\s*/)}this.daysOfWeekDisabled=d.map(this.daysOfWeekDisabled,function(h){return parseInt(h,10)});this.update();this.updateNavArrows()},place:function(){if(this.isInline){return}var i=parseInt(this.element.parents().filter(function(){return d(this).css("z-index")!="auto"}).first().css("z-index"))+10;var h=this.component?this.component.parent().offset():this.element.offset();var g=this.component?this.component.outerHeight(true):this.element.outerHeight(true);this.picker.css({top:h.top+g,left:h.left,zIndex:i})},update:function(){var g,h=false;if(arguments&&arguments.length&&(typeof arguments[0]==="string"||arguments[0] instanceof Date)){g=arguments[0];h=true}else{g=this.isInput?this.element.val():this.element.data("date")||this.element.find("input").val()}this.date=c.parseDate(g,this.format,this.language);if(h){this.setValue()}if(this.date<this.startDate){this.viewDate=new Date(this.startDate)}else{if(this.date>this.endDate){this.viewDate=new Date(this.endDate)}else{this.viewDate=new Date(this.date)}}this.fill()},fillDow:function(){var h=this.weekStart,i="<tr>";if(this.calendarWeeks){var g='<th class="cw">&nbsp;</th>';i+=g;this.picker.find(".datepicker-days thead tr:first-child").prepend(g)}while(h<this.weekStart+7){i+='<th class="dow">'+e[this.language].daysMin[(h++)%7]+"</th>"}i+="</tr>";this.picker.find(".datepicker-days thead").append(i)},fillMonths:function(){var h="",g=0;while(g<12){h+='<span class="month">'+e[this.language].monthsShort[g++]+"</span>"}this.picker.find(".datepicker-months td").html(h)},fill:function(){var y=new Date(this.viewDate),p=y.getUTCFullYear(),z=y.getUTCMonth(),s=this.startDate!==-Infinity?this.startDate.getUTCFullYear():-Infinity,w=this.startDate!==-Infinity?this.startDate.getUTCMonth():-Infinity,m=this.endDate!==Infinity?this.endDate.getUTCFullYear():Infinity,t=this.endDate!==Infinity?this.endDate.getUTCMonth():Infinity,n=this.date&&this.date.valueOf(),x=new Date();this.picker.find(".datepicker-days thead th.switch").text(e[this.language].months[z]+" "+p);this.picker.find("tfoot th.today").text(e[this.language].today).toggle(this.todayBtn!==false);this.updateNavArrows();this.fillMonths();var B=f(p,z-1,28,0,0,0,0),v=c.getDaysInMonth(B.getUTCFullYear(),B.getUTCMonth());B.setUTCDate(v);B.setUTCDate(v-(B.getUTCDay()-this.weekStart+7)%7);var g=new Date(B);g.setUTCDate(g.getUTCDate()+42);g=g.valueOf();var o=[];var r;while(B.valueOf()<g){if(B.getUTCDay()==this.weekStart){o.push("<tr>");if(this.calendarWeeks){var h=new Date(+B+(this.weekStart-B.getUTCDay()-7)%7*86400000),k=new Date(+h+(7+4-h.getUTCDay())%7*86400000),j=new Date(+(j=f(k.getUTCFullYear(),0,1))+(7+4-j.getUTCDay())%7*86400000),q=(k-j)/86400000/7+1;o.push('<td class="cw">'+q+"</td>")}}r="";if(B.getUTCFullYear()<p||(B.getUTCFullYear()==p&&B.getUTCMonth()<z)){r+=" old"}else{if(B.getUTCFullYear()>p||(B.getUTCFullYear()==p&&B.getUTCMonth()>z)){r+=" new"}}if(this.todayHighlight&&B.getUTCFullYear()==x.getFullYear()&&B.getUTCMonth()==x.getMonth()&&B.getUTCDate()==x.getDate()){r+=" today"}if(n&&B.valueOf()==n){r+=" active"}if(B.valueOf()<this.startDate||B.valueOf()>this.endDate||d.inArray(B.getUTCDay(),this.daysOfWeekDisabled)!==-1){r+=" disabled"}o.push('<td class="day'+r+'">'+B.getUTCDate()+"</td>");if(B.getUTCDay()==this.weekEnd){o.push("</tr>")}B.setUTCDate(B.getUTCDate()+1)}this.picker.find(".datepicker-days tbody").empty().append(o.join(""));var C=this.date&&this.date.getUTCFullYear();var l=this.picker.find(".datepicker-months").find("th:eq(1)").text(p).end().find("span").removeClass("active");if(C&&C==p){l.eq(this.date.getUTCMonth()).addClass("active")}if(p<s||p>m){l.addClass("disabled")}if(p==s){l.slice(0,w).addClass("disabled")}if(p==m){l.slice(t+1).addClass("disabled")}o="";p=parseInt(p/10,10)*10;var A=this.picker.find(".datepicker-years").find("th:eq(1)").text(p+"-"+(p+9)).end().find("td");p-=1;for(var u=-1;u<11;u++){o+='<span class="year'+(u==-1||u==10?" old":"")+(C==p?" active":"")+(p<s||p>m?" disabled":"")+'">'+p+"</span>";p+=1}A.html(o)},updateNavArrows:function(){var i=new Date(this.viewDate),g=i.getUTCFullYear(),h=i.getUTCMonth();switch(this.viewMode){case 0:if(this.startDate!==-Infinity&&g<=this.startDate.getUTCFullYear()&&h<=this.startDate.getUTCMonth()){this.picker.find(".prev").css({visibility:"hidden"})}else{this.picker.find(".prev").css({visibility:"visible"})}if(this.endDate!==Infinity&&g>=this.endDate.getUTCFullYear()&&h>=this.endDate.getUTCMonth()){this.picker.find(".next").css({visibility:"hidden"})}else{this.picker.find(".next").css({visibility:"visible"})}break;case 1:case 2:if(this.startDate!==-Infinity&&g<=this.startDate.getUTCFullYear()){this.picker.find(".prev").css({visibility:"hidden"})}else{this.picker.find(".prev").css({visibility:"visible"})}if(this.endDate!==Infinity&&g>=this.endDate.getUTCFullYear()){this.picker.find(".next").css({visibility:"hidden"})}else{this.picker.find(".next").css({visibility:"visible"})}break}},click:function(m){m.preventDefault();var l=d(m.target).closest("span, td, th");if(l.length==1){switch(l[0].nodeName.toLowerCase()){case"th":switch(l[0].className){case"switch":this.showMode(1);break;case"prev":case"next":var i=c.modes[this.viewMode].navStep*(l[0].className=="prev"?-1:1);switch(this.viewMode){case 0:this.viewDate=this.moveMonth(this.viewDate,i);break;case 1:case 2:this.viewDate=this.moveYear(this.viewDate,i);break}this.fill();break;case"today":var h=new Date();h=f(h.getFullYear(),h.getMonth(),h.getDate(),0,0,0);this.showMode(-2);var n=this.todayBtn=="linked"?null:"view";this._setDate(h,n);break}break;case"span":if(!l.is(".disabled")){this.viewDate.setUTCDate(1);if(l.is(".month")){var g=1;var k=l.parent().find("span").index(l);var j=this.viewDate.getUTCFullYear();this.viewDate.setUTCMonth(k);this.element.trigger({type:"changeMonth",date:this.viewDate});if(this.minViewMode==1){this._setDate(f(j,k,g,0,0,0,0))}}else{var j=parseInt(l.text(),10)||0;var g=1;var k=0;this.viewDate.setUTCFullYear(j);this.element.trigger({type:"changeYear",date:this.viewDate});if(this.minViewMode==2){this._setDate(f(j,k,g,0,0,0,0))}}this.showMode(-1);this.fill()}break;case"td":if(l.is(".day")&&!l.is(".disabled")){var g=parseInt(l.text(),10)||1;var j=this.viewDate.getUTCFullYear(),k=this.viewDate.getUTCMonth();if(l.is(".old")){if(k===0){k=11;j-=1}else{k-=1}}else{if(l.is(".new")){if(k==11){k=0;j+=1}else{k+=1}}}this._setDate(f(j,k,g,0,0,0,0))}break}}},_setDate:function(g,i){if(!i||i=="date"){this.date=g}if(!i||i=="view"){this.viewDate=g}this.fill();this.setValue();this.element.trigger({type:"changeDate",date:this.date});var h;if(this.isInput){h=this.element}else{if(this.component){h=this.element.find("input")}}if(h){h.change();if(this.autoclose&&(!i||i=="date")){this.hide()}}},moveMonth:function(g,h){if(!h){return g}var l=new Date(g.valueOf()),p=l.getUTCDate(),m=l.getUTCMonth(),k=Math.abs(h),o,n;h=h>0?1:-1;if(k==1){n=h==-1?function(){return l.getUTCMonth()==m}:function(){return l.getUTCMonth()!=o};o=m+h;l.setUTCMonth(o);if(o<0||o>11){o=(o+12)%12}}else{for(var j=0;j<k;j++){l=this.moveMonth(l,h)}o=l.getUTCMonth();l.setUTCDate(p);n=function(){return o!=l.getUTCMonth()}}while(n()){l.setUTCDate(--p);l.setUTCMonth(o)}return l},moveYear:function(h,g){return this.moveMonth(h,g*12)},dateWithinRange:function(g){return g>=this.startDate&&g<=this.endDate},keydown:function(n){if(this.picker.is(":not(:visible)")){if(n.keyCode==27){this.show()}return}var j=false,i,h,m,g,l;switch(n.keyCode){case 27:this.hide();n.preventDefault();break;case 37:case 39:if(!this.keyboardNavigation){break}i=n.keyCode==37?-1:1;if(n.ctrlKey){g=this.moveYear(this.date,i);l=this.moveYear(this.viewDate,i)}else{if(n.shiftKey){g=this.moveMonth(this.date,i);l=this.moveMonth(this.viewDate,i)}else{g=new Date(this.date);g.setUTCDate(this.date.getUTCDate()+i);l=new Date(this.viewDate);l.setUTCDate(this.viewDate.getUTCDate()+i)}}if(this.dateWithinRange(g)){this.date=g;this.viewDate=l;this.setValue();this.update();n.preventDefault();j=true}break;case 38:case 40:if(!this.keyboardNavigation){break}i=n.keyCode==38?-1:1;if(n.ctrlKey){g=this.moveYear(this.date,i);l=this.moveYear(this.viewDate,i)}else{if(n.shiftKey){g=this.moveMonth(this.date,i);l=this.moveMonth(this.viewDate,i)}else{g=new Date(this.date);g.setUTCDate(this.date.getUTCDate()+i*7);l=new Date(this.viewDate);l.setUTCDate(this.viewDate.getUTCDate()+i*7)}}if(this.dateWithinRange(g)){this.date=g;this.viewDate=l;this.setValue();this.update();n.preventDefault();j=true}break;case 13:this.hide();n.preventDefault();break;case 9:this.hide();break}if(j){this.element.trigger({type:"changeDate",date:this.date});var k;if(this.isInput){k=this.element}else{if(this.component){k=this.element.find("input")}}if(k){k.change()}}},showMode:function(g){if(g){this.viewMode=Math.max(this.minViewMode,Math.min(2,this.viewMode+g))}this.picker.find(">div").hide().filter(".datepicker-"+c.modes[this.viewMode].clsName).css("display","block");this.updateNavArrows()}};d.fn.datepicker=function(h){var g=Array.apply(null,arguments);g.shift();return this.each(function(){var k=d(this),j=k.data("datepicker"),i=typeof h=="object"&&h;if(!j){k.data("datepicker",(j=new a(this,d.extend({},d.fn.datepicker.defaults,i))))}if(typeof h=="string"&&typeof j[h]=="function"){j[h].apply(j,g)}})};d.fn.datepicker.defaults={};d.fn.datepicker.Constructor=a;var e=d.fn.datepicker.dates={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa","Su"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],today:"Today"}};var c={modes:[{clsName:"days",navFnc:"Month",navStep:1},{clsName:"months",navFnc:"FullYear",navStep:1},{clsName:"years",navFnc:"FullYear",navStep:10}],isLeapYear:function(g){return(((g%4===0)&&(g%100!==0))||(g%400===0))},getDaysInMonth:function(g,h){return[31,(c.isLeapYear(g)?29:28),31,30,31,30,31,31,30,31,30,31][h]},validParts:/dd?|DD?|mm?|MM?|yy(?:yy)?/g,nonpunctuation:/[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,parseFormat:function(i){var g=i.replace(this.validParts,"\0").split("\0"),h=i.match(this.validParts);if(!g||!g.length||!h||h.length===0){throw new Error("Invalid date format.")}return{separators:g,parts:h}},parseDate:function(k,u,n){if(k instanceof Date){return k}if(/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(k)){var w=/([\-+]\d+)([dmwy])/,m=k.match(/([\-+]\d+)([dmwy])/g),g,l;k=new Date();for(var o=0;o<m.length;o++){g=w.exec(m[o]);l=parseInt(g[1]);switch(g[2]){case"d":k.setUTCDate(k.getUTCDate()+l);break;case"m":k=a.prototype.moveMonth.call(a.prototype,k,l);break;case"w":k.setUTCDate(k.getUTCDate()+l*7);break;case"y":k=a.prototype.moveYear.call(a.prototype,k,l);break}}return f(k.getUTCFullYear(),k.getUTCMonth(),k.getUTCDate(),0,0,0)}var m=k&&k.match(this.nonpunctuation)||[],k=new Date(),r={},t=["yyyy","yy","M","MM","m","mm","d","dd"],v={yyyy:function(s,i){return s.setUTCFullYear(i)},yy:function(s,i){return s.setUTCFullYear(2000+i)},m:function(s,i){i-=1;while(i<0){i+=12}i%=12;s.setUTCMonth(i);while(s.getUTCMonth()!=i){s.setUTCDate(s.getUTCDate()-1)}return s},d:function(s,i){return s.setUTCDate(i)}},j,p,g;v.M=v.MM=v.mm=v.m;v.dd=v.d;k=f(k.getFullYear(),k.getMonth(),k.getDate(),0,0,0);var q=u.parts.slice();if(m.length!=q.length){q=d(q).filter(function(s,y){return d.inArray(y,t)!==-1}).toArray()}if(m.length==q.length){for(var o=0,h=q.length;o<h;o++){j=parseInt(m[o],10);g=q[o];if(isNaN(j)){switch(g){case"MM":p=d(e[n].months).filter(function(){var i=this.slice(0,m[o].length),s=m[o].slice(0,i.length);return i==s});j=d.inArray(p[0],e[n].months)+1;break;case"M":p=d(e[n].monthsShort).filter(function(){var i=this.slice(0,m[o].length),s=m[o].slice(0,i.length);return i==s});j=d.inArray(p[0],e[n].monthsShort)+1;break}}r[g]=j}for(var o=0,x;o<t.length;o++){x=t[o];if(x in r&&!isNaN(r[x])){v[x](k,r[x])}}}return k},formatDate:function(g,l,n){var m={d:g.getUTCDate(),D:e[n].daysShort[g.getUTCDay()],DD:e[n].days[g.getUTCDay()],m:g.getUTCMonth()+1,M:e[n].monthsShort[g.getUTCMonth()],MM:e[n].months[g.getUTCMonth()],yy:g.getUTCFullYear().toString().substring(2),yyyy:g.getUTCFullYear()};m.dd=(m.d<10?"0":"")+m.d;m.mm=(m.m<10?"0":"")+m.m;var g=[],k=d.extend([],l.separators);for(var j=0,h=l.parts.length;j<h;j++){if(k.length){g.push(k.shift())}g.push(m[l.parts[j]])}return g.join("")},headTemplate:'<thead><tr><th class="prev"><i class="icon-arrow-left"/></th><th colspan="5" class="switch"></th><th class="next"><i class="icon-arrow-right"/></th></tr></thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'};c.template='<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">'+c.headTemplate+"<tbody></tbody>"+c.footTemplate+'</table></div><div class="datepicker-months"><table class="table-condensed">'+c.headTemplate+c.contTemplate+c.footTemplate+'</table></div><div class="datepicker-years"><table class="table-condensed">'+c.headTemplate+c.contTemplate+c.footTemplate+"</table></div></div>";d.fn.datepicker.DPGlobal=c}(window.jQuery);;
