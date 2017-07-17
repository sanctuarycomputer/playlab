(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var isMobile = /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase());
/**
// Only apply waypoints
// interaction if not mobile
**/

if (!isMobile) {
  //Homepage Scroll interaction
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

// Work Page
var $stickyProjectWrapper = $('.sticky-project-wrapper');
var $stickyArchiveWrapper = $('.sticky-archive-wrapper');
var $archiveHeader = $('.archive-header');

$stickyArchiveWrapper.waypoint({
  handler: function handler(direction) {
    if (direction === 'down') {
      $archiveHeader.removeClass('fixed-bottom');
      $stickyArchiveWrapper.css({ 'margin-top': $stickyProjectWrapper.outerHeight() });
      $stickyProjectWrapper.addClass('projects-stick');
    }
    if (direction === 'up') {
      $archiveHeader.addClass('fixed-bottom');
      $stickyArchiveWrapper.css({ 'margin-top': '' });
      $stickyProjectWrapper.removeClass('projects-stick');
    }
  },
  offset: '97%'
});

$stickyArchiveWrapper.waypoint({
  handler: function handler(direction) {
    if (direction === 'down') {
      $(this.element).addClass('scrolling');
    }
    if (direction === 'up') {
      $(this.element).removeClass('scrolling');
    }
  },
  offset: 'bottom-in-view'
});

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
