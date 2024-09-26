'use strict'


let docWidth = document.body.clientWidth

// Функционал блокировки скрола при открытии модального окна
const BlockScroll = {
    open: function () {
        setTimeout(function () {

            if (!document.body.hasAttribute('data-body-scroll-fix')) {
                let scrollPosition = window.pageYOffset || document.documentElement.scrollTop; // Получаем позицию прокрутки

                document.body.setAttribute('data-body-scroll-fix', scrollPosition); // Cтавим атрибут со значением прокрутки
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = '-' + scrollPosition + 'px';
                document.body.style.left = '0';
                document.body.style.right = '0';
                if ($('body').height() < $(window).height()) {
                    document.body.style.bottom = '0';
                }

            }
        }, 10);
    },
    close: function () {
        setTimeout(function () {
            if (document.body.hasAttribute('data-body-scroll-fix')) {

                let scrollPosition = document.body.getAttribute('data-body-scroll-fix'); // Получаем позицию прокрутки из атрибута

                document.body.removeAttribute('data-body-scroll-fix'); // Удаляем атрибут
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                window.scroll(0, scrollPosition); // Прокручиваем на полученное из атрибута значение
            }
        }, 10)
    }
}
// ------------------------------------

jQuery(document).ready(function ($) {

    // Инициализация плагина анимации
    AOS.init({
        once: true,
    });
    // ------------------------------------

    // Функционал работы Header 
    const InitHeader = {
        defaultsOptions: {
            headerWrapper: $('header'),
            headerHamburger: $('.header-hamburger'),
            windowWidth: document.body.clientWidth,
            lastScrollTop: 0
        },
        checkMargin: function () {
            this.defaultsOptions.headerInnerHeight = this.defaultsOptions.headerWrapper.children('.new-container').innerHeight()
            const HeaderInnerHeight = this.defaultsOptions.headerInnerHeight,
                HeaderBig = this.defaultsOptions.headerWrapper.find('.header-hidden')
            // console.log(HeaderInnerHeight)
            $('main').css({
                'padding-top': HeaderInnerHeight + 'px'
            })
            if (this.defaultsOptions.windowWidth < 1200) {
                HeaderBig.css('padding-top', (HeaderInnerHeight + 40) + 'px')
            }
            else {
                HeaderBig.css('padding-top', '')
            }
        },
        init: function () {
            this.events()
            this.checkMargin()
            this.checkAdaptive(this.defaultsOptions.windowWidth)
            // this.checkSticky($(window).scrollTop(), this.defaultsOptions.headerWrapper)

        },
        checkAdaptive: function (windowWidth) {
            // console.log(windowWidth)
            const headerWrapper = this.defaultsOptions.headerWrapper

            if (windowWidth < 1200) {


                if (headerWrapper.hasClass('show'))
                    BlockScroll.open()
                if (!$('.header-big').find('.header-link').length) {
                    const IconLinks = headerWrapper.find('.header-link')
                    IconLinks.prependTo($('.header-big'))
                }
                if (!$('.header-big').find('.header-tel').length) {
                    const headerPhone = headerWrapper.find('.header-right >.header-tel')
                    headerPhone.appendTo($('.header-big'))
                }

            }
            else {
                // console.log(windowWidth)
                if ($('.header-big').find('.header-link').length) {
                    const IconLinks = headerWrapper.find('.header-link')
                    IconLinks.appendTo($('.header-right'))
                }
                if ($('.header-big').find('.header-tel').length) {
                    const headerPhone = headerWrapper.find('.header-big .header-tel')
                    headerPhone.prependTo($('.header-right'))
                }
                BlockScroll.close()
            }
        },
        events: function () {
            const $thisObj = this,
                options = $thisObj.defaultsOptions
            options.headerHamburger.on('click', function (e) {
                e.preventDefault()
                const $this = $(this),
                    HeaderBig = options.headerWrapper.find('.header-hidden')
                $this.toggleClass('open')
                $this.hasClass('open')
                    ? HeaderBig.slideDown({
                        start: function () {
                            options.headerWrapper.addClass('show')
                            if (options.windowWidth < 1200) {
                                BlockScroll.open()
                            }

                        }
                    })
                    : HeaderBig.slideUp({
                        start: function () {
                            options.headerWrapper.removeClass('show')
                            if (options.windowWidth < 1200) {
                                BlockScroll.close()
                            }
                        }
                    })
            })
            // console.log(options.windowWidth)
            $(window).on('resize', function () {
                if (options.windowWidth != document.body.clientWidth) {
                    // console.log(options.windowWidth)
                    options.windowWidth = document.body.clientWidth
                    // console.log(options.windowWidth)
                    $thisObj.checkMargin()
                    $thisObj.checkAdaptive(options.windowWidth)
                }

            })
        }
    }


    if ($('header').length) {
        InitHeader.init()
    }
    // ------------------------------------


    // Инициализация слайдера бегущей строки
    const InitRunningLine = {
        defaultsOptions: {
            slidesVisible: 3,
            SpaceBetweenPx: 20,
            // speedLine: 10000,
            // AutoPlay: 5000,
            // windowWidth: document.body.clientWidth
        },
        init: function (options) {
            const $thisObj = this
            var options = $.extend(this.defaultsOptions, options)
            //console.log(options)
            const sliderContainer = options.sliderWrapper
            let swiper = new Swiper(sliderContainer, {
                slidesPerView: options.slidesVisible,
                grabCursor: true,
                speed: options.speedLine,
                spaceBetween: options.SpaceBetweenPx,
                freeMode: true,
                // mousewheel: true,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                // allowTouchMove: false,
                loop: true,
                autoplay: {
                    delay: 500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                breakpoints: {
                    1199: {
                        slidesPerView: 'auto',
                    },
                    767: {
                        slidesPerView: 'auto',
                        spaceBetween: 10,
                    },
                },

            })
        },
    }

    if ($('.line-slider-container').length) {
        $.each($('.line-slider-container'), function () {
            InitRunningLine.init({
                sliderWrapper: $(this),
                speedLine: parseInt($(this).attr('line-speed'))
            })
        })
    }
    // ------------------------------------
})