const notMobile = !(/iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase()));
const  SCROLL_DURATION = 600;
const  SMALL_SCREEN = 450;
const TITLE_BAR_HEIGHT = 125;
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
      } else if (direction === 'up') {
        $bottomHeader.removeAttr('style');
        $bottomContentWrapper.css('padding-top', '');
        $(this.element).removeClass('scrolling');
      }
    },
    offset: function() {
      return Waypoint.viewportHeight() - (this.element.clientHeight - 2)
    }
  });

  $stickyBottomWrapper.waypoint({
    handler: function (direction) {
      if (direction ==='down') {
        $bottomHeader.removeClass('fixed-bottom');
        $stickyBottomWrapper.css({'margin-top': $stickyTopWrapper.outerHeight() });
        $stickyTopWrapper.addClass('top-stick');
      } else if (direction === 'up') {
        $bottomHeader.addClass('fixed-bottom');
        $stickyBottomWrapper.css({'margin-top': ''});
        $stickyTopWrapper.removeClass('top-stick');
      }
    },
    offset: '97%',
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
    prevArrow: $this.prev(),
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

let $shopSlider = $('.shop-slider');
let $productImageSliders = $('.product-image-slider');


$shopSlider.slick({
  fade: true,
  slidesToShow: 1,
  arrows: false,
  dots: true,
  dotsClass: 'shop-dots',
  swipe: false,
});

//Image Gallery
$productImageSliders.each(function(){
  let $this = $(this);
  $this.slick({
    slidesToShow: 1,
    arrows: true,
    prevArrow: '',
    nextArrow: $this.next(),
  })
});

// Slider to Slider interaction
$productImageSliders.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
  if (nextSlide === 0) {
    $shopSlider.slick('slickNext');
    let nextProductHash = $shopSlider.find('.slick-current').data().productHash;
    window.location.hash = nextProductHash;
  }
});

$shopSlider.on('afterChange', function(e, slick, currentSlide) {
  let $this = $(this);
  let nextProductHash = $this.find('.product-slide.slick-current').data().productHash;
  window.location.hash = nextProductHash;
});

if (path === '/shop/') {
  if (!window.location.hash) {
    let productHash      = $shopSlider.find('.slick-current').data().productHash;
    window.location.hash = productHash;
  }
  let productHash        = window.location.hash;
  let productIndex       = $shopSlider.find(`[data-product-hash='${productHash.split('#')[1]}']`).index();
  $shopSlider.slick('slickGoTo', productIndex);
}

$('.buy-button').on('click', function() {
  let productLink;
  let $productPurchase = $(this).closest('.product-purchase');
  let baseUrl          = $productPurchase.find('.variant-select')[0].value;
  let quantity         = $productPurchase.find('.quant')[0].value;

  if (quantity > 1) {
    productLink = `${baseUrl}&quantity=${quantity}`;
  } else {
    productLink = baseUrl;
  }

  window.open(productLink,'_blank');
});
