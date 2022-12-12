/**
 * 3*2 矩阵操作类
 */

/**
 * 原本在vector.ts中，但是vector类已经逐渐被废弃了，所以直接转移到matrix中
 */
import { VectorArray } from "./vector";

export type MatrixArray = number[];

/**
 * 创建一个单位矩阵
 * @returns 
 */
export function create(): MatrixArray {
    return [1, 0,
            0, 1,
            0, 0];
}

/**
 * 设置矩阵为单位矩阵
 */
export function identity(out: MatrixArray): MatrixArray {
    out[0] = 1; out[1] = 0;
    out[2] = 0; out[3] = 1;
    out[4] = 0; out[5] = 0;
    return out;
}

/**
 * 复制矩阵
 */
export function copy(out: MatrixArray, m: MatrixArray): MatrixArray {
    out[0] = m[0];  out[1] = m[1];
    out[2] = m[2];  out[3] = m[3];
    out[4] = m[4];  out[5] = m[5];
    return out;
}

/**
 * 矩阵相乘
 * @param out 
 * @param m1 
 * @param m2 
 * @returns 
 */
export function mul(out: MatrixArray, m1: MatrixArray, m2: MatrixArray): MatrixArray {
    // 表面上是3x2矩阵相乘，实际上是程序中为节省存储资源
    // 只记录了3x3矩阵中的前6位。
    // 这里out和m2相同，所以用m2·m1,其中两个矩阵都是行向量对应的变换矩阵.
    const out0 = m1[0] * m2[0] + m1[2] * m2[1];
    const out1 = m1[1] * m2[0] + m1[3] * m2[1];
    const out2 = m1[0] * m2[2] + m1[2] * m2[3];
    const out3 = m1[1] * m2[2] + m1[3] * m2[3];
    const out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
    const out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = out3;
    out[4] = out4;
    out[5] = out5;
    return out;
}

/**
 * 平移变换
 * @param out 
 * @param a 
 * @param v 
 */
export function translate(out: MatrixArray, a: MatrixArray, v: VectorArray): MatrixArray {
    // 此处的a矩阵是xy方向上的基向量对应的 列向量矩阵, 格式如下：
    // a  b  0
    // c  d  0
    // Tx Ty 1
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4] + v[0];
    out[5] = a[5] + v[1];
    return out;
}

/**
 * 旋转变换 同样遵从仿射变换矩阵的变换公式
 * 不过需要从 a1·a0 转换成a0的转置矩阵乘a1，即 (a0T)·a1，所以有下面的计算流程。
 * @description a1是旋转矩阵，a0是原变换矩阵
 * @param out 
 * @param a 
 * @param rad 
 * @returns 
 */
export function rotate(out: MatrixArray, a: MatrixArray, rad: number): MatrixArray {
    const aa = a[0];
    const ac = a[2];
    const atx = a[4];
    const ab = a[1];
    const ad = a[3];
    const aty = a[5];
    const st = Math.sin(rad);
    const ct = Math.cos(rad);

    out[0] = aa * ct + ab * st;
    out[1] = -aa * st + ab * ct;
    out[2] = ac * ct + ad * st;
    out[3] = -ac * st + ct * ad;
    out[4] = ct * atx + st * aty;
    out[5] = ct * aty - st * atx;
    return out;
}

/**
 * 缩放变换
 */

export function scale(out: MatrixArray, a: MatrixArray, v: VectorArray): MatrixArray {
    const vx = v[0];
    const vy = v[1];
    out[0] = a[0] * vx;
    out[1] = a[1] * vy;
    out[2] = a[2] * vx;
    out[3] = a[3] * vy;
    out[4] = a[4] * vx;
    out[5] = a[5] * vy;
    return out;
} 

/**
 * 求逆矩阵
 */
export function invert(out: MatrixArray, a: MatrixArray): MatrixArray | null {
    const aa = a[0];
    const ac = a[2];
    const atx = a[4];
    const ab = a[1];
    const ad = a[3];
    const aty = a[5];

    let det = aa * ad - ab * ac;

    // 如果a矩阵是一个奇异矩阵（a对应行列式为0，即|a|为0），则不可逆。
    if (!det) {
        return null;
    }
    
    // det为1/|a|
    det = 1.0 / det;

    // 伴随矩阵法求矩阵的逆：A' = (1/|A|) · A*
    // A'表示A矩阵的逆矩阵，A*表示A矩阵的伴随矩阵。
    // 伴随矩阵为矩阵A上各位置的元素替换成对应的代数余子式，然后将矩阵转置得到的矩阵。
    // 由此可得：
    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
}

/**
 * 克隆矩阵
 */
export function clone(a: MatrixArray): MatrixArray {
    const b = create();
    copy(b, a);
    return b;
}