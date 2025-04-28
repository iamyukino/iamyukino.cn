function makeMulti (string) {
    let l = new String(string)
    l = l.substring(l.indexOf("/*") + 3, l.lastIndexOf("*/"))
    return l
}
let string = function(){/*          _____                    _____                    _____                    _____                    _____          
         /\    \                  /\    \                  /\    \                  /\    \                  /\    \         
        /::\    \                /::\    \                /::\    \                /::\____\                /::\    \        
       /::::\    \              /::::\    \              /::::\    \              /:::/    /                \:::\    \       
      /::::::\    \            /::::::\    \            /::::::\    \            /:::/    /                  \:::\    \      
     /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \          /:::/    /                    \:::\    \     
    /:::/  \:::\    \        /:::/__\:::\    \        /:::/  \:::\    \        /:::/____/                      \:::\    \    
   /:::/    \:::\    \      /::::\   \:::\    \      /:::/    \:::\    \      /::::\    \                      /::::\    \   
  /:::/    / \:::\    \    /::::::\   \:::\    \    /:::/    / \:::\    \    /::::::\    \   _____    ____    /::::::\    \  
 /:::/    /   \:::\ ___\  /:::/\:::\   \:::\    \  /:::/    /   \:::\    \  /:::/\:::\    \ /\    \  /\   \  /:::/\:::\    \ 
/:::/____/  ___\:::|    |/:::/  \:::\   \:::\____\/:::/____/     \:::\____\/:::/  \:::\    /::\____\/::\   \/:::/  \:::\____\
\:::\    \ /\  /:::|____|\::/    \:::\  /:::/    /\:::\    \      \::/    /\::/    \:::\  /:::/    /\:::\  /:::/    \::/    /
 \:::\    /::\ \::/    /  \/____/ \:::\/:::/    /  \:::\    \      \/____/  \/____/ \:::\/:::/    /  \:::\/:::/    / \/____/ 
  \:::\   \:::\ \/____/            \::::::/    /    \:::\    \                       \::::::/    /    \::::::/    /          
   \:::\   \:::\____\               \::::/    /      \:::\    \                       \::::/    /      \::::/____/           
    \:::\  /:::/    /               /:::/    /        \:::\    \                      /:::/    /        \:::\    \           
     \:::\/:::/    /               /:::/    /          \:::\    \                    /:::/    /          \:::\    \          
      \::::::/    /               /:::/    /            \:::\    \                  /:::/    /            \:::\    \         
       \::::/    /               /:::/    /              \:::\____\                /:::/    /              \:::\____\        
        \::/____/                \::/    /                \::/    /                \::/    /                \::/    /        
                                  \/____/                  \/____/                  \/____/                  \/____/         
                                                                                                                             */ }
console.log(makeMulti(string));
console.log( '我要定一个大目标， \n完成它可能会使自己陷入昏迷，\n睡觉！ -- 雨宫 ');
document.oncontextmenu = () => { return false; }


/**
 * 自我介绍 - 时间轴
 * @requires Vue-jQuery
 */
const TimeLineManager = {
    init: function() {
        this.destroy();
        this.initTimeLinePlugin();
        this.initVueInstance();
    },
    initTimeLinePlugin: function() {
        const $timeLine = $(".ui-timeLine");
        const $activeLine = $(".ui-timeLine .activeLine");
        const $dots = $(".ui-timeLine .dot");
        const $cboxs = $(".ui-timeLine .item .cbox");

        const setActiveLineHeight = () => {
        const height = $(document).scrollTop() + window.innerHeight;
        let lastActiveIndex = 0;

        $dots.each((i, dot) => {
            const $dot = $(dot);
            const $cbox = $cboxs.eq(i);
            if ($dot.offset().top < height) {
                $dot.addClass("active");
                $cbox.css("left", 0);
                lastActiveIndex = i;
            } else {
                $dot.removeClass("active");
                $cbox.css("left", "100vw");
            }
        });
        $activeLine.css({
            "height": $dots.eq(lastActiveIndex).offset().top - 
                    $timeLine.offset().top + 40 + "px"
        });
        };
        $(window).off('scroll.timeLine')
            .on('scroll.timeLine', setActiveLineHeight);
        setActiveLineHeight();
        this.$elements = { $timeLine, $activeLine, $dots, $cboxs };
    },
    initVueInstance: function() {
        this.vueInstance = new Vue({
            el: ".ui-timeLine",
            mounted() {
                setTimeout(() => TimeLineManager.initTimeLinePlugin(), 50);
            }
        });
    },
    destroy: function() {
        if (this.$elements) {
            $(window).off('scroll.timeline');
            this.$elements = null;
        }
        if (this.vueInstance) {
            this.vueInstance.$destroy();
            this.vueInstance = null;
        }
    }
}; $(()=>{TimeLineManager.init()});

