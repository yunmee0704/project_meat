'use strict';

window.initDatepicker = function () {
    // 오늘 날짜 만들기
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const dateString = `${year}-${month}-${day}`;

    // 1. datepicker-input 값 설정
    let isDatePicked = false; // 처음엔 선택 안 된 상태

    // 값 넣는 로직 수정
    const datepickerInputs = document.querySelectorAll('.datepicker-input');
    if (datepickerInputs.length > 0) {
        datepickerInputs.forEach((input) => {
            // modal-content.ai 안에 있는 경우엔 무조건 넣어줌
            const isInAiModal = input.closest('.modal-content.ai');

            if (isInAiModal || isDatePicked) {
                input.value = dateString;
            }
        });
    }

    // 2. Datepicker 생성 함수
    const createDatepicker = (selector, title) => {
        const el = document.querySelector(selector);
        if (!el || typeof Datepicker === 'undefined') return;

        try {
            new Datepicker(el, {
                language: 'ko',
                autohide: true,
                minDate: new Date(2023, 0, 1),
                maxDate: today,
                title: title,
                maxView: 1,
                beforeShowMonth() {
                    const pickerEl = this.picker.element;

                    setTimeout(() => {
                        const switchBtn = pickerEl.querySelector('.view-switch');
                        if (switchBtn && !switchBtn.innerText.includes('년')) {
                            switchBtn.innerText += '년';
                        }
                    });
                }
            });
        } catch (err) {
            console.warn(`[Datepicker 오류] ${selector}`, err);
        }
    };

    // 3. 각 필드별 Datepicker 초기화
    createDatepicker('input[name="datepickerStart"]', '시작일 선택');
    createDatepicker('input[name="datepickerEnd"]', '종료일 선택');
    createDatepicker('input[name="periodStart"]', '시작일 선택');
    createDatepicker('input[name="periodEnd"]', '종료일 선택');

    const modalCreateDatepicker = (selector, title) => {
        const el = document.querySelector(selector);
        if (!el || typeof Datepicker === 'undefined') return;

        try {
            new Datepicker(el, {
                language: 'ko',
                autohide: true,
                minDate: new Date(2023, 0, 1),
                maxDate: today,
                title: title,
                maxView: 1,
                container: document.querySelector('.modal-content.date'),
                beforeShowMonth() {
                }
            });
        } catch (err) {
            console.warn(`[Datepicker 오류] ${selector}`, err);
        }
    };
    modalCreateDatepicker('input[name="modalDatepickerStart"]', '시작일 선택');

    // 4. 닫기버튼 삽입
    const titles = document.querySelectorAll('.datepicker-title');
    if (titles.length > 0) {
        titles.forEach((title) => {
            if (!title.querySelector('.close-btn')) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.classList.add('close-btn');
                title.appendChild(btn);
            }
        });
    }

    // 통합 이벤트 위임 처리
    document.addEventListener('click', (e) => {
        const target = e.target;

        // 1. 날짜 클릭 시 isDatePicked 상태 업데이트
        if (target.closest('.datepicker-dropdown .day')) {
            isDatePicked = true;
            return;
        }

        // 2. 닫기 버튼 클릭 시 datepicker 닫기
        if (target.classList.contains('close-btn')) {
            const dropdown = target.closest('.datepicker-dropdown');
            const bg = target.closest('.modal-toast');
            if (dropdown) dropdown.classList.remove('active');
            if (bg) bg.classList.remove('is-on');
            target.closest('.dimed').css('display', 'none');
            return;
        }

        // 3. 데이터피커 모달 열기
        if (target.closest('.item__input.date.modal')) {
            e.preventDefault();
            const modalInput = target.closest('.item__input.date.modal');
            if (!modalInput.classList.contains('on')) {
                modalInput.classList.add('on');

                // jQuery 대신 Vanilla JS로 변경
                const modalToast = document.querySelector('.modal-toast.only-data');
                const dimed = document.querySelector('.dimed');
                const body = document.body;

                if (modalToast) {
                    modalToast.classList.add('is-on');
                    modalToast.classList.remove('is-off');
                }
                if (dimed) {
                    dimed.style.display = 'block';
                }
                body.style.overflow = 'hidden';
            }
            return;
        }

        // 4. 모달 컨텐츠 클릭 시 모달 닫기
        if (target.closest('.modal-content.date')) {
            e.preventDefault();
            const modalInput = document.querySelector('.item__input.date.modal');
            if (modalInput && modalInput.classList.contains('on')) {
                modalInput.classList.remove('on');

                // jQuery 대신 Vanilla JS로 변경
                const modalToast = document.querySelector('.modal-toast.only-data');
                const dimed = document.querySelector('.dimed');
                const body = document.body;

                if (modalToast) {
                    modalToast.classList.remove('is-on');
                    modalToast.classList.add('is-off');
                }
                body.style.overflow = 'auto';
                if (dimed) {
                    dimed.style.display = 'none';
                }
            }
            return;
        }
    });
};

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
    $(document).on('click', '.btn-top a', function (e) {
        e.preventDefault();
        $('html, body').animate(
            {
                scrollTop: 0,
            },
            'slow',
        );
    });
    $(document).on('click', '.anchor-menu a', function (e) {
        e.preventDefault();
        $('.header-modal').addClass('is-expand');
    });
    $(document).on('click', '.js-close-modal', function (e) {
        e.preventDefault();
        $('.header-modal').removeClass('is-expand');
    });


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


    $(document).on('click', '.js-search-btn', function (e) {
        e.preventDefault();
        $('#search__layer').slideDown('fast');
    });
    $(document).on('click', '.search__input .btn-back', function (e) {
        e.preventDefault();
        $('#search__layer').slideUp('fast');
    }); //품목표 select

    $(document.body).on('click', '.select-btn .default-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if ($(this).parents('.control-action').hasClass('is-on')) {
            $(this).parents('.control-action').removeClass('is-on');
        } else {
            $(this).parents('.control-action').addClass('is-on');
        }
    });
    $(document.body).on('click', '.select-btn.is-on .expand-box a', function () {
        $(this).parents().parents('.control-action').removeClass('is-on');
    }); //sorting select

    $(document.body).on('click', '.select-btn .default-btn', function () {
        if ($(this).parents('.sorting-action').hasClass('is-on')) {
            $(this).parents('.sorting-action').removeClass('is-on');
        } else {
            $(this).parents('.sorting-action').addClass('is-on');
        }
    });
    $(document.body).on('click', '.select-btn.is-on .expand-box a', function () {
        $(this).parents().parents('.sorting-action').removeClass('is-on');
    }); //state select

    $(document.body).on('click', '.select-btn .default-btn', function () {
        if ($(this).parents('.state-action').hasClass('is-on')) {
            $(this).parents('.state-action').removeClass('is-on');
        } else {
            $(this).parents('.state-action').addClass('is-on');
        }
    });

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

    $(document.body).on('click', '.select-btn .ing-btn', function () {
        if ($(this).parents('.deal-action').hasClass('is-on')) {
            $(this).parents('.deal-action').removeClass('is-on');
        } else {
            $(this).parents('.deal-action').addClass('is-on');
        }
    });
    $(document.body).on('click', '.select-btn.is-on .expand-box a', function () {
        $(this).parents().parents('.deal-action').removeClass('is-on');
    }); //toast popup

    $(document.body).on('click', '.toast-popup .btn-tooltip', function () {
        $(this).parents().parents('.toast-popup').removeClass('is-pop');
    }); //msg - search

    $(document.body).on('click', '.js-search-msg', function () {
        if ($('.msg__search').hasClass('is-expand')) {
            $('.msg__search').removeClass('is-expand');
        } else {
            $('.msg__search').addClass('is-expand');
        }
    });
    $(document.body).on('click', '.js-search-close', function () {
        if ($('.msg__search').hasClass('itop radiutop radiuss-expand')) {
            $('.msg__search').removeClass('is-expand');
        } else {
            $('.msg__search').addClass('is-expand');
        }
    }); //msg - msg del

    $(document.body).on('click', '.talk_r .talk_txt', function (e) {
        e.preventDefault();
        $('html').css({
            overflow: 'hidden',
        });
        $('#popup_reply_utill').addClass('is-on');
        $('body').before("<div class='dimed'></div>");
    });

    $(document.body).on('click', '.detail-info-list.accordion .expand', function (e) {
        e.preventDefault();
        $(this).toggleClass("is-on");

        if ($(this).hasClass('is-on')) {
            $('.notice.modal a').removeClass('is-on');
            $(this).find('span').text('접기');
        } else {
            $('.notice.modal a').addClass('is-on');
            $(this).find('span').text('더보기');
        }
    });

    //240618 추가
    //메세지(채팅) 클래스 추가/제거
    $('.container .utill_btn').on('click', function () {
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
            $('.container .bot').addClass('on');
        } else {
            $(this).addClass('on');
            $('.container .bot').removeClass('on');
        }
    });

    //메세지(채팅) 상단 미니바 여닫는 기능
    $('.minibar-popup .arrow-btn').on('click', function () {
        if ($('.minibar-popup').hasClass('on')) {
            $('.minibar-popup').removeClass('on');
        } else {
            $('.minibar-popup').addClass('on');
        }
    });

    $('.minibar-popup .close').on('click', function () {
        $('.minibar-popup').addClass('none');
        $('.minibar-btn').removeClass('none');
    });

    $('.minibar-btn').on('click', function () {
        $(this).addClass('none');
        $('.minibar-popup').removeClass('none');
        $('.minibar-popup').removeClass('on');
    });

    // select 전역 이벤트 위임
    document.addEventListener('click', (event) => {
        const target = event.target;

        const isSelectBox = (target instanceof Element) && target.closest('.select-box');
        const isOption = (target instanceof Element) && target.closest('.select-options li');

        const getAllBoxes = () => document.querySelectorAll('.select-box');
        const getOptionsElOf = (box) => box?.nextElementSibling; // 구조: .select-box + .select-options

        const closeAll = () => {
            getAllBoxes().forEach((box) => {
                box.classList.remove('active');
                const opts = getOptionsElOf(box);
                if (opts && opts instanceof HTMLElement) opts.style.display = 'none';
            });
        };

        // 1) .select-box 클릭: 열고/닫기 + 다른 드롭다운 닫기
        if (isSelectBox) {
            event.stopPropagation();

            const currentBox = isSelectBox;
            const currentOpts = getOptionsElOf(currentBox);

            // 다른 드롭다운 닫기
            getAllBoxes().forEach((box) => {
                if (box !== currentBox) {
                    box.classList.remove('active');
                    const opts = getOptionsElOf(box);
                    if (opts && opts instanceof HTMLElement) opts.style.display = 'none';
                }
            });

            // 현재 토글
            if (currentBox.classList.contains('active')) {
                currentBox.classList.remove('active');
                if (currentOpts && currentOpts instanceof HTMLElement) currentOpts.style.display = 'none';
            } else {
                currentBox.classList.add('active');
                if (currentOpts && currentOpts instanceof HTMLElement) currentOpts.style.display = 'block';
            }
            return; // 처리 끝
        }

        // 2) 옵션(li) 클릭: 선택 반영 (해당 드롭다운 범위 안에서만 selected 정리)
        if (isOption) {
            const li = isOption;
            const optionsEl = li.closest('.select-options');
            const box = optionsEl?.previousElementSibling; // 구조상 바로 앞 형제가 .select-box

            if (box && optionsEl) {
                // 표시/스타일 갱신
                box.textContent = li.textContent || '';
                box.classList.add('selected');
                box.classList.remove('active');

                if (optionsEl instanceof HTMLElement) optionsEl.style.display = 'none';

                // 같은 옵션 목록 안에서만 selected 정리
                optionsEl.querySelectorAll('li.selected').forEach((el) => {
                    if (el !== li) el.classList.remove('selected');
                });
                li.classList.add('selected');
            }
            return;
        }

        // 3) 바깥 클릭: 전부 닫기
        closeAll();
    });

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".input-wrap.select").forEach(selectWrap => {
            const selectBox = selectWrap.querySelector(".select-box");
            const optionsList = selectWrap.querySelector(".select-options");
            const options = optionsList.querySelectorAll("li");

            // select-box 클릭 시 옵션 보이기/숨기기
            selectBox.addEventListener("click", () => {
                optionsList.classList.toggle("active");
            });

            // 옵션 클릭 시 값 반영
            options.forEach(option => {
                option.addEventListener("click", () => {
                    // 기존 선택된 옵션 초기화
                    options.forEach(opt => opt.classList.remove("selected"));

                    // 선택한 옵션에 'selected' 클래스 추가
                    option.classList.add("selected");

                    // 선택한 값 반영
                    selectBox.textContent = option.textContent;
                    selectBox.classList.add('done');

                    // 옵션 목록 닫기
                    optionsList.classList.remove("active");
                });
            });

            // 다른 곳 클릭 시 옵션 닫기
            document.addEventListener("click", (event) => {
                if (!selectWrap.contains(event.target)) {
                    optionsList.classList.remove("active");
                }
            });
        });
    });

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
            $(this).siblings('a').find('img').attr('src', '/assets/image/icon-x-888.svg');
        });

        $(document).on('blur', '.search .text', function () {
            var typingAction = $(this).closest('.state-action');
            typingAction.addClass('is-on');
            $(this).siblings('a').find('img').attr('src', '/assets/image/search-bidding.svg');
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


    //은행 옵션 리스트 기능 추가
    $('.expand-box a').on('click', function (e) {
        e.preventDefault(); // 기본 동작 방지 (링크 이동 방지)

        var bankLogo = $(this).find('.bank-logo').html(); // bank-logo 내용 가져오기
        var bankName = $(this).find('.bank-name').text(); // bank-name 텍스트 가져오기

        // default-btn의 a 태그에 내용 업데이트
        $('.select-btn .default-btn').html(bankLogo + bankName);
        $('.default-btn').addClass('in');
        $('.state-action').removeClass('is-on')
    });


    //약관동의 체크박스 클릭시 약관팝업 보이기
    /* 250417 손석호 :: 전체동의 클래스 추가로 인해 수정 */
    $('.agree-box:not(.only-check) .agree-detail .checkbox label').on('click', function () {
        $('.modal-toast.agree').removeClass('is-off').addClass('is-on');
        $('.dimed').css('display', 'block');
    });
    $('.modal-toast-btn .js-modal-close').on('click', function () {
        $('.modal-toast').removeClass('is-on').addClass('is-off');
        $('.dimed').css('display', 'none');
    });

    //모달창 버튼 제어 - 이벤트 위임 방식으로 변경
    $(document).on('click', '.sorting-list li .btn button', function () {
        $(this).closest('li').find('.btn button').removeClass('active');
        $(this).addClass('active');
    });




    // 공통 js 추가 0409
    // 필터 js 수정 (연속으로도 가능하게 함 - 250410)
    $(document).on('click', '.filter', function (e) {
        e.preventDefault();

        $(this).removeClass('on').addClass('on'); // 다시 강제로 on
        $('.modal-toast.modal-sorting:not(.only-data)').addClass('is-on').removeClass('is-off');
        $('.dimed').css('display', 'block');

        // filter에 on 클래스가 있을 때 body overflow hidden
        $('body').css('overflow', 'hidden');
    });

    // 필터 모달 닫기 시 overflow 복원
    $(document).on('click', '.modal-toast.modal-sorting .js-modal-close, .dimed', function () {
        $('.filter').removeClass('on');
        $('.modal-toast.modal-sorting').removeClass('is-on').addClass('is-off');
        $('.dimed').css('display', 'none');
        $('body').removeAttr('style');
    });



    // notice 모달은 이걸 사용
    $('.notice.modal a').on('click', function (e) {
        e.preventDefault();
        if (!$(this).hasClass('on')) {
            $(this).addClass('on');
            $('.modal-toast.modal-notice:not(.only-data)').addClass('is-on');
            $('.modal-toast.modal-notice:not(.only-data)').removeClass('is-off');
            $('.dimed').css('display', 'block');
            $('body').css('overflow', 'hidden');
        }
    });

    $('.js-modal-close').on('click', function (e) {
        e.preventDefault();
        if ($('.notice.modal a').hasClass('on')) {
            $('.notice.modal a').removeClass('on');
            $('.modal-toast.modal-notice').removeClass('is-on');
            $('.modal-toast.modal-notice').addClass('is-off');
            $('body').css('overflow', 'auto');
            $('.dimed').css('display', 'none');
        }
    });

    // 필터 스와이퍼
    var swiper = new Swiper(".keyword__swiper", {
        slidesPerView: "auto",
        spaceBetween: 6,
        grabCursor: true,
    });

    var $filter = $('.filter');
    $(window).scroll(function () {
        //$bottom.addClass('is-sticky');
        if ($(document).scrollTop() > 0) {
            $filter.addClass('is-sticky');
        } else {
            $filter.removeClass('is-sticky'); //$bottom.addClass('is-sticky');
        }
    });

    // 탭 기능

    $('.tab__menu.small a').on('click', function () {
        var idx = $(this).index();
        console.log(idx)
        $('.tab__menu.small a').removeClass('is-active');
        $('.tab-contents li').removeClass('is-active');
        $(this).addClass('is-active');
        $('.tab-contents li').eq(idx).addClass('is-active');

    });

    loanGraph(75);
})();


