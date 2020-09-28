;
(function (win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"][from="flexible"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible = {};

    if (metaEl) {
        metaEl.parentElement.removeChild(metaEl);
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
        }
    }

    if (!dpr && !scale) {
        var devicePixelRatio = win.devicePixelRatio;
        dpr = devicePixelRatio;
        scale = 1 / dpr;

        var dataDpr;
        if (devicePixelRatio >= 2.5 && (!dpr || dpr >= 2.5)) {
            dataDpr = 3;
        } else if (devicePixelRatio >= 1.5 && (!dpr || dpr >= 1.5)) {
            dataDpr = 2;
        } else {
            dataDpr = 1;
        }

        docEl.setAttribute('data-dpr', dataDpr);
    }

    if (!doc.querySelector('meta[name="viewport"]')) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = 540 * dpr;
        }
        var rem = width / 10;

        var isAndroid = win.navigator.userAgent.match(/android/i);
        var isIOS = win.navigator.userAgent.match(/iP(ad|hone|od)/i);
        var isPc = !isAndroid && !isIOS;

        // 在开启全局适配情况下，当手机竖屏或为PC页面时重新计算rem值
        if (!!win.isFullScreenPage && (window.matchMedia('(orientation: portrait)').matches || isPc)) {
            var height = docEl.getBoundingClientRect().height;
            var aspectRatio = width / height;
            // 视觉稿一般是按375*603比例给出的(除去顶部导航栏)
            var baseAspectRatio = 375 / 603;
            if (aspectRatio > baseAspectRatio) {
                rem = rem * (baseAspectRatio / aspectRatio);
            }
        }

        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function () {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function (e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }


    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function (d) {
        var val = parseFloat(d) * flexible.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function (d) {
        var val = parseFloat(d) / flexible.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }

})(window, window['lib'] || (window['lib'] = {}));
