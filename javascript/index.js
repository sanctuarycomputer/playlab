//Homepage Scroll interaction
let $homeBlocks = $('.home-block');

$homeBlocks.each((i, element) => {
  let $homeBlock = $(element);


  //Peek Next
  $homeBlock.waypoint({
    handler: function(direction) {
      let first = this.group.first();
      let next = this.next();

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
    handler: function(direction) {
      console.log('waypoint 1')
    },
    offset: '2%',
    group: 'home-bottom'
  });
})
