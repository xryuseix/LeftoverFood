/** @format */

/**
 * Pythonのzipのように2つのリストを結合する
 * @param arrays ex.[1, 2, 3], [4, 5, 6]
 * @returns ex.[1, 4],[2, 5],[3, 6]
 */
export const zip = <T>(...arrays: T[][]): T[][] => {
  const length = Math.min(...arrays.map((arr: T[]) => arr.length));
  return new Array(length).fill(0).map((_, i) => arrays.map((arr) => arr[i]));
};

export const add = (a: number, b: number): number => a + b;
