/** @format */

/**
 * Pythonのzipのように2つのリストを結合する
 * @param arrays ex.([a,d] [b,e] [c,f])
 * @returns ex.[[a,b,c], [d,e,f]]
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zip = <T>(...arrays: T[][]): T[][] => {
  const length = Math.min(...arrays.map((arr: T[]) => arr.length));
  return new Array(length).fill(0).map((_, i) => arrays.map((arr) => arr[i]));
};
