<template>
  <div class="container">
    <div class="canvas">
      <data-bar
        v-for="(bar, i) in bars"
        :key="i"
        :index="bar.index"
        :value="bar.value"
        :width="100 / bars.length"
        :visitTime="bar.visitTime"
        :delay="delay"
        :animation="animation"
      ></data-bar>
    </div>
    <h1>{{ sortName }}</h1>
    <p>{{ description }}</p>

    <el-descriptions class="information" title="性能信息" :column="2">
      <el-descriptions-item label="数组访问次数:">{{
        totalVisitTime
      }}</el-descriptions-item>
      <el-descriptions-item label="数组写入次数:">{{
        totalSwapTime
      }}</el-descriptions-item>
      <el-descriptions-item label="Tags:"
        ><el-tag v-for="tag in dataTags" :key="tag">{{
          tag
        }}</el-tag></el-descriptions-item
      >
    </el-descriptions>
    <el-collapse class="information" v-if="!isSorting" v-model="expanded">
      <el-collapse-item title="设置">
        <el-form v-model="settings" label-width="100px">
          <el-form-item label="自定义数组">
            <el-switch v-model="settings.customArray"></el-switch>
          </el-form-item>
          <el-form-item label="数组" v-if="settings.customArray">
            <el-input
              v-model="settings.array"
              placeholder="数据由半角逗号隔开"
            ></el-input>
          </el-form-item>
          <el-form-item label="数组大小" v-if="!settings.customArray">
            <el-input v-model="settings.size" type="number"></el-input>
          </el-form-item>
          <el-form-item label="动画">
            <el-switch v-model="settings.animation"></el-switch>
          </el-form-item>
          <el-form-item label="延时">
            <el-input v-model="settings.delay" type="number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-col :span="24" class="buttonGroup" v-if="!isSorting"
      ><el-button type="primary" round @click="realSort()">排序</el-button>
      <el-button type="danger" round @click="reset()">重置</el-button>
    </el-col>
    <el-col :span="24" v-if="isSorting" class="buttonGroup">
      <el-button round type="danger" @click="abort()" icon="el-icon-loading"
        >取消</el-button
      >
    </el-col>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DataBar from "./DataBar.vue";
import SortingMethod from "../SortingMethods";
import { bubbleSort } from "../SortingMethods";
export default defineComponent({
  name: "DemoContainer",
  components: {
    DataBar,
  },
  data: () => ({
    nowPos: [0],
    bars: [{ value: 14, index: 0, visitTime: 0 }],
    delay: 0,
    animation: true,
    size: 0,
    totalVisitTime: 0,
    totalSwapTime: 0,
    isSorting: false,
    expanded: [],
    settings: {
      customArray: false,
      array: "",
      animation: true,
      size: 0,
      delay: 0,
    },
    sortMethod: bubbleSort.sort,
    dataTags: [""],
  }),
  created() {
    this.delay = this.originalDelay;
    this.animation = this.originalAnimation;
    this.size = this.originalSize;
    this.settings.delay = this.originalDelay;
    this.settings.animation = this.originalAnimation;
    this.settings.size = this.originalSize;
    this.reset();
    this.dataTags = this.tags as string[];
    this.sortMethod = this.sortObject.sort;
  },
  props: {
    sortName: {
      type: String,
      default: "冒泡排序",
    },
    sortObject: {
      type: SortingMethod,
      default: bubbleSort,
    },
    description: {
      type: String,
      default:
        '冒泡排序（Bubble Sort）也是一种简单直观的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢"浮"到数列的顶端。',
    },
    tags: {
      type: Array,
      default: () => ["简单排序", "交换排序"],
    },
    originalDelay: {
      type: Number,
      default: 500,
    },
    originalSize: {
      type: Number,
      default: 20,
    },
    originalAnimation: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    i(a: number): number {
      return this.nowPos[a];
    },
    async swap(a: number, b: number) {
      if (!this.isSorting) {
        throw "abort";
      }
      const temp = this.bars[this.i(a)].index;
      this.bars[this.i(a)].index = this.bars[this.i(b)].index;
      this.bars[this.i(b)].index = temp;
      const t2 = this.nowPos[a];
      this.nowPos[a] = this.nowPos[b];
      this.nowPos[b] = t2;
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          resolve();
        }, this.delay)
      );
      this.totalSwapTime += 2;
    },
    async get(index: number) {
      if (!this.isSorting) {
        throw "abort";
      }
      this.bars[this.i(index)].visitTime++;
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          resolve();
        }, this.delay / 4)
      );
      this.totalVisitTime++;
      return this.bars[this.i(index)].value;
    },
    async assign(index: number, value: number) {
      if (!this.isSorting) {
        throw "abort";
      }
      this.bars[this.i(index)].value = value;
      this.bars[this.i(index)].visitTime++;
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          resolve();
        }, this.delay / 2)
      );
      this.totalSwapTime++;
    },
    async realSort() {
      this.isSorting = true;
      this.totalVisitTime = 0;
      this.totalSwapTime = 0;
      try {
        await this.sortMethod(
          this.bars.length,
          this.get,
          this.swap,
          this.assign
        );
      } finally {
        this.isSorting = false;
      }
    },
    reset() {
      this.nowPos = [];
      this.bars = [];
      this.totalVisitTime = 0;
      this.totalSwapTime = 0;
      for (let i = 0; i < this.size; i++) {
        this.nowPos.push(i);
        this.bars.push({
          value: Math.floor(Math.random() * 99) + 1,
          index: i,
          visitTime: 0,
        });
      }
    },
    abort() {
      this.isSorting = false;
    },
    submit() {
      if (this.settings.customArray) {
        this.nowPos = [];
        this.bars = [];
        const array: number[] = [];
        let max = 0;
        this.settings.array
          .split(",")
          .forEach((element: string, index: number) => {
            array.push(Number.parseFloat(element));
            if (Number.parseFloat(element) > max) {
              max = Number.parseFloat(element);
            }
            this.nowPos.push(index);
          });
        array.forEach((element: number, index: number) => {
          this.bars.push({ index, value: (element / max) * 100, visitTime: 0 });
        });
      } else {
        if (this.size !== this.settings.size) {
          this.size = this.settings.size;
          this.reset();
        }
      }
      this.animation = this.settings.animation;
      this.delay = this.settings.delay;
      this.expanded = [];
    },
  },
});
</script>
<style>
.container {
  min-height: 900px;
  width: 100%;
  padding: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  transition: box-shadow 150ms ease-out;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  margin: 20px 0;
}
.container:hover {
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
}
.container h1 {
  font-size: 1.6rem;
  align-self: flex-start;
}
.container p {
  margin: 20px 10px;
  font-weight: 300;
  color: #6c6d6f;
}
.container .canvas {
  width: 100%;
  min-height: 300px;
  background-color: #f7f7f7;
  border-radius: 5px;
  display: flex;
  align-items: flex-end;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0px 2px 6px rgba(0, 0, 0, 0.15);
}
.container > .information {
  margin: 20px 10px;
  width: calc(100% - 20px);
}
.container > .buttonGroup {
  align-self: center;
}
</style>