// config global arg here
const html_body = $('html, body');
const link_offset = 60; // offset of links
const sideIndex = $('.sideindex-wrap');
const pgBar = $('#sideindex-pgbar');
const pgNum = $('#sideindex-num');
const bottomTool = $('.bottom-tool-wrap');
const topNav = $('.top-nav');
const mainDiv = $('#main');
const baseUrl = $('#comment-h2').attr('base_url');
const locUrl = $('#location');
const blog_id = $('#comment-h2').attr('blog_id');

let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
let pageHeight = $("#content-wrap").height();
let headHeight = $('#head-wrap').height();
let pageWidth = $(window).width();
let headerHeight = $("#head-wrap").offset().bottom;
let commentCt = $("#comment_ct");
let replyIdBtn = $('#reply_id');
let cancelBtn = $("#cancel_reply");
let replierName = $('#replier');

const PATH = '/'
function cookieSetter(nickname, mail, website=''){
    let Days = 365;
    let exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);

    if (nickname !== '' && mail !== '') {

        document.cookie = 'nickname=' + nickname + ';expires=' + exp.toGMTString() + ';path=' + PATH;
        document.cookie = 'mail=' + mail + ';expires=' + exp.toGMTString() + ';path=' + PATH;

    }
    if (website !== ''){
        document.cookie = 'website=' + website + ';expires=' + exp.toGMTString() + ';path=' + PATH;

    }
}

function cookieChecker(){
    let cookies = document.cookie.split(';')
    let nameReg = /nickname=(.*)/;
    let mailReg = /mail=(.*)/;
    let websiteReg = /website=(.*)/;
    cookies.forEach(function (value, index) {
        let name = nameReg.exec(value);
        if (name){
            $('#nickname').val(name[1]);
        }

        let mail = mailReg.exec(value);
        if(mail){
            $('#mail').val(mail[1]);
        }

        let website = websiteReg.exec(value);
        if(website){
            $('#website').val(website[1]);
        }
    })
}


// general bottom tips
function bottomTips(text, duration=2500){
    const toolChunk = document.createElement('DIV');
    toolChunk.classList.add('tip-chunk');
    toolChunk.innerText = text;
    let bottomTip = $('.bottom-tips');
    bottomTip.empty();
    bottomTip.append(toolChunk);

    setTimeout(function () {
        $(toolChunk).addClass('tip-chunk-down');
        setTimeout(function () {
            $(toolChunk).remove();
        }, 1000);
    }, duration);
}



function sendComment(info){
    $.ajax({
        type: 'POST',
        url: baseUrl + "comment",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(info),
        success(msg) {
            bottomTips('发送成功！');
            setTimeout(function () {
                location.reload();
            }, 1000);

        },
        error(msg) {
            bottomTips('发送失败，请检查网络...');
        }
    })
}

let maxTry = 3
let tryTimes = 0
let isGetComment = false;
let isGetting = false
function getComment(blog_id){
    if (tryTimes > maxTry) return
    if (isGetting) return;
    tryTimes ++;
    isGetting = true
    $.ajax({
        type: 'GET',
        url: baseUrl + 'comment',
        data:{
          'blog_id': blog_id,
        },
        dataType: 'json',
        success(data){
            console.log(data);
            isGetComment = true;
        },
        error(msg){
            bottomTips('加载评论失败了...');
            isGetting = false;
        }
    })
}

