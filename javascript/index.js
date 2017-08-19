const notMobile = !(/iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase()));
const  SCROLL_DURATION = 600;
const  SMALL_SCREEN = 450;
let windowWidth;
let path = window.location.pathname;
let route = path.split('/');
let routeName = route.length > 1 ? route[1] : null;

/**
// Only apply waypoint
// interactions if not mobile
**/

if (notMobile && $(window).width() >= SMALL_SCREEN) {
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

  //Homepage click next
  let $sectionBar = $('.title-bar');
  $sectionBar.on('click', function(){
    let $this = $(this);
    if ($this.hasClass('next')) {
      $this.removeClass('next');
      let sectionTop = $this.offset().top;
      $('html,body').animate({
        scrollTop: sectionTop
      }, SCROLL_DURATION, 'swing');
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

  //Info/Work Bottom header scroll to
  $bottomHeader.on('click', function(){
    let $this = $(this);
    if ($this.hasClass('fixed-bottom')) {
      let sectionTop = $this.offset().top + $this.parent().innerHeight();
      $('html,body').animate({
        scrollTop: sectionTop
      }, SCROLL_DURATION, 'swing');
    }
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


$(window).load(function() {
  let navMenus = document.getElementsByClassName('nav-menu');
  let $navMenus = $(navMenus);
  let $scrollContainer = $('.html');
  let $mobileNav = $('.mobile-nav-bar');
  let $hamburger = $('.hamburger');
  let $mobileMenu = $('.mobile-menu');

  //Headroom
  $navMenus.each(function(){
    let that = this;
    let headroomMenu = new Headroom(that, {
      tolerance: 5,
      offset : 205,
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
    let navEl = $navMenus.find(`[data-route='${routeName}']`);
    navEl.find('.select').addClass('active');
  };

  //Mobile Nav
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

//Flag touch/hover
(function() {
  let count = 0,
      showUsa = false;

  $('.flag-trigger').on('mouseenter click', function() {
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
}());

//Midnight Js
$(document).ready(function(){
  let midnightHeaders = $('[data-midnight]');

  midnightHeaders.each(function() {
    let $this = $(this);
    let initialDataAttr = $this.data('midnight');
    let newDataAttr = initialDataAttr.split('#').join('');
    let colorsArray = initialDataAttr.split('-').slice(1, 3);
    $this.data('midnight', newDataAttr);
    let midnightStyle = $(`
      <style>
        .header > .midnightHeader.${newDataAttr} {
          color: ${colorsArray[0]};
          background-color: ${colorsArray[1]};
        }
        .mobile-nav-bar > .midnightHeader.${newDataAttr} {
          color: ${colorsArray[0]};
          background-color: ${colorsArray[1]};
        }
        .mobile-nav-bar > .midnightHeader.${newDataAttr} .hamburger span {
          background-color: ${colorsArray[0]} !important;
        }
      </style>`)
    midnightStyle.appendTo('head');
  });

  $('.header').midnight();
  $('.mobile-nav-bar').midnight();
});
