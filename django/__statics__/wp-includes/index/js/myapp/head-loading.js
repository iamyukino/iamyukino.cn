const HeadLoading = (() => {
    const config = {
      animationCycle: 2900, // 单次2.3s+0.6s
      checkInterval: 100,   // 定时器0.1s
      fadeDuration: 500     // 淡出0.6s
    };
    let state = {
      loadStart: null,      // 加载开始
      cycleStart: null,     // 当前周期开始
      windowLoaded: false,  // 加载完成
      checkInterval: null   // 定时器
    };
    const elements = {
      container: null,      // 总容器
      square: null,         // 动画容器
      svg: null,            // 兔兔
      hlElements: []        // 子元素
    };
    function resetLoaderAnimations() {
      const clones = Array.from(elements.hlElements).map(el => 
        el.cloneNode(true)
      ); // 克隆所有元素
      const svgClone = elements.svg.cloneNode(true);
  
      elements.hlElements.forEach(el => el.remove());
      elements.svg.remove();
  
      clones.forEach(clone => 
        elements.square.prepend(clone)
      ); // 插入克隆元素
      elements.square.append(svgClone);
  
      elements.hlElements = 
        elements.square.querySelectorAll('.hl-element');
      elements.svg =
        elements.square.querySelector('svg');
    }
    function startAnimationCycle() {
      state.cycleStart = Date.now();
      state.checkInterval = setInterval(() => {
        if (state.windowLoaded) return;
        if (Date.now() - state.cycleStart >= config.animationCycle) {
          resetLoaderAnimations();
          state.cycleStart = Date.now();
        } // 达到周期时长时重置动画
      }, config.checkInterval);
    }
    function handleLoadComplete() {
      state.windowLoaded = true;
      clearInterval(state.checkInterval);
      const elapsed = Date.now() - state.cycleStart;
      const remaining = Math.max(config.animationCycle - elapsed, 0);
      setTimeout(() => { // 执行淡出动画
        elements.container.style.transition = 
          `opacity ${config.fadeDuration}ms`;
        elements.container.style.opacity = '0';
        setTimeout(() => {
          elements.container.style.display = 'none';
        }, config.fadeDuration);
        $(".3to1").ready(() => {
          if (initTypeWriter) {
            setTimeout(initTypeWriter, 500);
          }
        });
      }, remaining);
    }
    function init() {
      elements.container = 
        document.querySelector('.head-loading');
      elements.square = 
        document.querySelector('.hl-square');
      elements.hlElements = 
        document.querySelectorAll('.hl-element');
      elements.svg = 
        document.querySelector('.hl-square > svg');
      state.loadStart = Date.now();
      startAnimationCycle();
      if (document.readyState === 'complete') { handleLoadComplete(); }
      window.addEventListener('load', handleLoadComplete);
    }
    return { init };
  })();
  HeadLoading.init();