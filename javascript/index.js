const isMobile = /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase());
let path = window.location.pathname;
let route = path.split('/');
let routeName = route.length > 1 ? route[1] : null;
/**
// Only apply waypoint
// interactions if not mobile
**/

if (!isMobile) {
  //Homepage scroll interaction
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
  });

  //Homepage click next
  let $sectionBar = $('.title-bar');
  $sectionBar.on('click', function(){
    let $this = $(this);
    if ($this.hasClass('next')) {
      $this.removeClass('next');
      let sectionTop = $this.offset().top;
      window.scrollTo(0, sectionTop);
    }
  });


  // Work/Info page scroll interaction
  let $stickyTopWrapper = $('.sticky-top-wrapper');
  let $stickyBottomWrapper = $('.sticky-bottom-wrapper');
  let $bottomHeader = $('.bottom-header');
  let $bottomContentWrapper = $('.bottom-content-wrapper');

  $stickyBottomWrapper.waypoint({
    handler: function (direction) {
      if (direction ==='down') {
        $bottomHeader.removeClass('fixed-bottom');
        $stickyBottomWrapper.css({'margin-top': $stickyTopWrapper.outerHeight() });
        $stickyTopWrapper.addClass('top-stick');
      }
      if (direction === 'up') {
        $bottomHeader.addClass('fixed-bottom');
        $stickyBottomWrapper.css({'margin-top': ''});
        $stickyTopWrapper.removeClass('top-stick');
      }
    },
    offset: '97%',
  });

  $stickyBottomWrapper.waypoint({
    handler: function(direction) {
      if (direction === 'down') {
        let bottomHeaderTop = $(this.element).offset().top - $(window).scrollTop();
        $bottomHeader.css({
          position: 'fixed',
          left: 0,
          right: 0,
          top: bottomHeaderTop,
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
    offset: 'bottom-in-view',
  });

  //Info subsection
  let $infoTabs = $('.info-tab');
  let $infoSubsection = $('#info-subsection');
  let $activeTab = $('.active-tab');

  //Initial setup
  if (routeName === 'info') {
    let $activeSectionName = $activeTab.data().type;
    let $activeSection = $infoSubsection.find(`#${$activeSectionName}`);
    $activeSection.addClass('active-content');

    $infoTabs.on('click', (e) => {
      let $targetTab = $(e.target);
      let $activeTab = $('.active-tab');
      if ($targetTab.hasClass('active-tab')) { return; }

      $activeTab.removeClass('active-tab');
      $targetTab.addClass('active-tab');

      let $selectedSectionName = $targetTab.data().type;
      let $selectedSection = $infoSubsection.find(`#${$selectedSectionName}`);
      $('.active-content').removeClass('active-content');
      $selectedSection.addClass('active-content');
    });
  };

  //Info Image trigger
  let $imageTrigger = $('.image-trigger');

  $('.image-trigger').each(function() {
    let $this = $(this);
    $this.mouseenter(function() {
      let $this = $(this);
      $this.parent().siblings('.hover-image').addClass('is-showing');
    });
    $this.mouseleave(function() {
      let $this = $(this);
      $this.parent().siblings('.hover-image').removeClass('is-showing');
    });
  });


  //Shop Page
  let $productBlocks = $('.product');
  let $shopViewContext = $('.shop-view-context');
  let $productImageContainer = $('.product-image-container');
  let $gradientOverlay  = $('.gradient-overlay');

  $productBlocks.each((i, element) => {
    let $productBlock = $(element);
    let $productDetails = $('.product-details');


    //Scroll down
    $productBlock.waypoint({
      handler: function(direction) {
        if (direction === 'down') {
          let $thisEl = $(this.element);
          let activeUrl = $thisEl.data().image;
          let showGradient = $thisEl.data().gradient;
          if (showGradient) {
            $gradientOverlay.addClass('show')
          } else {
            $gradientOverlay.removeClass('show')
          }
          $productImageContainer.css('background-image', `url(${activeUrl})`);
          $productBlocks.removeClass('in-view');
          $thisEl.addClass('in-view');
        }
      },
    });

    //Scroll up
    $productBlock.waypoint({
      handler: function(direction) {
        if (direction === 'up') {
          let $thisEl = $(this.element);
          let activeUrl = $thisEl.data().image;
          let showGradient = $thisEl.data().gradient;
          if (showGradient) {
            $gradientOverlay.addClass('show')
          } else {
            $gradientOverlay.removeClass('show')
          }
          $productImageContainer.css('background-image', `url(${activeUrl})`);
          $productBlocks.removeClass('in-view');
          $thisEl.addClass('in-view');
        }
      },
      offset: '-25%',
    });
  });
};

//Headroom
let navMenu =  document.getElementById('nav-menu');
let headroomMenu  = new Headroom(navMenu, {
  tolerance: 5,
  offset : 205,
  classes: {
    initial: "animated",
    pinned: "slide-down",
    unpinned: "slide-up"
  }
});
headroomMenu.init();

//Nav: Select-state
$('document').ready(function () {
  if (routeName) {
    let $activeNavLink = $(navMenu).find(`[data-route='${routeName}']`)
    $activeNavLink.addClass('active');
  }
});

//Mobile nav
let $scrollContainer = $('.html');
let $mobileNav = $('.mobile-nav-bar');
let $hamburger = $('.hamburger');
let $mobileMenu = $('.mobile-menu');

$hamburger.on('click', () => {
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


//Image Gallery
$('.image-slider').each(function(){
  let $this = $(this);
  $this.slick({
    fade: true,
    cssEase: 'ease-in-out',
    prevArrow: '',
    nextArrow: $this.next(),
  })
});

(function() {
  let count = 0,
      showUsa = false;

  $('.flag-trigger').on('mouseenter tapstart', function() {
    let $flags  = $('.flag');
    let $russia = $('.russia'),
        $brazil = $('.brazil');

    if (showUsa) {
      showUsa = false;
      return $flags.removeClass('is-showing')
    };

    if (count % 2 === 0) {
      $brazil.addClass('is-showing');
      count +=1;
      return showUsa = true;
    }
    $russia.addClass('is-showing');
    count +=1;
    return showUsa = true;
  });
}())
