(function () {
    // 게시물 등록/수정 - header 더보기 클릭시 나타나는 수정/삭제 pop
    $(document.body).on('click', '.header-more-btn .more-btn', function () {
        if ($(this).parents('.header-more-btn').hasClass("is-on")) {
            $(this).parents('.header-more-btn').removeClass("is-on");
        } else {
            $(this).parents('.header-more-btn').addClass("is-on");
        }
    });
    $(document.body).on('click', '.header-more-btn.is-on .more-pop a', function () {
        $(this).parents().parents('.header-more-btn').removeClass("is-on");
    }); // 공유하기 팝업 swiper

    var swiper = new Swiper(".share__swiper", {
        slidesPerView: 'auto',
        spaceBetween: 16,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20
    }); // 댓글 클릭시 팝업 띄우기

    $(document.body).on('click', '.reply-inner', function (e) {
        e.preventDefault();
        $('html').css({
            "overflow": "hidden"
        });
        $('#pop_reply_utill').addClass("is-on");
        $('.dimed').css('display', 'block');
    });
    $(document.body).on('click', '.js-modal-close', function () {
        $('.pop__detail').removeClass("is-on");
    }); // 딤드 클릭시 팝업 닫힘

    $(document.body).on('click', '.dimed', function () {
        $(".dimed").remove();
        $('.pop__detail.bottom').removeClass("is-on");
        $('html').css({
            'overflow': 'auto'
        });
    }); // 게시물 등록/수정 - header 더보기 클릭시 나타나는 수정/삭제 pop

    // if($('.bot').hasClass('on')){
    // 	$('.talk_area').css('padding-bottom', '139px' );
    // }else{
    //       $('.talk_area').css('padding-bottom', '70px' );
    //   }
})();