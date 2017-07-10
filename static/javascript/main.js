(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//Homepage Scroll interaction
var $homeBlocks = $('.home-block');

$homeBlocks.each(function (i, element) {
  var $homeBlock = $(element);

  //Peek Next
  $homeBlock.waypoint({
    handler: function handler(direction) {
      var first = this.group.first();
      var next = this.next();

      debugger;
      if (next !== first) {
        $(next.element).addClass('next-in-line');
      }
    },
    offset: '50%',
    group: 'home-middle'
  });

  //Scroll Next
  $homeBlock.waypoint({
    handler: function handler(direction) {
      console.log('waypoint 1');
    },
    offset: '2%',
    group: 'home-bottom'
  });
});

},{}]},{},[1]);
