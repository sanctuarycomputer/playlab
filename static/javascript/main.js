(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var notMobile = !/iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase());
var SCROLL_DURATION = 600;
var SMALL_SCREEN = 450;
var TITLE_BAR_HEIGHT = 125;
var windowWidth = void 0;
var path = window.location.pathname;
var route = path.split('/');
var routeName = route.length > 1 ? route[1] : null;

/**
// Only apply waypoint
// interactions if not mobile
**/

if (notMobile && $(window).width() >= SMALL_SCREEN) {
  //Homepage scroll interaction
  var $homeBlocks = $('.home-block');
  var $introTrigger = $('.intro-trigger');

  $($homeBlocks[0]).find('.title-bar').addClass('next');

  $homeBlocks.each(function (i, element) {
    var $homeBlock = $(element);

    //Peek Next
    $homeBlock.waypoint({
      handler: function handler(direction) {
        if (direction === 'down') {
          $(this.element).find('.title-bar').removeClass('next');
        }

        if (direction === 'up') {
          $('.title-bar').removeClass('next');
          $(this.element).find('.title-bar').addClass('next');
        }
      },
      offset: function offset() {
        return $(window).innerHeight() - TITLE_BAR_HEIGHT / 2;
      }
    });

    //Scroll Next
    $homeBlock.waypoint({
      handler: function handler(direction) {
        if (this !== this.group.last()) {
          var next = this.next().element;
          $(next).find('.title-bar').addClass('next');
        }
      },
      offset: 25
    });
  });

  //Homepage click next
  var $sectionBar = $('.title-bar');
  $sectionBar.on('click', function () {
    var $this = $(this);
    if ($this.hasClass('next')) {
      $this.removeClass('next');
      var sectionTop = $this.offset().top;
      $('html,body').animate({
        scrollTop: sectionTop
      }, SCROLL_DURATION, 'swing');
    }
  });

  // Work/Info page scroll interaction
  var $stickyTopWrapper = $('.sticky-top-wrapper');
  var $stickyBottomWrapper = $('.sticky-bottom-wrapper');
  var $bottomHeader = $('.bottom-header');
  var $bottomContentWrapper = $('.bottom-content-wrapper');

  $stickyBottomWrapper.waypoint({
    handler: function handler(direction) {
      if (direction === 'down') {
        var bottomHeaderTop = $(this.element).offset().top - $(window).scrollTop();
        $bottomHeader.css({
          position: 'fixed',
          left: 0,
          right: 0,
          top: bottomHeaderTop
        });
        $bottomContentWrapper.css('padding-top', $bottomHeader.height());
        $(this.element).addClass('scrolling');
      } else if (direction === 'up') {
        $bottomHeader.removeAttr('style');
        $bottomContentWrapper.css('padding-top', '');
        $(this.element).removeClass('scrolling');
      }
    },
    offset: function offset() {
      return Waypoint.viewportHeight() - (this.element.clientHeight - 2);
    }
  });

  $stickyBottomWrapper.waypoint({
    handler: function handler(direction) {
      if (direction === 'down') {
        $bottomHeader.removeClass('fixed-bottom');
        $stickyBottomWrapper.css({ 'margin-top': $stickyTopWrapper.outerHeight() });
        $stickyTopWrapper.addClass('top-stick');
      } else if (direction === 'up') {
        $bottomHeader.addClass('fixed-bottom');
        $stickyBottomWrapper.css({ 'margin-top': '' });
        $stickyTopWrapper.removeClass('top-stick');
      }
    },
    offset: '97%'
  });

  //Info/Work Bottom header scroll to
  $bottomHeader.on('click', function () {
    var $this = $(this);
    if ($this.hasClass('fixed-bottom')) {
      var sectionTop = $this.offset().top + $this.parent().offset().top;
      $('html,body').animate({
        scrollTop: sectionTop
      }, SCROLL_DURATION, 'swing');
    }
  });

  //Info subsection
  var $infoTabs = $('.info-tab');
  var $infoSubsection = $('#info-subsection');
  var $activeTab = $('.active-tab');

  //Initial setup
  if (routeName === 'info') {
    var $activeSectionName = $activeTab.data().type;
    var $activeSection = $infoSubsection.find('#' + $activeSectionName);
    $activeSection.addClass('active-content');

    $infoTabs.on('click', function (e) {
      var $targetTab = $(e.target);
      var $activeTab = $('.active-tab');
      if ($targetTab.hasClass('active-tab')) {
        return;
      }

      $activeTab.removeClass('active-tab');
      $targetTab.addClass('active-tab');

      var $selectedSectionName = $targetTab.data().type;
      var $selectedSection = $infoSubsection.find('#' + $selectedSectionName);
      $('.active-content').removeClass('active-content');
      $selectedSection.addClass('active-content');
    });
  };

  //Info Image trigger
  var $imageTrigger = $('.image-trigger');

  $('.image-trigger').each(function () {
    var $this = $(this);
    $this.mouseenter(function () {
      var $this = $(this);
      $this.parent().siblings('.hover-image').addClass('is-showing');
    });
    $this.mouseleave(function () {
      var $this = $(this);
      $this.parent().siblings('.hover-image').removeClass('is-showing');
    });
  });
};