/**
 * lazyload
 * @requires none
 */
$(window).on("load", () => {
    let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    let active = false;
    const maxRetries = 3;
    const lazyLoad = function() {
        if (active) return;
        active = true;
        setTimeout(() => {
            lazyImages.forEach((lazyImage) => {
                if (!document.contains(lazyImage)) {
                    lazyImages = lazyImages.filter(img => img !== lazyImage);
                    return;
                }
                const rect = lazyImage.getBoundingClientRect();
                if (rect.top > window.innerHeight
                || rect.bottom < 0
                || getComputedStyle(lazyImage).display === "none"
                || lazyImage.dataset.loading
                || lazyImage.dataset.error) {
                    return;
                }
                if (!lazyImage.dataset.retry) {
                    lazyImage.dataset.retry = 0;
                }
                lazyImage.dataset.loading = "true";
                const dataSrc = lazyImage.dataset.src;
                const tempImage = new Image();
                tempImage.onload = () => {
                    lazyImage.src = dataSrc;
                    lazyImage.classList.remove("lazy");
                    delete lazyImage.dataset.loading;
                    delete lazyImage.dataset.retry;
                    lazyImages = lazyImages.filter(img => img !== lazyImage);
                };
                tempImage.onerror = () => {
                    const retries = +lazyImage.dataset.retry || 0;
                    if (retries < maxRetries) {
                        lazyImage.dataset.retry = retries + 1;
                        setTimeout(() => {
                            delete lazyImage.dataset.loading;
                        }, 1000 * Math.pow(2, retries));
                    } else {
                        console.error(`Lazyload '${dataSrc}' failed ${maxRetries} time(s)`);
                        lazyImage.dataset.error = "true";
                        lazyImages = lazyImages.filter(img => img !== lazyImage);
                    }
                    delete lazyImage.dataset.loading;
                };
                tempImage.src = dataSrc;
            });
            active = false;
        }, 200);
    };
    const eventHandler = () => {
        requestAnimationFrame(lazyLoad);
    };
    document.addEventListener("scroll", eventHandler);
    window.addEventListener("resize", eventHandler);
    window.addEventListener("orientationchange", eventHandler);
    lazyLoad();
});

$(() => {
    let lazyTexts = [].slice.call(document.querySelectorAll(".anim"));
    let active = false;
    const lazyLoad = function() {
        if(active !== false) return ;
        active = true;
        setTimeout(function(){
            lazyTexts.forEach(function(lazyText) {
                if(lazyText.getBoundingClientRect().top > window.innerHeight 
                || lazyText.getBoundingClientRect().bottom < 0
                /*|| lazyText.classList.contains('animate')*/)
                    return ;
                lazyText.classList.add("animate");
                lazyTexts = lazyTexts.filter(image => {
                    return image !== lazyText;
                });
                if(lazyTexts.length === 0){
                    document.removeEventListener("scroll",lazyLoad);
                    window.removeEventListener("resize",lazyLoad);
                    window.removeEventListener("orientationchange",lazyLoad);
                }
            });
            active = false;
        }, 200);
    }
    lazyLoad();
    document.addEventListener("scroll",lazyLoad);
    window.addEventListener("resize",lazyLoad);
    window.addEventListener("orientationchange",lazyLoad);
});

/**
 * jQuery for page scrolling feature
 * @requires jQuery-Easing-plugin
 */
