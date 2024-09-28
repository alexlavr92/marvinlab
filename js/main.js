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

    // Инициализация работы с анализами
    const InitAnalyzesSwitcher = {
        defaultsOptions: {
            AnalyzeGroup: 'analyzes-group-item',
            AnalyzesAllInfo: 'analyzes-wrapper-allInfo',
            AnalyzeItem: 'analyzes-item',
            AnalyzeInfoWrapper: 'analyzes-info-wrapper',
            AnalyzeSingle: 'analyzes-single-wrapper',
            BackLink: 'analyze-back',
            windowWidth: document.body.clientWidth,

        },
        checkAdaptive: function (width) {
            this.defaultsOptions.windowWidth = width
            const NowWidth = this.defaultsOptions.windowWidth
            // console.log(NowWidth)
            if (NowWidth < 1200) {
                if (!$('.analyzes-right').find('.analyzes-main').length)
                    $('.analyzes-main').insertAfter('.analyzes-right > .heading-wrapper')
                // $('.' + this.defaultsOptions.AnalyzeGroup + ' > .analyzes-name.active').addClass('active-mob')
                if (!$('.' + this.defaultsOptions.AnalyzeGroup + ' > .analyzes-name.active').next('.' + this.defaultsOptions.AnalyzesAllInfo + '').length) {
                    const mobActiveGroupItem = $('.' + this.defaultsOptions.AnalyzeGroup + ' > .analyzes-name.active')
                    $('.' + this.defaultsOptions.AnalyzesAllInfo + '').insertAfter(mobActiveGroupItem)
                }
                if (!$('.' + this.defaultsOptions.AnalyzeGroup + ' > .analyzes-name').hasClass('active-mob')) {
                    $('.' + this.defaultsOptions.AnalyzeGroup + ' > .analyzes-name.active').addClass('active-mob')
                    $('.' + this.defaultsOptions.AnalyzesAllInfo + '').hide().slideDown()
                }
            }
            else {
                $('.' + this.defaultsOptions.AnalyzeGroup + ' > .analyzes-name.active-mob').removeClass('active-mob')
                if (!$('.analyzes-right > .' + this.defaultsOptions.AnalyzesAllInfo + '').length)
                    $('.' + this.defaultsOptions.AnalyzesAllInfo + '').appendTo('.analyzes-right')
                if (!$('.analyzes-wrapper > .analyzes-main').length)
                    $('.analyzes-main').prependTo('.analyzes-wrapper')
            }
        },
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            this.events(options)
            this.checkAdaptive(options.windowWidth)
        },
        events: function (options) {
            const $thisObj = this
            $('body').on('click', '.' + options.AnalyzeItem + '', function (e) {
                e.preventDefault()
                const $this = $(this),
                    $thisInfoWrapper = $this.closest('.' + options.AnalyzeInfoWrapper + ''),
                    $thisAnalyzeSingle = $thisInfoWrapper.siblings('.' + options.AnalyzeSingle + '')

                // console.log($thisAnalyzeSingle)
                $thisInfoWrapper.hide({
                    duration: 0,
                    complete: function () {
                        $thisAnalyzeSingle.fadeIn({
                            duration: 500,
                            start: function () {
                                $(this).css('display', 'flex')
                            }
                        });
                    }
                })
            })
            $('body').on('click', '.' + options.AnalyzeSingle + ' .' + options.BackLink + '', function (e) {
                e.preventDefault()
                const $this = $(this),
                    $thisAnalyzeSingle = $this.closest('.' + options.AnalyzeSingle + ''),
                    $thisInfoWrapper = $thisAnalyzeSingle.siblings('.' + options.AnalyzeInfoWrapper + '')
                // console.log($thisInfoWrapper)
                $thisAnalyzeSingle.hide({
                    duration: 0,
                    complete: function () {
                        $thisInfoWrapper.fadeIn({
                            duration: 500,
                            start: function () {
                                $(this).css('display', 'flex')
                            }
                        });
                    }
                })
            })
            $('.' + options.AnalyzeGroup + ' .analyzes-name').on('click', function (e) {
                e.preventDefault()
                const $this = $(this)
                // console.log($this)
                $this.parent('.' + options.AnalyzeGroup + '').siblings().find('.active').removeClass('active')
                $this.addClass('active')
                if (options.windowWidth < 1200) {
                    $this.toggleClass('active-mob')
                    if (!$this.hasClass('active-mob'))
                        $('.' + options.AnalyzesAllInfo + '').slideUp()
                    if ($this.hasClass('active-mob')) {
                        $this.parent('.' + options.AnalyzeGroup + '').siblings().find('.active-mob').removeClass('active-mob')
                    }
                }


                const link = './analyze-content.html'

                // ajax запрос для обновления контента
                $.ajax({
                    url: link,
                    /*   cache: false, */
                    dataType: 'html',
                    success: function (response) {
                        const ContentWrapper = $(response)
                        if (options.windowWidth >= 1200) {
                            $('body').find('.analyzes-right > .' + options.AnalyzesAllInfo + '> *').remove()
                            $(ContentWrapper).appendTo('.analyzes-right > .' + options.AnalyzesAllInfo + '')
                            console.log($(ContentWrapper))
                            $('body').find('.' + options.AnalyzesAllInfo + '').hide().fadeIn(500)
                        }
                        else {
                            if (!$this.next('.' + options.AnalyzesAllInfo + '').length) {
                                $('body').find('.' + options.AnalyzesAllInfo + '> *').remove()
                                $(ContentWrapper).appendTo('.' + options.AnalyzesAllInfo + '')
                                $('.' + options.AnalyzesAllInfo + '').insertAfter($this)
                            }

                            // console.log($('.' + options.AnalyzesAllInfo + ''))
                            if ($this.hasClass('active-mob'))
                                $('.' + options.AnalyzesAllInfo + '').hide().slideDown({
                                    start: function () {
                                        const $thisOffsetTop = $this.offset().top - $('header > .new-container').height()
                                        console.log($thisOffsetTop)
                                        $('html, body').scrollTop($thisOffsetTop - 40);
                                    }
                                })
                        }
                    },
                    error: function (request, status, error) {
                        // console.log(request.status)
                        errorShow(request.status)
                    },
                    statusCode: {
                        200: function () {
                            /*  console.log($(this)) */
                        },
                        404: function () { // выполнить функцию если код ответа HTTP 404
                            let Status = '404'
                            errorShow(Status)
                        },
                        403: function () { // выполнить функцию если код ответа HTTP 403
                            let Status = '403'
                            errorShow(Status)
                        },
                        408: function () { // превышено время
                            let Status = '408'
                            errorShow(Status)
                        },
                        504: function () { // превышено время
                            alert("доступ запрещен");
                            let Status = '504'
                            errorShow(Status)
                        }
                    }
                });
            })
            $(window).on('resize', function () {
                if (options.windowWidth != document.body.clientWidth) {
                    options.windowWidth = document.body.clientWidth
                    $thisObj.checkAdaptive(options.windowWidth)
                    // console.log(options.windowWidth)
                }
            })
        }
    }
    if ($('.analyzes-group-item').length)
        InitAnalyzesSwitcher.init()
    // ------------------------------------

    // Инициализация аккордеонов
    const InitAccordeon = {
        defaultsOptions: {
            accordeonWrapper: 'accordeon-wrapper'
        },
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            this.events(options)
        },
        events: function (options) {
            $('body').on('click', '.' + options.accordeonWrapper + ' .accordeon-title', function (e) {
                e.preventDefault()
                const $this = $(this),
                    $thisAccordeonWrapper = $this.parent('.' + options.accordeonWrapper + ''),
                    $thisAccordeonContent = $this.next('.accordeon-content')
                // console.log($this, $thisAccordeonWrapper, $thisAccordeonContent)
                $thisAccordeonContent.slideToggle({
                    start: function () {
                        !$thisAccordeonWrapper.hasClass('active')
                            ? $thisAccordeonWrapper.addClass('active')
                            : $thisAccordeonWrapper.removeClass('active')
                    }
                })
            })
        }
    }

    if ($('.accordeon-wrapper').length)
        InitAccordeon.init()
    // ------------------------------------

})