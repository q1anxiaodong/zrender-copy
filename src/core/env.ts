// 全局声明一个叫wx的常量对象，内含一个getSystemInfoSync的方法
declare const wx: {
    getSystemInfoSync: Function
};

/**
 * 浏览器类
 */
class Browser {
    firefox = false
    ie = false
    edge = false
    newEdge = false
    weChat = false
    // 版本号
    version: string | number
}

/**
 * 为运行环境单独创建一个类，记录运行环境信息
 */
class Env {
    browser = new Browser()
    node = false
    // wxa--一个轻量级的微信小程序开发框架，不太清楚。见env.ts.md。
    wxa = false
    // 为解决js因为在一个线程中工作导致阻塞js主线程的另一个运行环境， web worker。
    worker = false
    // 是否支持svg
    svgSupported = false
    // 是否支持touch事件,主要针对非ie、edge浏览器
    touchEventsSupported = false
    // 是否支持pointer事件，主要在ie11+或者edge浏览器中支持
    pointerEventsSupported = false
    // 是否支持dom元素操作
    domSupported = false
    // 是否支持transform
    transformSupported = false
    // 是否支持transform3d
    transform3dSupported = false

    // 是否在浏览器环境下
    hasGlobalWindow = typeof window !== 'undefined'
}

const env = new Env();

// 如果存在wxa全局对象wx，并且wx.getSystemInfoSync可访问，就是微信小程序运行环境
if (typeof wx === 'object' && typeof wx.getSystemInfoSync === 'function') {
    env.wxa = true;
    env.touchEventsSupported = true;
}
// worker运行环境下，
else if (typeof document === 'undefined' && typeof self !== 'undefined') {
    env.worker = true;
}
// node环境
else if (typeof navigator === 'undefined') {
    env.node = true;
    env.svgSupported = true;
}
// 其他环境 浏览器
else {
    detect(navigator.userAgent, env);
}

function detect (ua: string, env: Env) {
    const browser = env.browser;
    const firefox = ua.match(/FireFox\/([\d.]+)/);
    const ie = ua.match(/MSIE\s([\d.]+)/)
        // IE 11 Trident/7.0; rv: 11.0
        || ua.match(/Trident\/.+?rv(([\d.]+))/);
    // IE12 IE12+
    const edge = ua.match(/Edge?\/([\d.]+)/);

    const weChat = (/micromessenger/i).test(ua);

    if (firefox) {
        browser.ie = true;
        browser.version = firefox[1];
    }
    if (ie) {
        browser.ie = true;
        browser.version = ie[1];
    }

    if (edge) {
        browser.edge = true;
        browser.version = edge[1];
        browser.newEdge = +edge[1].split('.')[0] > 18;
    }

    // 很难在Win Phone中准确检测微信，因为无法在Win Phone上设置ua。
    // 所以我们不考虑Win Phone。
    if (weChat) {
        browser.weChat = true;
    }

    // svg的一个常量
    env.svgSupported = typeof SVGRect !== 'undefined';
    // 当前浏览器不为ie或者edge并且window对象包含ontouchstart事件属性
    env.touchEventsSupported = 'ontouchstart' in window && !browser.ie && !browser.edge;
    env.pointerEventsSupported = 'onpointerdown' in window 
            && (browser.edge || (browser.ie && +browser.version >= 11));
    // 当前环境能否访问document对象
    env.domSupported = typeof document !== 'undefined';

    //Document.documentElement 
    //是一个会返回文档对象（document）的根元素的只读属性（如 HTML 文档的 <html> 元素）。
    const style = document.documentElement.style;

    env.transform3dSupported = (
        // IE9只支持transform 2D
        // 直到IE10才开始支持transform 3D
        // 通过'transition'属性是否在style中即可判别ie浏览器下是否支持transform 3D
        (browser.ie && 'transition' in style) 
        // edge支持
        || browser.edge
        // webkit浏览器内核
        || (('WebKitCSSMatrix' in window) && ('m11' in new WebKitCSSMatrix()))
        // gecko内核的浏览器
        || 'Mozperspective' in style
    )// Opera 在12版本之后才开始支持 CSS transforms
        && !('Otransition' in style);
    
    // 除了IE6-IE8 和 很老的 firefox2-3 和 opera 10.1 其他浏览器都支持transform 2D
    env.transformSupported = env.transform3dSupported
        ||
        // IE9开始支持transform 2D 
        (browser.ie && +browser.version >= 9);

}

export default env;