function pageScroll() {
    // page-scroll
    $('a.page-scroll[href*="#"]:not([href="#"])').off('click.pageScroll')
    .on('click.pageScroll', function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                let tarY = (target.offset().top -70);
                let maxY = document.documentElement.scrollHeight-document.documentElement.clientHeight;
                $('html, body').animate({
                    scrollTop: tarY < maxY ? tarY : maxY
                }, 1200, "easeInOutExpo");
                return false;
            }
        }
    });

    // prealoder
    $(window).off('load.preLoader')
    .on('load.preLoader', function(event) {
        $('.preloader').delay(500).fadeOut(500);
    });
    
    // mobile-menu 
    $(".navbar-toggler").off('click.navToggle')
    .on('click.navToggle', function() {
        $(".navbar-toggler").toggleClass('active');
    });
    $(".navbar-nav a").off('click.navNavAT')
    .on('click.navNavAT', function() {
        $(".navbar-toggler").removeClass('active');
        $(".navbar-collapse").removeClass("show");
    });
    
    // sticky
    $(window).off('scroll.navSticky')
    .on('scroll.navSticky', function(event) {    
        var scroll = $(window).scrollTop();
        if (scroll < 10) {
            $(".navigation").removeClass("sticky");
        } else{
            $(".navigation").addClass("sticky");
        }
    });
    
    // section menu active
    var scrollLink = $('.page-scroll');
        // active link switching
    $(window).scroll(function() {
        var scrollbarLocation = $(this).scrollTop();
        scrollLink.each(function(_i,e) {
          if (e.hash !== undefined && e.hash.length) { // back-to-top do not have this parm
            var sectionOffset = $(e.hash).offset().top - 73;
            if (sectionOffset <= scrollbarLocation) {
                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');
            }
          }
        });
    });
    
    // Parallaxmouse js
    function parallaxMouse() {
        if ($('#parallax').length) {
            var scene = document.getElementById('parallax');
            var parallax = new Parallax(scene);
        };
    };
    parallaxMouse();
    
    // Progress Bar
    if($('.progress-line').length){
        $('.progress-line').appear(function(){
            var el = $(this);
            var percent = el.data('width');
            $(el).css('width',percent+'%');
        },{accY: 0});
    }
    
    // Counter Up
    $('.counter').counterUp({
        delay: 10,
        time: 1600,
    });
    
    // Magnific Popup
    $('.image-popup').magnificPopup({
      type: 'image',
      gallery:{
        enabled:true
      }
    });
    
    // Back to top
    var curPos = 0;
    // Show or hide the sticky footer button
    $(window).off('load.ldBk2top')
    .on('load.ldBk2top', function(event) {
        if($(this).scrollTop() > 300){
            $('.back-to-top').fadeIn(200)
            $('.lang-to-swi').fadeIn(200)
        } else{
            $('.lang-to-swi').fadeOut(200)
            $('.back-to-top').fadeOut(200)
        }
    });
    $(window).off('scroll.btnBk2top')
    .on('scroll.btnBk2top', function(event) {
        if($(this).scrollTop() > 300){
            $('.back-to-top').fadeIn(200)
            $('.lang-to-swi').fadeIn(200)
        } else{
            $('.lang-to-swi').fadeOut(200)
            $('.back-to-top').fadeOut(200)
        }
    });
    
    // Animate the scroll to top
    $('.back-to-top').off('click.aniBk2top')
    .on('click.aniBk2top', function(event) {
        event.preventDefault();
        curPos = $(window).scrollTop();
        $('html, body').animate({
            scrollTop: 0,
        }, {
            duration: 1500,
            easing: 'easeInOutExpo',
            step: function(){
                const cpos = $(window).scrollTop();
                if (cpos <= curPos) { curPos = cpos; return ; }
                $('html, body').stop();
            }
        });
    });

    // Animate the scroll to bottom


} $(pageScroll);

/**
 * 标题彩蛋
 */
(function(){
    var titleTime;
    document.addEventListener('visibilitychange', () => {
        let lang = window.location.pathname.includes('ja-JP') ? 1 : 0;
        let titOri = lang == 0 ? "一隅雨雪一炉窝 | 雨雪冰屋" : "片隅の雨雪、小さな炉端 | 雨雪の氷室";
        let titOne = lang == 0 ? "|･ω･｀)你看不见我 | 雨雪冰屋" : "|･ω･｀)見えないよw | 雨雪の氷室";
        let titTwo = lang == 0 ? "｜д•´)!!被你发现了 | 雨雪冰屋" : "｜д•´)!!バレたー | 雨雪の氷室";
        if (document.hidden) {
            document.title = titOne;
            clearTimeout(titleTime);
        } else {
            document.title = titTwo;
            titleTime = setTimeout(() => {
                document.title = titOri;
            }, 1000);
        }
    });
})();

