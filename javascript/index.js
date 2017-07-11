//Homepage Scroll interaction
let $homeBlocks = $('.home-block');

$($homeBlocks[0]).find('.title-bar').addClass('next');

$homeBlocks.each((i, element) => {
  let $homeBlock = $(element);

  //Peek Next
  $homeBlock.waypoint({
    handler: function(direction) {
      $(this.element).find('.title-bar').removeClass('next');
    },
    offset: function() {
      return $(window).innerHeight() - (125/2);
    }
  });

  //Scroll Next
  $homeBlock.waypoint({
    handler: function(direction) {
      let next = this.next().element;
      $(next).find('.title-bar').addClass('next');
    },
    offset: 25,
    group: 'home-bottom'
  });
})
