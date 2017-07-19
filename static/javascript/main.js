(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var isMobile = /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase());

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

  //Shop Page
  var $productBlocks = $('.product');
  var $shopViewContext = $('.shop-view-context');

  $productBlocks.each(function (i, element) {
    var $productBlock = $(element);
    var $productDetails = $('.product-details');

    //Scroll down
    $productBlock.waypoint({
      handler: function handler(direction) {
        if (direction === 'down') {
          $productBlocks.removeClass('in-view');
          $(this.element).addClass('in-view');
        }
      }
    });

    //Scroll up
    $productBlock.waypoint({
      handler: function handler(direction) {
        if (direction === 'up') {
          $productBlocks.removeClass('in-view');
          $(this.element).addClass('in-view');
        }
      },
      offset: '-25%'
    });
  });
};

//Headroom
var navMenu = document.getElementById('nav-menu');
var headroomMenu = new Headroom(navMenu, {
  tolerance: 5,
  offset: 205,
  classes: {
    initial: "animated",
    pinned: "slide-down",
    unpinned: "slide-up"
  }
});
headroomMenu.init();

//Nav: Select-state
$('document').ready(function () {
  var path = window.location.pathname;
  var route = path.split('/');
  var routeName = route.length > 1 ? route[1] : null;

  if (routeName) {
    var $activeNavLink = $(navMenu).find('[data-route=\'' + routeName + '\']');
    $activeNavLink.addClass('active');
  }
});

//Mobile nav
var $scrollContainer = $('.html');
var $mobileNav = $('.mobile-nav-bar');
var $hamburger = $('.hamburger');
var $mobileMenu = $('.mobile-menu');

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

},{}]},{},[1]);
