/**
 * 曲线辅助模块
 */

import {
    create as v2Create,
    disSquare as v2DistSquare,
    VectorArray
} from './vector';

const mathPow = Math.pow;
const mathSqrt = Math.sqrt;

const EPSILON = 1e-8;
const EPSILON_NUMERIC = 1e-4;

const THREE_SQRT = mathSqrt(3);
const ONE_THREE = 1 / 3;

// 临时变量
const _v0 = v2Create();
const _v1 = v2Create();
const _v2 = v2Create();

function isAroundZero(val: number) {
    return val > -EPSILON && val < EPSILON;
}
function isNotAroundZero(val: number) {
    return val > EPSILON || val < -EPSILON;
}
/**
 * 三次贝塞尔值计算
 */
export function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number) {
    const onet = 1 - t;
    return onet * onet * (onet * p0 + t * p1) + 
            t * t * (t * p3 + 3 * onet * p2);
}

/**
 * 三次贝塞尔导数值
 */
export function cubicDeravativeAt(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const onet = 1 - t;
    return 3 * (
        ((p1 - p0) * onet + 2 * (p2 - p1) * t) * onet + 
        (p3 - p2) * t * t
    );
}

/**
 * 三次贝塞尔方程根的值的计算， 使用盛金公式
 */
export function cubicRootAt(p0: number, p1: number, p2: number, p3: number, val: number, roots: number[]): number {
    
}