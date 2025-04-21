(()=>{var isInitialized = false;
function loadScript(url) {
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.getElementsByClassName("iframe")[0].appendChild(script);
    });
}
function loadHtml(){
    document.getElementById("iframe").innerHTML = ` 
    <div class="waifu" style="z-index:289;">
        <!-- aplayer.z-index[290-299] -->
        <div class="waifu-tips" lang="zh-CN"></div>
        <canvas id="live2d" width="280" height="250" style="bottom: -10px;"></canvas>
        <div class="waifu-tool">
            <span class="fui-home"></span>
            <span class="fui-chat"></span>
            <span class="fui-eye"></span>
            <span class="fui-user"></span>
            <span class="fui-photo"></span>
            <span class="fui-info-circle"></span>
            <span class="fui-cross"></span>
        </div>
    </div>
    <meting-js id="2608803683" server="tencent" type="playlist" fixed="true" autoplay loop order="random" preload="none" volume="0.2" mutex="true"></meting-js>
    `;
}
$(window).on('load', function() {
    if(isInitialized) return;
    loadHtml();
    $(function() { $("body").on("click", ".aplayer", function() {
        $(".aplayer-button").hasClass("aplayer-play") ?
            $(".aplayer-lrc").removeClass("lrc-show") : $(".aplayer-lrc").addClass("lrc-show")
    }) })
    var loadSequence = loadQueue.reduce(function(chain, script) {
        return chain.then(function() {
            return loadScript(script).catch(function(err) {
                console.error('Script load failed:', err.target.src);
            });
        });
    }, Promise.resolve());
    loadSequence.then(function() {
        initModel(modulesPath, modelNames, waifuTipsUrl);
        console.log("iframe load completed.");
        isInitialized = true;
    });
});
})();