// 전역 이벤트 위임으로 처리 (기존 이벤트 위임 코드와 통합)
$(document).on('click', '.sorting-list button', function () {
    const $this = $(this);
    const $li = $this.closest('li');
    const index = $li.index();
    const spanClass = 'filter_' + (index + 1);
    const newText = $this.text();

    // active 클래스 제어
    $li.find('button').removeClass('active');
    $this.addClass('active');

    // 해당 span이 존재하면 텍스트 변경
    const $targetSpan = $('.filter .' + spanClass);
    if ($targetSpan.length) {
        $targetSpan.text(newText);
    } else {
        // 만약 없는 경우 생성 (안정성 위해 추가)
        $('<span>').addClass(spanClass).text(newText).appendTo('.filter');
    }
});

// 대출이자 계산기
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const safeBoxAmountEl = document.getElementById('calc-box-amount');
    const bg = document.querySelector('.bg');

    if (!slider || !safeBoxAmountEl || !bg) return; // 요소가 없으면 실행하지 않음

    let totalBalance = 300000000;
    let minValue = 0;
    let maxValue = 300000000;

    slider.min = minValue;
    slider.max = maxValue;
    slider.step = 1000000;
    slider.value = maxValue;

    bg.style.width = '100%';
    safeBoxAmountEl.textContent = formatAmount(maxValue);

    slider.addEventListener('input', () => {
        const safeBoxAmount = parseInt(slider.value, 10);
        safeBoxAmountEl.textContent = formatAmount(safeBoxAmount);

        const percentage = (safeBoxAmount - minValue) / (maxValue - minValue);
        const bgWidth = percentage * 89 + 11;
        bg.style.width = `${bgWidth}%`;
        bg.style.backgroundColor = `rgba(255, 242, 233)`;
    });

    function formatAmount(amount) {
        return amount.toLocaleString();
    }
});


