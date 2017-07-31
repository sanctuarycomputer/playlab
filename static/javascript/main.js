(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var isMobile = /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase());
var SCROLL_DURATION = 600;
var path = window.location.pathname;
var route = path.split('/');
var routeName = route.length > 1 ? route[1] : null;
/**
// Only apply waypoint
// interactions if not mobile
**/

if (!isMobile) {
  //Homepage scroll interaction
  var $homeBlocks = $('.home-block');
  var $introTrigger = $('.intro-trigger');
  var TITLE_BAR_HEIGHT = 125;

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

  //Back to top
  $introTrigger.waypoint({
    handler: function handler(direction) {
      if (direction === 'down') {
        window.scrollTo(0, 0);
      }
    },
    offset: function offset() {
      return TITLE_BAR_HEIGHT / 2;
    }
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
        $bottomHeader.removeClass('fixed-bottom');
        $stickyBottomWrapper.css({ 'margin-top': $stickyTopWrapper.outerHeight() });
        $stickyTopWrapper.addClass('top-stick');
      }
      if (direction === 'up') {
        $bottomHeader.addClass('fixed-bottom');
        $stickyBottomWrapper.css({ 'margin-top': '' });
        $stickyTopWrapper.removeClass('top-stick');
      }
    },
    offset: '97%'
  });

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
      }
      if (direction === 'up') {
        $bottomHeader.removeAttr('style');
        $bottomContentWrapper.css('padding-top', '');
        $(this.element).removeClass('scrolling');
      }
    },
    offset: 'bottom-in-view'
  });

  //Info/Work Bottom header scroll to
  $bottomHeader.on('click', function () {
    var $this = $(this);
    if ($this.hasClass('fixed-bottom')) {
      var sectionTop = $this.offset().top + $this.parent().innerHeight();
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

  //Shop Page
  var $productBlocks = $('.product');
  var $shopViewContext = $('.shop-view-context');
  var $productImageContainer = $('.product-image-container');
  var $gradientOverlay = $('.gradient-overlay');

  $productBlocks.each(function (i, element) {
    var $productBlock = $(element);
    var $productDetails = $('.product-details');

    //Scroll down
    $productBlock.waypoint({
      handler: function handler(direction) {
        if (direction === 'down') {
          var $thisEl = $(this.element);
          var activeUrl = $thisEl.data().image;
          var showGradient = $thisEl.data().gradient;
          if (showGradient) {
            $gradientOverlay.addClass('show');
          } else {
            $gradientOverlay.removeClass('show');
          }
          $productImageContainer.css('background-image', 'url(' + activeUrl + ')');
          $productBlocks.removeClass('in-view');
          $thisEl.addClass('in-view');
        }
      }
    });

    //Scroll up
    $productBlock.waypoint({
      handler: function handler(direction) {
        if (direction === 'up') {
          var $thisEl = $(this.element);
          var activeUrl = $thisEl.data().image;
          var showGradient = $thisEl.data().gradient;
          if (showGradient) {
            $gradientOverlay.addClass('show');
          } else {
            $gradientOverlay.removeClass('show');
          }
          $productImageContainer.css('background-image', 'url(' + activeUrl + ')');
          $productBlocks.removeClass('in-view');
          $thisEl.addClass('in-view');
        }
      },
      offset: '-25%'
    });
  });
};

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
    prevArrow: '',
    nextArrow: $this.next()
  });
});

//Flag touch/hover
(function () {
  var count = 0,
      showUsa = false;

  $('.flag-trigger').on('mouseenter tap', function () {
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
  $('.header').midnight();
  $('.mobile-nav-bar').midnight();
});

},{}]},{},[1]);
