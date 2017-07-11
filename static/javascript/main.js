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
    console.log(isMobile);
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
};

},{}]},{},[1]);
