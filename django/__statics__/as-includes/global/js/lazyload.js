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
