import * as matrix from './matrix';
import * as vector from './vector';

/** 单位矩阵的构造器 */
const mIdentity = matrix.identity;

/** ε: 在极限讨论中代表的是一个大于0的很小的数,可以任意小,只要不等于零。 */
const EPSILON = 5e-5; 

// 判断是否趋近于零
function isNotAroundZero(val: number) {
    return val > EPSILON || val < -EPSILON;
}

const scaleTmp: vector.VectorArray = [];
const tmpTransform: matrix.MatrixArray = [];
// 定义并实例化原始变换矩阵
const originTransform = matrix.create();
const abs = Math.abs;

// 可变换的混入类
class Transformable {
    // 当前可变换对象的父节点，如果有的话
    parent: Transformable;

    // 当前对象相对于父节点锚点坐标的位置
    x: number;
    y: number;

    // 分别是x和y方向上的缩放比例
    scaleX: number;
    scaleY: number;

    //分别是x和y方向上的倾斜比例， 也可以说是两个方向上的切变比例
    skewX: number;
    skewY: number;

    // 当前对象的旋转角度
    rotation: number;

    // 锚点坐标
    /**
     * 将在应用其他变换之前将元素转换到锚点位置。
     */
    anchorX: number;
    anchorY: number;
    
    /**
     * 缩放、倾斜、旋转的原点坐标
     */
    originX: number;
    originY: number;


    /**
     * Scale ratio
     *  全局缩放比例？ 应该是给resize方法之类的准备的
     */
    globalScaleRatio: number;

    /** 本节点的变换矩阵 */
    transform: matrix.MatrixArray;
    /** 本节点的变换矩阵的逆阵 */
    invTransform: matrix.MatrixArray;

    /**
     * 获取计算完成的本节点的变换矩阵
     * @param m 
     * @returns 
     */
    getLocalTransform(m?: matrix.MatrixArray) {
        return Transformable.getLocalTransform(this, m);
    }

    /**
     * 通过数组设置节点的相对位置
     * @param arr 
     */
    setPosition(arr: number[]) {
        this.x = arr[0];
        this.y = arr[1];
    }

    /**
     * 通过数组设置节点在两个方向上的缩放比例
     * @param arr 
     */
    setScale(arr: number[]) {
        this.scaleX = arr[0];
        this.scaleY = arr[1];
    }

    /**
     * 通过数组设置节点在两个方向上的倾斜比例
     * @param arr 
     */
    setSkew(arr: number[]) {
        this.skewX = arr[0];
        this.skewY = arr[1];
    }

    /**
     * 通过数组设置节点的原点坐标
     * @param arr 
     */
    setOrigin(arr: number[]) {
        this.originX = arr[0];
        this.originY = arr[1];
    }

    /**
     * 是否需要计算变换矩阵, 单独计算本节点变换矩阵
     * @description 如果本节点的旋转角度、相对位置、倾斜比例都为0，且缩放比例都为1，则不用计算变换矩阵
     */
    needLocalTransform(): boolean {
        return isNotAroundZero(this.rotation)
        || isNotAroundZero(this.x)
        || isNotAroundZero(this.y)
        || isNotAroundZero(this.scaleX - 1)
        || isNotAroundZero(this.scaleY - 1)
        || isNotAroundZero(this.skewX)
        || isNotAroundZero(this.skewY);
    }

    /**
     * 更新全局变换矩阵
     */
    updateTransform() {
        const parentTransform = this.parent && this.parent.transform;
        const needLocalTransform = this.needLocalTransform();

        let m = this.transform;
        // 如果不需要计算本节点变换矩阵且父节点也没有变换矩阵， 则本节点矩阵为单位矩阵，不做任何变换
        if (!(needLocalTransform || parentTransform)) {
            m && mIdentity(m);
            return;
        }
        
        // 需要计算矩阵，则初始化本节点矩阵为单位矩阵
        m = m || matrix.create();

        // 如果是需要单独计算本节点矩阵， 则获取计算完成的矩阵
        if (needLocalTransform) {
            this.getLocalTransform(m);
        }
        // 否则 本节点矩阵置为单位矩阵
        else {
            mIdentity(m);
        }

        // 应用父节点变换
        // 如果父节点存在变换矩阵
        if (parentTransform) {
            // 且需要单独计算本节点矩阵
            if (needLocalTransform) {
                // 则本节点变换矩阵置为父节点矩阵左乘本节点矩阵, 让本节点矩阵在父节点的基础上进行变换
                matrix.mul(m, parentTransform, m);
            }
            // 且不需要单独计算本节点矩阵
            else {
                // 则本节点矩阵完全继承父节点矩阵
                matrix.copy(m, parentTransform);
            }
        }
        // 保存本节点矩阵为m
        this.transform = m;

        // 处理globalScaleRatio
        this._resolveGlobalScaleRatio(m);
    }

    /**
     * 
     * @param m 
     */
    private _resolveGlobalScaleRatio(m: matrix.MatrixArray) {
        const globalScaleRatio = this.globalScaleRatio;
        // 如果globalScaleRatio不为空且不为1
        if (globalScaleRatio != null && globalScaleRatio !== 1) {
            // 获取全局缩放比例, 记录在scaleTmp
            this.getGlobalScale(scaleTmp);
            const relX = scaleTmp[0] < 0 ? -1 : 1;
            const relY = scaleTmp[1] < 0 ? -1 : 1;
            const sx = ((scaleTmp[0] - relX) * globalScaleRatio + relX) / scaleTmp[0] || 0;
            const sy = ((scaleTmp[1] - relY) * globalScaleRatio + relY) / scaleTmp[1] || 0;

            m[0] *= sx;
            m[1] *= sx;
            m[2] *= sy;
            m[3] *= sy;
        }

        this.invTransform = this.invTransform || matrix.create();
        matrix.invert(this.invTransform, m);
    }

