/**
 * 从core.env.ts导入模块，做了些什么东西
 */
import env from './core/env';

let dpr = 1;

// 如果在浏览器环境下
/**
 * deviceXDPI 属性返回显示屏幕的每英寸水平点数。(屏幕设备的水平方向上的dpi<图像每英寸长度内的像素点数>)
 * logicalXDPI 属性可返回显示屏幕每英寸的水平方向的常规点数。(逻辑上的水平方向上的dpi)
 * 在老版本的IE浏览器中deviceXDPI / logicalXDPI 相当于 window.devicePixelRatio
 * 以上两属性都是在比较老的IE浏览器的window对象中才有，较新的edge和其他浏览器都是用的window.devicePixelRatio。
 */
if (env.hasGlobalWindow) {
    dpr = Math.max(
        window.devicePixelRatio
        || (window.screen && (window.screen as any).deviceXDPI / (window.screen as any).logicalXDPI)
        || 1, 1
    );
}

/**
 * debug 日志模式:
 * 0: 什么都不做, 用于发布
 * 1: console.err, 用于debug
 */
export const debugMode = 0;

// retina 屏幕优化 可见关于config.ts.md
export const devicePixelRatio = dpr;

/**
 * 根据backgroundColor的亮度确定什么情况下打开深色模式
 */
export const DARK_MODE_THRESHOLD = 0.4;

/**
 * 深色模式下Label标签的默认颜色
 */
export const DARK_LABEL_COLOR = '#333'

/**
 * 浅色模式下Label标签的默认颜色
 */
export const LIGHT_LABEL_COLOR = '#ccc';

/**
 * 在更浅背景的模式下Label标签的默认颜色
 */
export const LIGHTER_LABEL_COLOR = '#eee';