//250414 키패드 관련 js

$(document).ready(function () {
    let activeInput = null;

    // 커스텀 키패드 표시 (PC에서만)
    const isRealMobile = () => {
        return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) &&
            'ontouchstart' in window &&
            navigator.maxTouchPoints > 0;
    };
    const showCustomKeypad = !isRealMobile();

    // 키패드 클릭 시 해당 input에 값 채우기
    $('.pin-input').on('focus click', function () {
        $(this).addClass("on");
        if (!showCustomKeypad) return;

        activeInput = this;

        // 키패드의 위치를 해당 input의 아래쪽으로 설정
        $('.custom-keypad').css({
            display: 'grid',
            position: 'absolute',
        });
    });

    // 키패드 버튼 클릭 시 값 넣기
    $('.key').on('click', function (e) {
        e.preventDefault(); // form 제출 방지

        if (!activeInput) return;

        const $input = $(activeInput);
        const value = $(this).text();

        if ($(this).hasClass('delete')) {
            // 삭제 버튼 클릭
            $input.val(''); // 값 지우기
            $input.removeClass('filled'); // 'filled' 클래스 제거

            // 이전 입력 필드로 포커스 이동
            const prev = $input.prev('.pin-input');
            if (prev.length) {
                prev.focus(); // 이전 필드로 포커스 이동
                activeInput = prev[0]; // activeInput 업데이트
            } else {
                activeInput = null; // 이전 필드가 없으면 activeInput 비움
            }
        } else {
            // 숫자 입력 버튼 클릭
            $input.val(value).trigger('input'); // 값 입력 후 input 이벤트 트리거
            $input.addClass('filled'); // 'filled' 클래스 추가

            // 다음 입력 필드로 포커스 이동
            const next = $input.next('.pin-input');
            if (next.length) {
                next.focus(); // 다음 필드로 포커스 이동
                activeInput = next[0]; // activeInput 업데이트
            } else {
                // 마지막 필드일 경우 키패드 숨기기
                $('.custom-keypad').hide();
                activeInput = null; // activeInput 비움
            }
        }
    });

    // 키패드 외 클릭 시 키패드 숨기기
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.pin-input, .custom-keypad').length) {
            $('.custom-keypad').hide();
            activeInput = null;
        }
    });

    // 값 입력 후 자동으로 'filled' 클래스 추가 및 포커스 이동 (Vanilla JS 방식)
    const inputs = document.querySelectorAll('.pin-input');

    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            // 값이 입력되면 'filled' 클래스 추가
            if (input.value.length === 1) {
                input.classList.add('filled');
            }

            // 입력 후 자동으로 다음 칸으로 이동
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '') {
                // 값이 없을 때 'filled' 클래스 제거
                input.classList.remove('filled');

                // Backspace 시 이전 칸으로 이동
                if (index > 0) {
                    inputs[index - 1].focus();
                }
            }
        });
    });

    // 뒤로 가기 버튼 처리: filled 클래스 제거
    window.addEventListener('popstate', function () {
        $('.pin-input').removeClass('filled').val(''); // 뒤로 가기 시 값과 'filled' 클래스 제거
    });

    // 입력값이 채워지고 삭제된 후 처음 입력 가능하게끔 초기화
    $(inputs).on('focus', function () {
        if ($(this).val() === '') {
            $(this).removeClass('filled'); // 입력이 없으면 'filled' 클래스 제거
        }
    });

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


});


