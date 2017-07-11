const isMobile = /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase());

/**
// Only apply waypoints
// interaction if not mobile
**/

if (!isMobile) {
  //Homepage Scroll interaction
  let $homeBlocks = $('.home-block');
  let $introTrigger = $('.intro-trigger');
  const TITLE_BAR_HEIGHT = 125;

  $($homeBlocks[0]).find('.title-bar').addClass('next');

  $homeBlocks.each((i, element) => {
    let $homeBlock = $(element);

    //Peek Next
    $homeBlock.waypoint({
      handler: function(direction) {
        if (direction === 'down') {
          $(this.element).find('.title-bar').removeClass('next');
        }

        if (direction === 'up') {
          $('.title-bar').removeClass('next');
          $(this.element).find('.title-bar').addClass('next');
        }
      },
      offset: function() {
        return $(window).innerHeight() - (TITLE_BAR_HEIGHT/2);
      }
    });

    //Scroll Next
    $homeBlock.waypoint({
      handler: function(direction) {
        if (this !== this.group.last()) {
          let next = this.next().element;
          $(next).find('.title-bar').addClass('next');
        }
      },
      offset: 25,
    });
  });

  //Back to top
  $introTrigger.waypoint({
    handler: function(direction) {
      if (direction === 'down') {
        window.scrollTo(0, 0);
      }
    },
    offset: function() {
      return TITLE_BAR_HEIGHT/2;
    }
  })
};
let $stickyProjectWrapper = $('.sticky-project-wrapper');
let $stickyArchiveWrapper = $('.sticky-archive-wrapper');
let $stickyWrappers = $('.sticky-wrapper');

$stickyWrappers.each((i, element) => {
  let $stickyWrapper = $(element);

  $stickyWrapper.waypoint({
    handler: function() {
      console.log('hit the top');
    }
  });

  $stickyWrapper.waypoint({
    handler: function() {
      console.log('hit the bottom');
    }
  });
});

new Waypoint.Sticky({
  element: $stickyProjectWrapper,
  handler: function() {
    console.log(this, ' project wrapper got stuck');
  }
});

new Waypoint.Sticky({
  element: $stickyArchiveWrapper,
  handler: function() {
    console.log(this, ' archive wrapper got stuck');
  }
});
