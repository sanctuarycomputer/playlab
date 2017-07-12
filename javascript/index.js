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

// Work Page
let $stickyProjectWrapper = $('.sticky-project-wrapper');
let $stickyArchiveWrapper = $('.sticky-archive-wrapper');
let $archiveHeader = $('.archive-header');

$stickyArchiveWrapper.waypoint({
  handler: function(direction) {
    if (direction ==='down') {
      $archiveHeader.removeClass('fixed-bottom');
      $stickyArchiveWrapper.css({'margin-top': $stickyProjectWrapper.outerHeight() });
      $stickyProjectWrapper.addClass('projects-stick');
    }
    if (direction === 'up') {
      $archiveHeader.addClass('fixed-bottom');
      $stickyArchiveWrapper.css({'margin-top': ''});
      $stickyProjectWrapper.removeClass('projects-stick');
    }
  },
  offset: '97%',
});

$stickyArchiveWrapper.waypoint({
  handler: function(direction) {
    if (direction === 'down') {
      $(this.element).addClass('scrolling');
    }
    if (direction === 'up') {
      $(this.element).removeClass('scrolling');
    }
  },
  offset: 'bottom-in-view'
});
