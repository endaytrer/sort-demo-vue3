export default class SortingMethod {
  /**
   *
   * @async sort 排序方法
   * 你可以在这个方法内写排序函数. 你可能调用到如下函数来辅助你的排序:
   * @param size {number} 你会得到带排序数组的大小.
   * @param get {(index: number) => Promise<number>} 通过`await get(i)` 来获取数组中第`i`个元素的值.
   * @param swap {(index1: number, index2: number) => Promise<void>} 通过`await swap(i, j)` 来获交换组中第`i`个和第`j`个元素的值.
   * @param assign {(index: number, value: number) => Promise<number>} 通过`await assign(i, val)` 来将数组中第`i`个元素的值赋值为`val`.
   */
  sort: (
    size: number,
    get: (index: number) => Promise<number>,
    swap: (index1: number, index2: number) => Promise<void>,
    assign: (index: number, value: number) => Promise<void>
  ) => Promise<void>;
  constructor(
    sort: (
      size: number,
      get: (index: number) => Promise<number>,
      swap: (index1: number, index2: number) => Promise<void>,
      assign: (index: number, value: number) => Promise<void>
    ) => Promise<void>
  ) {
    this.sort = sort;
  }
}
export const bubbleSort: SortingMethod = new SortingMethod(
  async (
    size: number,
    get: (index: number) => Promise<number>,
    swap: (index1: number, index2: number) => Promise<void>
  ) => {
    for (let i = size - 1; i >= 0; i--) {
      for (let j = 1; j <= i; j++) {
        if ((await get(j - 1)) > (await get(j))) {
          await swap(j - 1, j);
        }
      }
    }
  }
);
export const heapSort: SortingMethod = new SortingMethod(
  async (
    size: number,
    get: (index: number) => Promise<number>,
    swap: (index1: number, index2: number) => Promise<void>
  ) => {
    await buildHeap(size, get, swap);
    for (let i = size - 1; i >= 0; i--) {
      await swap(i, 0);
      await pushDown(0, i, get, swap);
    }
  }
);
function lc(a: number) {
  return a * 2 + 1;
}
function rc(a: number) {
  return a * 2 + 2;
}
async function pushDown(
  index: number,
  size: number,
  get: (index: number) => Promise<number>,
  swap: (index1: number, index2: number) => Promise<void>
): Promise<void> {
  let largest = index;
  if (lc(index) < size && (await get(lc(index))) > (await get(largest))) {
    largest = lc(index);
  }
  if (rc(index) < size && (await get(rc(index))) > (await get(largest))) {
    largest = rc(index);
  }
  if (largest != index) {
    await swap(index, largest);
    await pushDown(largest, size, get, swap);
  }
}
async function buildHeap(
  size: number,
  get: (index: number) => Promise<number>,
  swap: (index1: number, index2: number) => Promise<void>
): Promise<void> {
  for (let i = Math.floor((size - 2) / 2); i >= 0; i--) {
    await pushDown(i, size, get, swap);
  }
}

export const quickSort: SortingMethod = new SortingMethod(
  async (
    size: number,
    get: (index: number) => Promise<number>,
    swap: (index1: number, index2: number) => Promise<void>
  ) => {
    await qs(0, size - 1, get, swap);
  }
);
async function qs(
  h: number,
  t: number,
  get: (index: number) => Promise<number>,
  swap: (index1: number, index2: number) => Promise<void>
) {
  if (h >= t) return;
  // find pivot
  const a1 = await get(h),
    a2 = await get(t),
    a3 = await get(mid(h, t));
  const maximum = Math.max(a1, a2, a3);
  const minimum = Math.min(a1, a2, a3);
  let pivot: number,
    key = a1;
  if (a2 !== maximum && a2 !== minimum) {
    key = a2;
  }
  if (a3 !== maximum && a3 !== minimum) {
    key = a3;
  }
  // start swapping;
  let p1 = h - 1,
    p2 = t + 1;
  while (p1 < p2) {
    do {
      p1++;
    } while ((await get(p1)) < key);
    do {
      p2--;
    } while ((await get(p2)) > key);
    if (p1 >= p2) {
      pivot = p2;
      break;
    }
    await swap(p1, p2);
  }
  pivot = p2;
  await qs(h, pivot, get, swap);
  await qs(pivot + 1, t, get, swap);
}
function mid(h: number, t: number) {
  return Math.floor((h + t) / 2);
}
export const mergeSort: SortingMethod = new SortingMethod(
  async (
    size: number,
    get: (index: number) => Promise<number>,
    swap: (index1: number, index2: number) => Promise<void>,
    assign: (index: number, value: number) => Promise<void>
  ) => {
    await ms(0, size - 1, get, assign);
  }
);
async function ms(
  h: number,
  t: number,
  get: (index: number) => Promise<number>,
  assign: (index: number, value: number) => Promise<void>
) {
  if (h == t) return;
  await ms(h, mid(h, t), get, assign);
  await ms(mid(h, t) + 1, t, get, assign);
  let p1 = h;
  let p2 = mid(h, t) + 1;
  const temp: number[] = [];
  while (p1 <= mid(h, t) && p2 <= t) {
    const p1v = await get(p1);
    const p2v = await get(p2);
    if (p1v <= p2v) {
      temp.push(p1v);
      p1++;
    } else {
      temp.push(p2v);
      p2++;
    }
  }
  while (p1 <= mid(h, t)) {
    temp.push(await get(p1));
    p1++;
  }
  while (p2 <= t) {
    temp.push(await get(p2));
    p2++;
  }
  for (let i = 0; i < temp.length; i++) {
    await assign(h + i, temp[i]);
  }
}
export const insertionSort: SortingMethod = new SortingMethod(
  async (
    size: number,
    get: (index: number) => Promise<number>,
    swap: (index1: number, index2: number) => Promise<void>
  ) => {
    for (let i = 0; i < size; i++) {
      let preIndex = i - 1;
      const current = await get(i);
      while (preIndex >= 0 && (await get(preIndex)) > current) {
        await swap(preIndex, preIndex + 1);
        preIndex--;
      }
    }
  }
);
export const shellSort: SortingMethod = new SortingMethod(
  async (
    size: number,
    get: (index: number) => Promise<number>,
    swap: (index1: number, index2: number) => Promise<void>
  ) => {
    let gap = 1;
    while (gap < size / 2) {
      gap = gap * 2 + 1;
    }
    for (; gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < size; i++) {
        const current = await get(i);
        for (
          let preIndex = i - gap;
          preIndex >= 0 && (await get(preIndex)) > current;
          preIndex -= gap
        ) {
          await swap(preIndex + gap, preIndex);
        }
      }
    }
  }
);