// Fixes Issue #63: Footer mobile swipe up fix
function checkFooter() {
  $(document).scrollTop() > 10 ? $('#footer').removeClass('inactive') : $('#footer').addClass('inactive');
}
// Fixes Issue #64: Footer spacer sizing
function checkFooterSpacer() {
  if (!notMobile) $('.footer-spacer').height($(window).height());
}

function sizeVideo() {
  $('.Video').each(function () {
    var $iframe = $(this).find('iframe');
    var iHeight = parseInt($iframe.attr('height'));
    var iWidth = parseInt($iframe.attr('width'));
    var vWidth = $(this).width();
    var vHeight = iHeight / iWidth * vWidth;

    $(this).height(vHeight);
    $(this).parent().height(vHeight);
  });
}

$(window).scroll(function () {
  checkFooter();
});

$(window).resize(function () {
  sizeVideo();
  checkFooterSpacer();
});

$(document).ready(function () {
  sizeVideo();
  checkFooter();
  checkFooterSpacer();
});

$(window).load(function () {
  var navMenus = document.getElementsByClassName('nav-menu');
  var $navMenus = $(navMenus);
  var $scrollContainer = $('.html');
  var $mobileNav = $('.mobile-nav-bar');
  var $hamburger = $('.hamburger');
  var $mobileMenu = $('.mobile-menu');

  //Headroom
  $navMenus.each(function () {
    var that = this;
    var headroomMenu = new Headroom(that, {
      tolerance: 5,
      offset: 205,
      classes: {
        initial: "animated",
        pinned: "slide-down",
        unpinned: "slide-up"
      }
    });
    headroomMenu.init();
  });

  //Nav Select state
  if (routeName) {
    var navEl = $navMenus.find('[data-route=\'' + routeName + '\']');
    navEl.find('.select').addClass('active');
  };

  //Mobile Nav
  $hamburger.on('click', function () {
    if ($mobileNav.hasClass('active')) {
      $scrollContainer.removeClass('overflow-hidden');
      $mobileNav.removeClass('active');
      $hamburger.removeClass('active');
      return $mobileMenu.removeClass('is-showing');
    }
    $scrollContainer.addClass('overflow-hidden');
    $mobileNav.addClass('active');
    $hamburger.addClass('active');
    return $mobileMenu.addClass('is-showing');
  });
});

//Image Gallery
$('.image-slider').each(function () {
  var $this = $(this);

  $this.slick({
    fade: true,
    cssEase: 'ease-in-out',
    prevArrow: $this.prev(),
    nextArrow: $this.next()
  });
});