$(function () {

    //check cookie
    cookieChecker();

    //get location
    let loc = window.location.href;
    locUrl.href = loc;
    locUrl.text(loc);



    // claim code language
    // add copy event
    $('pre code').each(function () {
        let obj = $(this);
        let classLis = this.classList;
        obj.attr('lang', classLis[classLis.length - 1]);
    });

    $('pre').each(function () {
        let obj = $(this);
        obj.append(`<div class="copy-code"><i class="fa fa-copy"></i>复制</div>`)
    })

    // copy code
    function execCoy(text) {
        const input = document.createElement('TEXTAREA');
        input.style.opacity  = 0;
        input.style.position = 'absolute';
        input.style.left = '-100000px';
        document.body.appendChild(input);

        input.value = text;
        input.select();
        input.setSelectionRange(0, text.length);
        document.execCommand('copy');
        document.body.removeChild(input);
        return true;
    }

    $('.copy-code').click(function () {
        let jq_this = $(this)
        let codeChunk  = $(jq_this.prev()).find('tr')
        let copy_code = ''
        $(codeChunk).each(function () {
            copy_code += $(this).text() + '\n';
        });
        if (execCoy(copy_code)){
            jq_this.addClass('copy-code-flash')
            setTimeout(function () {
                jq_this.removeClass('copy-code-flash')
            }, 1000)
            bottomTips('复制成功');
        }
    });



    // bind upward event
    $('#bt-upward').click(function (ev) {
        $('html, body').animate({
            'scrollTop': 0
        }, 500);
    });

    $('#bt-goto-comment').click(function (ev) {
        $('html, body').animate({
            'scrollTop': $('#comment-h2').offset().top - link_offset
        }, 500);
    });

    // ajax to get comment
    function getCommentChecker(scrollTop){
        if (isGetComment) return
        if (scrollTop >= $('#comment-h2').offset().top - link_offset * 2){
            getComment(blog_id);
        }
    }


    // bind reply button
    $('.reply-btn').click(function (ev) {
        let reply_id =  $(this).attr('reply-id');
        let reply_name = $(this).siblings('.comment-name').text();
        commentCt.attr('placeholder', '@' + reply_name);
        replyIdBtn.attr('value', reply_id);
        if (!cancelBtn.hasClass('cancel-btn-active')){
            cancelBtn.addClass('cancel-btn-active');
        }
        replierName.attr('value', reply_name);
        bottomTips('对 ' + reply_name + ' 进行回复！');
        $('html, body').animate({
            'scrollTop': $('#comment-h2').offset().top - link_offset
        }, 500);
        commentCt.focus()
    });

    cancelBtn.click(function () {
        commentCt.attr('placeholder', '在这里留下你的足迹吧！');
        replyIdBtn.attr('value', -1);
        replierName.attr('value', '');
        cancelBtn.removeClass('cancel-btn-active');
        bottomTips('发送评论吧！');
        commentCt.focus();
    })

    // send comment
    $('#send_cm').click(function () {
        let nickname = $('#nickname').val();
        let mail = $('#mail').val();
        let website = $('#website').val();
        let content = $('#comment_ct').val();
        let reply_id = $('#reply_id').val();
        let replier = $('#replier').val();

        // check
        if (nickname === ''){
            bottomTips('昵称不能为空!');
            return
        }
        if (mail === ''){
            bottomTips('邮箱不能为空!');
            return;
        }
        if (content === ''){
            bottomTips('回复内容不能为空!');
            return;
        }
        let mail_reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!mail_reg.test(mail)) {
            bottomTips('请输入正确的邮箱格式！');
            return;
        }
        let website_reg = /https?:\/\/.*\.[a-z]*/;
        if (website){
            if (!website_reg.test(website)) {
                bottomTips('请输入有效网站!');
                return;
            }
        }
        cookieSetter(nickname, mail, website);

        //send
        let data = {
            nickname,
            mail,
            website,
            content,
            replier,
            reply_id,
            blog_id,
        };
        bottomTips('发送中...')
        sendComment(data);
    })



    // add head navbar scroll event
    function headNavEvent(scrollTop){
        if (scrollTop > headHeight - link_offset){
            if (!topNav.hasClass('top-nav-active')){
                topNav.addClass('top-nav-active');
            }
        }
        else{
            topNav.removeClass('top-nav-active');
        }
    }



    // bind sidebar event
    function sideNavEvent(effectDivName, effectDivClass, flag=false, insertLoc='body'){
        flag = !flag;

        $(effectDivName).toggleClass(effectDivClass);
        bottomTool.toggleClass('bottom-tool-hidden');

        if (flag){
            if(pageWidth < 750){
                $(insertLoc).after(`<div class="side-cover"></div>`);
            }
        } else {
            $('.side-cover').remove();
        }

        return flag;
    }

    let indexActived = false;
    $("#bt-side-index").click(function () {
        indexActived = sideNavEvent('.sideindex-wrap', 'side-active', indexActived)
        $(".side-cover").click(function () {
            indexActived = sideNavEvent('.sideindex-wrap', 'side-active', indexActived);
        });
    });
    $(".sideindex-wrap").click(function () {
        indexActived = sideNavEvent('.sideindex-wrap', 'side-active', indexActived)
        $(".side-cover").click(function () {
            indexActived = sideNavEvent('.sideindex-wrap', 'side-active', indexActived);
        });
    })

    let sideActived = false;
    $('#bt-sidenav').click(function () {
        sideActived = sideNavEvent('.side-nav', 'side-nav-active', sideActived, '.side-nav')
        $(".side-cover").click(function () {
            sideActived = sideNavEvent('.side-nav', 'side-nav-active', sideActived, '.side-nav')
        });
    });



    // create toc and fade in
    new Toc({
        wrapperId: 'content',
        insertId: 'sideindex-pos',
        showSerial: false
    }).createToc();

    // oncreate, insert jump action
    let sideToc = $(".toc_wrap a");
    let sideTocLen = sideToc.length;
    sideToc.on('click', function (e) {
        e.preventDefault();
        let routeLink = $(this).attr('href');
        html_body.animate({
            'scrollTop': $(routeLink).offset().top - link_offset
        }, 400);
    });

    // bind color and width change on scroll
    let hElement = $("#content h1,#content h2,#content h3,#content h4");
    let percent = 0;
    function sideTocEvent (scrollTop){
        // color
        let len = sideTocLen - 1;
        let flag = 0;
        for (; len > -1; len--){
            let sideTocA = $(sideToc[len]);
            sideTocA.removeClass('active');

            if (flag === 1) continue;

            let elementTop = $(hElement[len]).offset().top;
            if (scrollTop >= elementTop - link_offset - 10){
                sideTocA.addClass('active');
                flag = 1;
            }
        }

        // width
        percent = Math.min(Math.max(Math.floor((scrollTop) / pageHeight * 110), 0), 100);
        pgBar.css('width', percent + '%');
        pgNum.text(percent);
    }



    // bind scroll event at once
    let onCompute = false;
    function scrollEvent(){
        if (onCompute === true) return

        scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        sideTocEvent(scrollTop);
        headNavEvent(scrollTop);
        getCommentChecker(scrollTop);

        onCompute = false;
    }
    scrollEvent();
    window.addEventListener('scroll', scrollEvent);

    // bind resize event at once
    window.addEventListener('resize', function () {
        pageHeight = $("#content-wrap").height();
        headHeight = $('#head-wrap').height();
        pageWidth = $(window).width();
        headerHeight = $("#head-wrap").offset().bottom;
    });

    // scroll into screen
    setTimeout(function () {
        sideIndex.addClass('sideindex-wrap-active');
        $('.toc_wrap').addClass('toc_wrap-active');
    }, 600)
    setTimeout(function () {
        mainDiv.addClass('main-active');
    }, 950)
});