/**
 * 打字机效果
 * @callback head-loading.js
 * $(".3to1").ready(initTypeWriter);
 */
function typeWriter(element, placeholder, texts, speed = 100, pause = 1000) {
    let currentTextIndex = 0;
    let isDeleting = false;
    let currentCharIndex = 0;
    let timeout;
    function type() {
        const currentText = texts[currentTextIndex];
        // 确定当前要显示的文字
        let displayText;
        if (isDeleting) {
            displayText = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            displayText = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        element.text(displayText);
        // 确定下一个状态
        if (!isDeleting && currentCharIndex === currentText.length) {
            // 完成输入，暂停后开始删除
            isDeleting = true;
            timeout = setTimeout(type, pause);
        } else if (isDeleting && currentCharIndex === 0) {
            // 完成删除，切换到下一段文本
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % texts.length;
            timeout = setTimeout(type, speed);
        } else if (!isDeleting && currentCharIndex - 1 > 0
        && "、～".includes(currentText[currentCharIndex - 1])) {
            // 在你好后停顿
            timeout = setTimeout(type, speed * 6);
            isDeleting = false;
        } else {
            // 继续输入或删除
            timeout = setTimeout(type, isDeleting ? speed / 2 : speed);
        }
    }
    // 设置占位符文本，开始打字，返回清除函数
    placeholder.text(texts[0]);
    type();
    return function(){ clearTimeout(timeout); };
}
// 根据语言初始化打字机效果
function initTypeWriter() {
    const container = $('.typing-container');
    const element = container.find('.typing-effect');
    const placeholder = container.find('.placeholder');
    const isChinese = container.closest('.set-lang').text().includes("你好～谢谢你来看我！");
    const texts = isChinese 
        ? [
            "你好～谢谢你来看我！",
            "一隅雨雪一炉窝——",
            "可能会融化持久堆？"
          ]
        : [
            "ついに独自ドメイン！",
            "片隅の雨雪、小さな炉端、",
            "永久に続く積雪は溶けるのか？"
          ];
    // 清除之前的打字效果
    if (container.data('clearTypeWriter')) {
        container.data('clearTypeWriter')();
    }
    // 初始化新的打字效果
    const clearTypeWriter = typeWriter(element, placeholder, texts);
    container.data('clearTypeWriter', clearTypeWriter);
} 

/**
 * 粒子特效（爱心）
 */
$(function() {
    // 工具函数
    function getAttr(elem, attr, defVal) {
        return elem.getAttribute(attr) || defVal
    }
    function getElemsByTag(tagName) {
        return document.getElementsByTagName(tagName)
    }
    function getConfig() {
        const scripts = getElemsByTag("script"),
            scriptsLen = scripts.length,
            currScript = scripts[scriptsLen - 1];
        return {
            scriptsLen,
            zIndex: getAttr(currScript, "zIndex", -1),
            opacity: getAttr(currScript, "opacity", .6),
            color: getAttr(currScript, "color", "82,86,160"),
            count: getAttr(currScript, "count", 150)
        }
    }
    // 画布相关
    function initCanvasSize() {
        canvasWidth = canvasEl.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        canvasHeight = canvasEl.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
    // 动画相关
    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        particles.forEach((particle, idx) => {
            particle.x += particle.xv,
            particle.y += particle.yv,
            particle.xv *= particle.x > canvasWidth || particle.x < 0 ? -1 : 1,
            particle.yv *= particle.y > canvasHeight || particle.y < 0 ? -1 : 1,
            
            ctx.fillRect(particle.x - 0.5, particle.y - 0.5, 1, 1);
            
            for (let j = idx + 1; j < allParticles.length; j++) {
                const target = allParticles[j];
                if (target.x === null || target.y === null) continue;

                const dx = particle.x - target.x,
                      dy = particle.y - target.y,
                      distSq = dx * dx + dy * dy;

                if (distSq < target.maxDist) {
                    if (target === mousePos && distSq >= target.maxDist / 2) {
                        particle.x -= 0.03 * dx,
                        particle.y -= 0.03 * dy
                    }
                    const alpha = (target.maxDist - distSq) / target.maxDist;
                    ctx.beginPath();
                    ctx.lineWidth = alpha / 2;
                    ctx.strokeStyle = `rgba(${cfg.color},${alpha + 0.2})`;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.stroke();
                }
            }
        });
        raf(animate);
    }
    let canvasWidth, canvasHeight,
        allParticles,
        canvasEl = document.createElement("canvas"),
        cfg = getConfig(),
        ctx = canvasEl.getContext("2d"),
        raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame 
              || window.mozRequestAnimationFrame || window.oRequestAnimationFrame 
              || window.msRequestAnimationFrame || function(cb) {
                  window.setTimeout(cb, 1000 / 45)
              },
        rand = Math.random,
        mousePos = { x: null, y: null, maxDist: 20000 };

    // 画布初始化
    canvasEl.id = "c_n" + cfg.scriptsLen;
    canvasEl.style.cssText = `position:fixed; top:0; left:0;
        z-index:${cfg.zIndex}; opacity:${cfg.opacity}`;
    document.querySelector('.viewbox').appendChild(canvasEl);
    initCanvasSize();

    window.onresize = initCanvasSize;
    window.onmousemove = function(e) {
        e = e || window.event;
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    };
    window.onmouseout = function() {
        mousePos.x = null;
        mousePos.y = null;
    };

    // 初始化粒子
    const particles = [];
    for (let i = 0; i < cfg.count; i++) {
        const startX = rand() * canvasWidth,
              startY = rand() * canvasHeight,
              xv = 2 * rand() - 1,
              yv = 2 * rand() - 1;
        particles.push({
            x: startX, y: startY,
            xv: xv,   yv: yv,
            maxDist: 6000
        });
    }
    allParticles = particles.concat([mousePos]);
    setTimeout(() => animate(), 100);
});

!function(win, doc) {
    function updateHearts() { // 爱心动画
        hearts.forEach((hrt, i) => {
            hrt.alpha <= 0 ? (doc.querySelector('.viewbox').removeChild(hrt.el), hearts.splice(i, 1)) : (
                hrt.y--,
                hrt.scale += 0.004,
                hrt.alpha -= 0.013,
                hrt.el.style.cssText = `
                    left:${hrt.x}px; top:${hrt.y}px;
                    opacity:${hrt.alpha}; transform:scale(${hrt.scale},${hrt.scale}) rotate(45deg);
                    background:${hrt.color};z-index:99999`
            )
        });
        win.requestAnimationFrame(updateHearts);
    }
    function handleClick(e) {
        const prevClick = typeof win.onclick === "function" && win.onclick;
        win.onclick = function(e) {
            prevClick && prevClick(),
            createHeart(e);
        }
    }
    function createHeart(e) {
        const hrtEl = doc.createElement("div");
        hrtEl.className = "heart";
        hearts.push({
            el: hrtEl,
            x: e.clientX - 5,
            y: e.clientY - 5,
            scale: 1,
            alpha: 1,
            color: getRandColor()
        });
        doc.querySelector('.viewbox').appendChild(hrtEl);
    }
    function addStyles(css) {
        const styleEl = doc.createElement("style");
        styleEl.type = "text/css";
        try {
            styleEl.appendChild(doc.createTextNode(css));
        } catch(ex) {
            styleEl.styleSheet.cssText = css;
        }
        doc.querySelector('.viewbox').appendChild(styleEl);
    }
    function getRandColor() {
        return `rgb(${~~(255*Math.random())},${~~(255*Math.random())},${~~(255*Math.random())})`;
    }
    const hearts = [];
    win.requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame 
        || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame 
        || function(cb) {
            setTimeout(cb, 1000/60);
        };

    addStyles(`
        .heart{ width:10px; height:10px; position:fixed; background:#f00; transform:rotate(45deg); }
        .heart:after,.heart:before{ content:''; width:inherit; height:inherit; background:inherit; border-radius:50%; position:fixed; }
        .heart:after{ top:-5px; }  .heart:before{ left:-5px; }`);
    
    handleClick();
    updateHearts();
}(window, document);

/**
 * 链接下划线动画
 */
document.querySelectorAll('.link').forEach(link => {
    link.innerHTML = '<div><span>' + link.textContent.trim().split('').join('</span><span>') + '</span></div>';
    link.querySelectorAll('span').forEach(span => {
        span.innerHTML = span.textContent == ' ' ? ' ' : span.textContent;
    });
    link.insertAdjacentHTML('beforeend', `
        <div><svg preserveAspectRatio="none" viewBox="0 0 192 5">
        <path d="M191.246 4H129C129 4 127.781 4.00674 127 4C114.767 3.89447 108.233 1 96 1C83.7669 1 77.2327 3.89447 65 4C64.219 4.00674 63 4 63 4H0.751923"/>
        </svg></div>`);
});

/**
 * 首页底部时钟
 */
function show_runtime () {
    let lang = window.location.pathname.includes('ja-JP') ? 1 : 0;
    window.setTimeout("show_runtime()", 1000);
    X = new Date("04/02/2022 00:00:00");
    Y = new Date();
    T = (Y.getTime() - X.getTime());
    M = 24 * 60 * 60 * 1000;
    a = T / M;        A = Math.floor(a);
    b = (a - A) * 24; B = Math.floor(b);
    c = (b - B) * 60; C = Math.floor((b - B) * 60);
    D = Math.floor((c - C) * 60);
    var showTime = document.getElementsByName('runtime_span')[2];
    showTime.innerHTML = lang == 0 ?
        A + "天" + B + "小时" + C + "分" + (D >= 10 ? D : "0" + D) + "秒":
        A + "日" + B + "時" + C + "分" + (D >= 10 ? D : "0" + D) + "秒";
} $(show_runtime);

/**
 * 资源站 - 画廊滚动
 */
$(document).ready(function () {
    var box0 = $(".one"), v0 = 1.9; //这里添加滚动的对象和其速率
    var box1 = $(".two"), v1 = 1;
    Rin(box0, v0);
    Rin(box1, v1);

    function Rin($Box, v) { // $Box移动的对象，v对象移动的速率
        var $Box_ul = $Box.find("ul"),
            $Box_li = $Box_ul.find("li"),
            $Box_li_span = $Box_li.find("span"),
            left = 0, s = 0,
            timer; // 定时器
        $Box_li.each(function (index) {
            $($Box_li_span[index]).width($(this).width()); // hover
            s += $(this).outerWidth(true); // 即要滚动的长度
        })
        window.requestAnimationFrame = window.requestAnimationFrame || function (Tmove) {
            return setTimeout(Tmove, 1000 / 60)
        };
        window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

        if (s >= $Box.width()) {
            // 如果滚动长度超出Box长度即开始滚动，没有的话就不执行滚动
            $Box_li.clone(true).appendTo($Box_ul);
            Tmove();
            function Tmove() {
                left -= v; // 运动是移动left 从0到-s左
                if (left <= -s) {
                    left = 0;
                    $Box_ul.css("left", left)
                } else {
                    $Box_ul.css("left", left)
                }
                timer = requestAnimationFrame(Tmove);
            }
            $Box_ul.hover(function () {
                cancelAnimationFrame(timer)
            }, function () { Tmove() })
        }
    }
})

/**
 * 无刷新 '\index.html' 切换中日文
 */
async function setLang (curPath, newPath) {
    try {
        const resp = await fetch(newPath);
        const newtext = await resp.text();
        const tempdiv = document.createElement('div');
        tempdiv.innerHTML = newtext;
        document.querySelectorAll('.set-lang').forEach((currentElement, index) => {
            const newElement = tempdiv.querySelectorAll('.set-lang')[index];
            if (newElement) {
                if (currentElement.closest('.lang-switch')) {
                    currentElement.innerHTML = newElement.innerHTML;
                } else {
                    currentElement.outerHTML = newElement.outerHTML;
                }
            }
        });
        document.documentElement.lang = curPath == 0 ? 'ja-JP' : 'zh-CN';
        document.title = tempdiv.querySelector('title').textContent;
        TimeLineManager.init();
        stateClickCount.reset();
        $(pageScroll);
        initTypeWriter();
    } catch (error) {
        console.error('toggle-language failed.', error);
    }
}
async function toggleLanguage(event) {
    event.preventDefault();
    const btn = event.target.closest('.lang-switch');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    const curPath = window.location.pathname.includes('/ja-JP') ? 1 : 0;
    const newPath = curPath == 0 ? '/ja-JP' : '/';
    await setLang(curPath, newPath);
    window.history.pushState({}, '', newPath);
}
// 处理 '\index.html' 切换中日文的回退
window.addEventListener('popstate', async (event) => {
    const curPath = window.location.pathname.includes('/ja-JP') ? 0 : 1;
    const newPath = curPath == 0 ? '/ja-JP' : '/';
    await setLang(curPath, newPath);
});

/**
 * 彩蛋（询问是否觉得可爱）
 */
// clickCount 闭包（彩蛋的计数器）
const stateClickCount = (function() {
    let clickCount = 0;
    return {
        getCount: () => clickCount,
        setCount: (val) => clickCount+=val,
        increment: () => clickCount++,
        reset: () => {
            document.querySelectorAll('.modal-backdrop')
                .forEach(backdrop => backdrop.remove())
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = '';
            clickCount = 0;
        }
    };
    })();

// No 按钮点击事件
function handleNoClick() {
    let yesButton = document.getElementById("pix-yes");
    let noButton = document.getElementById("pix-no");
    let questionText = document.getElementById("pix-que");
    let mainImage = document.getElementById("pix-image");

    let lang = window.location.pathname.includes('ja-JP') ? 1 : 0;
    let noTexts = (lang == 0) ?
        ["你认真的吗…", "要不再想想？", 
            "不许选这个！ ", "我会很伤心…", "不行:("]
        : ["マジで…", "考え直して？", 
            "ダメだよっ！", "泣いちゃう…", "ダメ:("];
    stateClickCount.increment();
    // 让 Yes 变大，每次放大 1 倍
    let yesSize = 1 + (stateClickCount.getCount() * 0.6);
    yesButton.style.transform = `scale(${yesSize})`;
    // 挤压 No 按钮，每次右移 50px
    let noOffset = stateClickCount.getCount() * 25;
    noButton.style.transform = `translateX(${noOffset}px)`;
    // 新增：让图片和文字往上移动
    let moveUp = stateClickCount.getCount() * 12.5; // 每次上移 10px
    mainImage.style.transform = `translateY(-${moveUp}px)`;
    questionText.style.transform = `translateY(-${moveUp}px)`;
    // No 文案变化（前 5 次变化）
    if (stateClickCount.getCount() <= 5) {
        noButton.innerText = noTexts[stateClickCount.getCount() - 1];
    }
}

// Yes 按钮点击事件
function handleYesClick() {
    let lang = window.location.pathname.includes('ja-JP') ? 1 : 0;
    document.getElementById("pix-body").innerHTML = ` 
        <div class="pix-yes-screen">
            <div class="pix-yes-text" style="font-family: 'ziti';">` +(
            (lang == 0) ? `!!!喜欢你!! ( >᎑<)♡︎ᐝ`
            : `!!!大好き!! ( >᎑<)♡︎ᐝ`
            ) + `</div>
            <div class="pix-LY14">
                <input type="checkbox" class="pix-LY14d">
                <div class="pix-LY14e">
                    <svg viewBox="0 0 24 24" class="pix-LY14c" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                    </svg>
                    <svg viewBox="0 0 24 24" class="pix-LY14b" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                    </svg>
                    <svg class="pix-LY14a" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="10,10 20,20"></polygon>
                        <polygon points="10,50 20,50"></polygon>
                        <polygon points="20,80 30,70"></polygon>
                        <polygon points="90,10 80,20"></polygon>
                        <polygon points="90,50 80,50"></polygon>
                        <polygon points="80,80 70,70"></polygon>
                    </svg>
                </div>
            </div>
            <div id="pix-image">
                <img src="/statics/as-content/index/about/pix-favicon.webp" alt="雨雪兴奋">
            </div>
        </div>`;
}

// 处理lang-switch-button和yes-no-button的响应
document.addEventListener('click', function(event) {
    const target = event.target;
    if (target.matches('#pix-yes')) {
        handleYesClick(event);
        return ;
    } else if (target.matches('#pix-no')) {
        handleNoClick(event);
        return ;
    }
    const btn = target.closest('.lang-switch');
    if (btn) {
        toggleLanguage(event);
        return ;
    }
});
