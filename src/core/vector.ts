import { MatrixArray } from "./matrix";

export type VectorArray = number[];

/**
 * 创建一个向量
 * @param x
 * @param y
 */
export function create(x?: number, y?: number): VectorArray {
    if (x == null) {
        x = 0;
    }
    if (y == null) {
        y = 0;
    }
    return [x, y];
}

/**
 * 克隆一个向量
 * @param v 
 * @returns 
 */
export function clone(v: VectorArray): VectorArray {
    return [v[0], v[1]];
}

/**
 * 复制向量数据
 */
export function copy<T extends VectorArray>(out: T, v: VectorArray): T {
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

/**
 * 设置向量的两个项
 * @param out 
 * @param a 
 * @param b 
 * @returns 
 */
export function set<T extends VectorArray>(out: T, a: number, b: number): T {
    out[0] = a;
    out[1] = b;
    return out;
}

/**
 * 向量相加
 * @param out 
 * @param v1 
 * @param v2 
 * @returns 
 */
export function add<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T {
    out[0] = v1[0] + v2[0];
    out[1] = v1[1] + v2[1];
    return out;
}

/**
 * 向量缩放后相加
 * @param out 
 * @param v1 
 * @param v2 
 * @param a 
 * @returns 
 */
export function scaleAndAdd<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray, a: number): T {
    out[0] = v1[0] + v2[0] * a;
    out[1] = v1[1] + v2[1] * a;
    return out;
}

/**
 * 向量相减
 * @param out 
 * @param v1 
 * @param v2 
 * @returns 
 */
export function sub<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];
    return out;
}

/**
 * 向量求模长, 长度
 * @param v 
 * @returns 
 */
export function len(v: VectorArray): number {
    return Math.sqrt(lenSquare(v));
}

export const length = len;

/**
 * 向量模长的平方
 * @param v 
 * @returns 
 */
export function lenSquare(v: VectorArray): number {
    return v[0] * v[0] + v[1] * v[1];
}

export const lengthSquare = lenSquare;

/**
 * 向量乘法 (点乘)
 * 此处为向量乘法的坐标乘法
 * @param out 
 * @param v1 
 * @param v2 
 * @returns 
 */
export function mul<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T {
    out[0] = v1[0] * v2[0];
    out[1] = v1[1] * v2[0];
    return out;
}

/**
 * 向量除法
 * @param out 
 * @param v1 
 * @param v2 
 * @returns 
 */
export function div<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T {
    out[0] = v1[0] / v2[0];
    out[1] = v1[1] / v2[1];
    return out;
}

/**
 * 向量点乘
 * 这里是坐标乘法, 另外一种是模乘法，|v1|*|v2|*cos(angle)
 * @param v1 
 * @param v2 
 * @returns 
 */
export function dot(v1: VectorArray, v2: VectorArray) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

/**
 * 向量缩放
 * @param out 
 * @param v 
 * @param s 
 * @returns 
 */
export function scale<T extends VectorArray>(out: T, v: VectorArray, s: number): T {
    out[0] = v[0] * s;
    out[1] = v[1] * s;
    return out;
}

/**
 * 向量归一化
 * @param out 
 * @param v 
 * @returns 
 */
export function normalize<T extends VectorArray>(out: T, v: VectorArray): T {
    // 获取v的模长
    const d = len(v);

    // 如果v为0向量
    if (d === 0) {
        out[0] = 0;
        out[1] = 0;
    }
    else {
        out[0] = v[0] / d;
        out[1] = v[1] / d;
    }
    return out;
}

/**
 * 计算向量间的距离
 * @param v1 
 * @param v2 
 * @returns 
 */
export function distance(v1: VectorArray, v2: VectorArray): number {
    return Math.sqrt(
        (v1[0] - v2[0]) * (v1[0] - v2[0])
        + (v1[1] - v2[1]) * (v1[1] - v2[1])
    );
}

export const dist = distance;

/**
 * 向量距离的平方
 * @param v1 
 * @param v2 
 * @returns 
 */
export function distanceSquare(v1: VectorArray, v2: VectorArray): number {
    return (v1[0] - v2[0]) * (v1[0] - v2[0])
    + (v1[1] - v2[1]) * (v1[1] - v2[1]);
}

export const distSquare = distanceSquare;

/**
 * 求负向量
 * 不知道是不是相反向量
 * @param out 
 * @param v 
 * @returns 
 */
export function negate<T extends VectorArray>(out: T, v: VectorArray): T {
    out[0] = -v[0];
    out[1] = -v[1];
    return out;
}

/**
 * 插值两个点
 * @param out 
 * @param v1 
 * @param v2 
 * @param t 
 * @returns 
 */
export function lerp<T extends VectorArray>(out: T, v1:VectorArray, v2: VectorArray, t: number): T {
    out[0] = v1[0] + t * (v2[0] - v1[0]);
    out[1] = v1[0] + t * (v2[1] - v1[1]);
    return out;
}

/**
 * 矩阵左乘向量
 * @param out 
 * @param v 
 * @param m 
 * @returns 
 */
export function applyTransform<T extends VectorArray>(out: T, v: VectorArray, m: MatrixArray): T {
    const x = v[0];
    const y = v[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
}

/**
 * 求两个向量的最小值
 * @param out 
 * @param v1 
 * @param v2 
 * @returns 
 */
export function min<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T {
    out[0] = Math.min(v1[0], v2[0]);
    out[1] = Math.min(v1[0], v2[1]);
    return out;
}

/**
 * 求两个向量的最大值
 * @param out 
 * @param v1 
 * @param v2 
 */
export function max<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T {
    out[0] = Math.max(v1[0], v2[0]);
    out[1] = Math.max(v1[1], v2[1]);
    return out;
}
