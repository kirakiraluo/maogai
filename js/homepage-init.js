// config arg here
const topNav = $('.top-nav');
const link_offset = 60; // offset of links
const bottomTool = $('.bottom-tool-wrap');
const sideBar = document.getElementsByClassName('side-container')[0];


let headerHeight = $('#homepage-head').height();
let pageWidth = $(window).width();
let windowHeight = $("#homepage-head").height();
let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

$(function () {

    // add head navbar scroll event
    function headNavEvent(scrollTop){
        if (scrollTop > headerHeight - link_offset){
            if (!topNav.hasClass('top-nav-active')){
                topNav.addClass('top-nav-active');
            }
        }
        else{
            topNav.removeClass('top-nav-active');
        }
    }


    // bind upward event
    $('#bt-upward').click(function (ev) {
        $('html, body').animate({
            'scrollTop': 0
        }, 500);
    });



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
    let sideActived = false;
    $('#bt-sidenav').click(function () {
        sideActived = sideNavEvent('.side-nav', 'side-nav-active', sideActived, '.side-nav')
        $(".side-cover").click(function () {
            sideActived = sideNavEvent('.side-nav', 'side-nav-active', sideActived, '.side-nav')
        });
    });



    // side nav chunks event
    function sideEvent (scrollTop){
        if (scrollTop >= windowHeight){
            if (sideBar.className.indexOf('sticky') === -1){
                sideBar.classList.add('sticky');
            }
        }
        else{
            sideBar.classList.remove('sticky');
        }
    }



    // bind scroll event at once
    let onCompute = false;
    function scrollEvent(){
        if (onCompute === true) return

        scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        headNavEvent(scrollTop);
        sideEvent(scrollTop);

        onCompute = false;
    }
    scrollEvent();
    window.addEventListener('scroll', scrollEvent);




    // bind resize event here
    window.addEventListener('resize', function () {
        headerHeight = $('#homepage-head').height();
        pageWidth = $(window).width();
        windowHeight = $("#homepage-head").height();
    });
})