//Flag touch/hover
(function () {
  var count = 0,
      showUsa = false;

  $('.flag-trigger').on('mouseenter click', function () {
    var $flags = $('.flag');
    var $russia = $('.russia'),
        $brazil = $('.brazil');

    if (showUsa) {
      showUsa = false;
      return $flags.removeClass('is-showing');
    };

    if (count % 2 === 0) {
      $brazil.addClass('is-showing');
      count += 1;
      return showUsa = true;
    }
    $russia.addClass('is-showing');
    count += 1;
    return showUsa = true;
  });
})();

//Midnight Js
$(document).ready(function () {
  var midnightHeaders = $('[data-midnight]');

  midnightHeaders.each(function () {
    var $this = $(this);
    var initialDataAttr = $this.data('midnight');
    var newDataAttr = initialDataAttr.split('#').join('');
    var colorsArray = initialDataAttr.split('-').slice(1, 3);
    $this.data('midnight', newDataAttr);
    var midnightStyle = $('\n      <style>\n        .header > .midnightHeader.' + newDataAttr + ' {\n          color: ' + colorsArray[0] + ';\n          background-color: ' + colorsArray[1] + ';\n        }\n        .mobile-nav-bar > .midnightHeader.' + newDataAttr + ' {\n          color: ' + colorsArray[0] + ';\n          background-color: ' + colorsArray[1] + ';\n        }\n        .mobile-nav-bar > .midnightHeader.' + newDataAttr + ' .hamburger span {\n          background-color: ' + colorsArray[0] + ' !important;\n        }\n      </style>');
    midnightStyle.appendTo('head');
  });

  $('.header').midnight();
  $('.mobile-nav-bar').midnight();
});

var $shopSlider = $('.shop-slider');
var $productImageSliders = $('.product-image-slider');

$shopSlider.slick({
  fade: true,
  slidesToShow: 1,
  arrows: false,
  dots: true,
  dotsClass: 'shop-dots',
  swipe: false
});

//Image Gallery
$productImageSliders.each(function () {
  var $this = $(this);
  $this.slick({
    slidesToShow: 1,
    arrows: true,
    prevArrow: '',
    nextArrow: $this.next()
  });
});

// Slider to Slider interaction
$productImageSliders.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
  if (nextSlide === 0) {
    $shopSlider.slick('slickNext');
    var nextProductHash = $shopSlider.find('.slick-current').data().productHash;
    window.location.hash = nextProductHash;
  }
});

$shopSlider.on('afterChange', function (e, slick, currentSlide) {
  var $this = $(this);
  var nextProductHash = $this.find('.product-slide.slick-current').data().productHash;
  window.location.hash = nextProductHash;
});

// Fixes #68: Issue with product carousels with single image not advancing to next product
$('.next-arrow').click(function () {
  if ($(this).parent().find('.slick-slide').length <= 1) {
    $shopSlider.slick('slickNext');
    var nextProductHash = $shopSlider.find('.slick-current').data().productHash;
    window.location.hash = nextProductHash;
  }
});

if (path === '/shop/' || path === '/shop') {
  if (!window.location.hash) {
    var _productHash = $shopSlider.find('.slick-current').data().productHash;
    window.location.hash = _productHash;
  }
  var productHash = window.location.hash;
  var productIndex = $shopSlider.find('[data-product-hash=\'' + productHash.split('#')[1] + '\']').index();
  $shopSlider.slick('slickGoTo', productIndex);
}

$('.buy-button').on('click', function () {
  var productLink = void 0;
  var $productPurchase = $(this).closest('.product-purchase');
  var baseUrl = $productPurchase.find('.variant-select')[0].value;
  var quantity = $productPurchase.find('.quant')[0].value;

  if (quantity > 1) {
    productLink = baseUrl + '&quantity=' + quantity;
  } else {
    productLink = baseUrl;
  }

  window.open(productLink, '_blank');
});

var inputMax = 9;

$('input[type=number]').on('mouseup keyup', function () {
  var $this = $(this);

  if ($this.val() > inputMax) {
    $this.val(inputMax);
  }
});

},{}]},{},[1]);