//대출 상태 그래프
function loanGraph(percent) {
    const $statePoint = $('.state-point');
    const $percentage = $('.percentage');
    const $stateText = $('.state-text');
    const $graph = $('.graph');
    const $pointTitle = $('.point-title');


    // const dataValue = parseInt($statePoint.data(), 10);
    const dataValue = percent;
    const leftPercent = 100 - dataValue;

    // 기본 위치 지정
    let leftCalc = `calc(${leftPercent}% - 6px)`;

    // 조건별 정렬 및 스타일
    if (dataValue < 13) {
        leftCalc = `calc(${leftPercent}% - 6px)`;
        $percentage.css({
            'text-align': 'right',
            'padding-left': '0px',
            'padding-right': '12px'

        });
        $pointTitle.css({
            'padding-left': '0px',
            'padding-right': '35px'
        });
    } else if (dataValue > 95) {
        leftCalc = `calc(${leftPercent}% + 6px)`;
        $percentage.css({
            'text-align': 'left',
            'padding-right': '0',
            'padding-left': '18px'

        });
        $pointTitle.css({
            'padding-right': '0px',
            'padding-left': '40px'
        });
    } else {
        $percentage.css({
            'text-align': 'center',
            'padding-left': '0',
            'padding-right': '0'
        });
        $pointTitle.css({
            'padding-left': '0',
            'padding-right': '0'
        });
    }

    // state-point 이동
    $statePoint.css('left', leftCalc);

    // graph:before 위치도 함께 이동
    // leftCalc에서 -11px을 빼는 처리
    const calcValue = leftCalc.match(/calc\(([^)]+)\)/)[1];  // calc 안의 값을 추출
    const valueWithoutPx = parseFloat(calcValue.split(' - ')[0].trim());  // % 값 추출
    const newCalcValue = `calc(${valueWithoutPx}%  - 20px)`;  // -11px을 빼기 위해 15px과 11px을 합쳐서 26px로 설정
}
//  RRMH-2679 ltv 롤링배너 컴포넌트 추가
var swiperindex = new Swiper(".ltv__swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    // autoplay: {
    //   delay: 3000,
    //   disableOnInteraction: false,
    // },
});

// 지수박스 슬라이드
var swiperindex = new Swiper(".index__swiper", {
    spaceBetween: 0,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
});
