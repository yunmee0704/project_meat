'use strict';

(function () {
    var $window = $(window);
    var $document = $(document);
    var $this = $(this); //main menu

    // 초기 vh 값 설정
    let vh = $(window).height() * 0.01;
    $('html').css('--vh', `${vh}px`); // jQuery로 CSS 변수 설정

    // 창 크기 조정 이벤트 리스너
    $(window).on('resize', function () {
        let vh = $(window).height() * 0.01;
        $('html').css('--vh', `${vh}px`); // jQuery로 CSS 변수 설정
    });

    $(function () {
        var $header = $('.header');
        var $bottom = $('.fixed-menu');
        var $gotop = $('.wrapper .btn-top');
        var footerHeight = $('.footer').height(); //$bottom.addClass('is-sticky');

        $(window).scroll(function () {
            //$bottom.addClass('is-sticky');
            if ($(document).scrollTop() > 0) {
                $header.addClass('is-block');

                if ($(document).height() - $(window).height() - footerHeight >= $(window).scrollTop()) {
                    //$bottom.css({'bottom':0});
                    $gotop.show(); //$gotop.css({'bottom':80});
                } else {
                    //$bottom.removeClass('is-sticky');
                    //$gotop.css({'bottom':345});
                    //$bottom.css({'bottom':0});
                }
            } else {
                $gotop.hide();
                $header.removeClass('is-block'); //$bottom.addClass('is-sticky');
            }
        });
    }); //글쓰기

    $(document).on('click', function () {
        $('.state-action').removeClass('is-on');
    });

    $(document).on('click', '.btn-write .is-default', function (e) {
        e.preventDefault();
        $('.btn-write .is-default').hide();
        $('.btn-write .is-active').show();
        $('.btn-write .select__write').show();
    });
    $(document).on('click', '.btn-write .is-active', function (e) {
        e.preventDefault();
        $('.btn-write .is-active').hide();
        $('.btn-write .is-default').show();
        $('.btn-write .select__write').hide();
    });
    // 상단이동/헤더 모달 관련 코드는 사용하지 않아 제거


    $(document.body).on('click', '.js-modal-detail', function (e) {
        e.preventDefault();

        // 새 팝업 대상 가져오기
        var targetSelector = $(this).attr('href') || $(this).data('href');
        var $popName = $(targetSelector);

        // 기존 dimed가 있으면 재사용, 없으면 새로 생성
        var $existingDimed = $('.dimed');
        if ($existingDimed.length === 0) {
            // dimed가 없으면 새로 생성
            var dimedClass = 'dimed';
            $popName.before(`<div class='${dimedClass}'></div>`);
        } else {
            $existingDimed.css('display', 'block');
        }

        // 팝업 오픈
        $popName.addClass('is-on');
    });

    $(document.body).on('click', '.tooltip.i-info', function (e) {
        e.preventDefault();
        $('#tooltip-pop').addClass('is-on');
        $('.dimed.ten').css('display', 'block');
    });

    // 팝업 닫기
    $(document.body).on('click', '.pop__detail .js-modal-close, .pop__photo .btn-close, .dimed', function () {
        $('.dimed').css('display', 'none');
        $('.modal-toast.modal-sorting').removeClass('is-on');
        $('.pop__detail').removeClass('is-on');

        // 필요 시 스크롤 해제
        // $('html').css({ overflow: 'auto' });
    });


    // 품목표 검색 레이어 관련 코드는 사용하지 않아 제거

    // select-btn 토글 관련 공통 코드는 현재 페이지들에서 사용되지 않아 제거

    $(document.body).on('click', '.expand-btn', function (e) {
        e.stopPropagation();

        if ($(this).parents('.state-action').hasClass('is-on')) {
            $(this).parents('.state-action').removeClass('is-on');
        } else {
            $('.state-action').removeClass('is-on')
            $(this).parents('.state-action').addClass('is-on');
        }
    });

    $(document.body).on('click', '.select-btn.is-on .expand-box a', function () {
        $(this).parents().parents('.state-action').removeClass('is-on');
    }); //msg select

    // deal-action, toast-popup, msg__search 관련 코드는 사용하지 않아 제거

    // 채팅/상세 아코디언 관련 코드는 사용하지 않아 제거

    // 채팅 미니바 관련 코드는 사용하지 않아 제거

    // 커스텀 select-box 전역 위임 로직은 현재 사용하지 않아 제거

    // 페이지 내 개별 select UI 초기화 코드 제거

    // 아코디언 기능 추가
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("accordion-button")) {
            event.target.classList.toggle("active");
        }
    });
    //체크박스 기능 추가
    $(document).ready(function () {
        // 체크박스 동기화
        $(".agree-box").each(function () {
            const parentCheckbox = $(this).find(".parent");
            const childCheckboxes = $(this).find(".child");

            // 전체 동의 체크박스 클릭 시
            parentCheckbox.on("change", function () {
                childCheckboxes.prop("checked", parentCheckbox.prop("checked"));
            });

            // 개별 동의 체크박스 변경 시
            childCheckboxes.on("change", function () {
                const allChecked = childCheckboxes.length === childCheckboxes.filter(":checked").length;
                parentCheckbox.prop("checked", allChecked);
            });
        });

        // 버튼 클릭 시 active 클래스 토글
        $(".click-btn.check").on("click", function () {
            $(this).toggleClass("active");
        });
    });




    //0214 이윤미추가

    //option-list 추가
    $('.option-list li').on('click', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $('.tag__item').eq(1).find('.state-action').addClass('is-on');
        $('.search .text').parent().siblings().removeClass('typing');
    })

    //검색 인풋 창 클릭시 선택되게 하기
    $(document).on('click', '.expand-btn', function (e) {
        e.preventDefault();
        var stateAction = $(this).closest('.state-action');

        // 검색창 입력중일 때 expand-box 높이값 달라지고 아이콘 X로 변경
        $(document).on('input', '.search .text', function () {
            var typingAction = $(this).closest('.state-action');
            typingAction.addClass('is-on');
            $(this).parent().siblings().addClass('typing');
            $(this).siblings('a').find('img').attr('src', '../assets/image/icon-x-888.svg');
        });

        $(document).on('blur', '.search .text', function () {
            var typingAction = $(this).closest('.state-action');
            typingAction.addClass('is-on');
            $(this).siblings('a').find('img').attr('src', '../assets/image/search-bidding.svg');
            $(this).parent().siblings().removeClass('typing');
        });

        $(document).on('click', '.expand-box a', function (e) {
            e.preventDefault();
            var searchText = $(this).text();

            // 텍스트가 20자를 초과하면 말줄임 처리
            if (searchText.length > 20) {
                searchText = searchText.substring(0, 20) + '...';
            }

            // 텍스트를 .search .text에 설정
            $('.search .text').text(searchText);

            // 텍스트를 input 필드에도 설정
            stateAction.find('input').val(searchText);

            // expand-box에 있는 is-on 클래스를 제거
            stateAction.removeClass('is-on');
        });
    });


    // 은행 옵션 리스트 기능은 사용하지 않아 제거


    // 약관 팝업 토글 코드는 현재 사용하지 않아 제거

    //모달창 버튼 제어 - 이벤트 위임 방식으로 변경
    $(document).on('click', '.sorting-list li .btn button', function () {
        $(this).closest('li').find('.btn button').removeClass('active');
        $(this).addClass('active');
    });




    // .filter 관련 공통 모달 제어는 사용하지 않아 제거



    // 공지 모달 관련 코드는 사용하지 않아 제거

    // 키워드 스와이퍼 및 필터 sticky 제어는 사용하지 않아 제거

    // 소형 탭 기능은 사용하지 않아 제거

    // loanGraph 호출 제거
})();


// 정렬 버튼 전역 위임 중복 로직 제거

// 대출이자 계산기 로직 제거


//   신규 상품 카드
    var swiper2 = new Swiper(".other__swiper", {
        slidesPerView: "auto",
        spaceBetween: 8,
    });
    //   뉴스 카드
    var swiper3 = new Swiper(".other__swiper.news", {
        slidesPerView: "auto",
        spaceBetween: 8,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    //   백과사전 카드
    var swiper3 = new Swiper(".other__swiper.dictionary", {
        slidesPerView: "auto",
        spaceBetween: 8,
    });

    // 메인 롤링 배너
    var swiper = new Swiper(".main__swiper", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        on: {
            init: function () {
                const total = this.slides.length - this.loopedSlides * 2;
                document.querySelector(".swiper-pagination.main-banner").innerHTML = `1/${total}`;
            },
            slideChange: function () {
                const current = this.realIndex + 1;
                const total = this.slides.length - this.loopedSlides * 2;
                document.querySelector(".swiper-pagination.main-banner").innerHTML = `${current}/${total}`;
            },
        },
    });


// loanGraph 및 ltv 스와이퍼 제거

// 지수박스 슬라이드
var swiperindex = new Swiper(".index__swiper", {
    spaceBetween: 0,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
});
