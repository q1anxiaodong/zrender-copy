/**
 * arrayDiff返回两个数组的差集数组
 */

// Myers' Diff Algorithm 迈尔斯差分算法
// 
type EqualFunc<T> = (a: T, b: T) => boolean;

type DiffComponent = {
    count: number,
    added: boolean,
    removed: boolean,
    indices: number[]
}