    /**
     * 通过更新所有祖先节点的变换矩阵来获取本节点的变换矩阵
     * @attention 这个方法会强制更新本节点的全部祖先节点 
     * @returns 
     */
    getComputedTransform() {
        let transformNode: Transformable = this;
        const ancestors: Transformable[] = [];
        while(transformNode) {
            ancestors.push(transformNode);
            transformNode = transformNode.parent;
        }

        while (transformNode = ancestors.pop()) {
            transformNode.updateTransform();
        }

        return this.transform;
    }

    setLocalTransform(m: vector.VectorArray) {
        if (!m) {
            // TODO return or set identity
            return;
        }
        let sx = m[0] * m[0] + m[1] * m[1];
        let sy = m[2] * m[2] + m[3] + m[3];

        const rotation = Math.atan2(m[1], m[0]);

        const shearX = Math.PI / 2 + rotation - Math.atan2(m[3], m[2]);
        sy = Math.sqrt(sy) * Math.cos(shearX);
        sx = Math.sqrt(sx);
    }
    /**
     * get Global scale
     * @param out 
     * @returns 
     */
    getGlobalScale(out?: vector.VectorArray): vector.VectorArray {
        const m = this.transform;
        out = out || [];
        // 如果本节点没有变换矩阵，则全局缩放比例为1
        if (!m) {
            out[0] = 1;
            out[1] = 1;
            return out;
        }
        // 推测：有转换公式x' = m[0] * x + m[1] * x; y' = m[2] * x + m[3] * y;
        //  
        out[0] = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
        out[1] = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
        //据公式 x方向上的比例主要由m[0]决定 
        if (m[0] < 0) {
            out[0] = -out[0];
        }
        //据公式 y方向上的比例主要由m[3]决定
        if (m[3] < 0) {
            out[1] = -out[1];
        }
        return out;
    }

    /**
     * 将坐标点变换位置到 shape 的局部坐标空间
     * @param x 
     * @param y 
     * @returns 
     */
    transformCoordToLocal(x: number, y: number): number[] {
        const v2 = [x, y];
        const invTransform = this.invTransform;
        if (invTransform) {
            vector.applyTransform(v2, v2, invTransform);
        }
        return v2;
    }

    /**
     * 将坐标点变换位置到全局坐标空间
     * @param x 
     * @param y 
     * @returns 
     */
    transformCoordToGlobal(x: number, y: number): number[] {
        const v2 = [x, y];
        const transform = this.transform;
        if (transform) {
            vector.applyTransform(v2, v2, transform);
        }
        return v2;
    }

    getLineScale() {
        const m = this.transform;
        // 获得线比例。“m”的行列式表示通过变换放大的面积。因此，它的平方根可以用作宽度的比例因子。
        return m && abs(m[0] - 1) > 1e-10 && abs(m[3] - 1) > 1e-10 ?
                Math.sqrt(abs(m[0] * m[3] - m[1] * m[2]))
                : 1;
    }

    copyTransform(source: Transformable) {
        copyTransform(this, source);
    }

    static getLocalTransform(target: Transformable, m: matrix.MatrixArray): matrix.MatrixArray {
        m = m || [];

        const ox = target.originX || 0;
        const oy = target.originY || 0;
        const sx = target.scaleX;
        const sy = target.scaleY;
        const ax = target.anchorX;
        const ay = target.anchorY;
        const rotation = target.rotation || 0;
        const x = target.x;
        const y = target.y;
        const skewX = target.skewX ? Math.tan(target.skewX) : 0;
        // zrender用的另外一种（右手）坐标系, y轴被反转了
        const skewY = target.skewY ? Math.tan(-target.skewY) : 0;

        if(ox || oy || ax || ay) {
            const dx = ox + ax;
            const dy = oy + ay;
            m[4] = -dx * sx - skewX * dy * sy;
            m[5] = -dy * sy - skewY * dx + sx;
        } else {
            m[4] = m[5] = 0;
        }
        // scale
        m[0] = sx;
        m[3] = sy;
        // skew
        m[1] = skewY * sx;
        m[2] = skewX * sy;
        // Apply rotation
        rotation && matrix.rotate(m, m, rotation);

        // 从原点往回变换，并应用变换
        m[4] += ox + x;
        m[5] += oy + y;

        return m;
    }
    private static initDefaultProps = (function () {
        const proto = Transformable.prototype;
        proto.scaleX = 
        proto.scaleY =
        proto.globalScaleRatio = 1;
        proto.x = 
        proto.y = 
        proto.originX = 
        proto.originY = 
        proto.skewX = 
        proto.skewY = 
        proto.rotation = 
        proto.anchorX = 
        proto.anchorY = 0; 
    })();
    
}
export const TRANSFORMABLE_PROPS = [
    'x', 'y', 'originX', 'originY', 'anchorX', 'anchorY', 'rotation', 'scaleX', 'scaleY', 'skewX', 'skewY'
] as const;

export type TransformProp = (typeof TRANSFORMABLE_PROPS)[number];
export function copyTransform(target: Partial<Pick<Transformable, TransformProp>>, source: Pick<Transformable, TransformProp>) {
    for (let i = 0; i < TRANSFORMABLE_PROPS.length; i+=1) {
        const propName = TRANSFORMABLE_PROPS[i];
        target[propName] = source[propName];
    }
}

export default Transformable;