<template>
  <el-row :gutter="40" class="grand-container">
    <el-col :span="22" :lg="20" :xl="18">
      <h1 class="main-title">排序算法演示</h1>
      <h3 class="secondary-title">计试001 顾真榕</h3>
      <h3 class="secondary-title">
        Github:
        <el-link href="https://github.com/endaytrer/"> @endaytrer </el-link>
      </h3>
    </el-col>
    <el-col :span="22" :lg="10" :xl="9"
      ><demo-container
        :sort="bubbleSort"
        :tags="['交换排序', '简单排序', '稳定', 'O(n^2)']"
      />
    </el-col>
    <el-col :span="22" :lg="10" :xl="9"
      ><demo-container
        :sortObject="insertionSort"
        :originalSize="20"
        :originalAnimation="true"
        :originalDelay="500"
        sortName="插入排序"
        description="插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴，但它的原理应该是最容易理解的了，因为只要打过扑克牌的人都应该能够秒懂。插入排序是一种最简单直观的排序算法，它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。"
        :tags="['插入排序', '简单排序', '稳定', 'O(n^2)']"
      />
    </el-col>
    <el-col :span="22" :lg="10" :xl="9"
      ><demo-container
        :sortObject="shellSort"
        :originalSize="50"
        :originalAnimation="true"
        :originalDelay="100"
        sortName="希尔排序"
        description="希尔排序，也称递减增量排序算法，是插入排序的一种更高效的改进版本。但希尔排序是非稳定排序算法。希尔排序的基本思想是：先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，待整个序列中的记录基本有序时，再对全体记录进行依次直接插入排序。"
        :tags="['插入排序', '高级排序', '不稳定', 'O(nlogn)']"
      />
    </el-col>
    <el-col :span="22" :lg="10" :xl="9"
      ><demo-container
        :sortObject="heapSort"
        :originalSize="50"
        :originalAnimation="true"
        :originalDelay="100"
        sortName="堆排序"
        description="堆排序（英语：Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆是一个近似完全二叉树的结构，并同时满足堆的性质：即子节点的键值或索引总是小于（或者大于）它的父节点。"
        :tags="['选择排序', '高级排序', '不稳定', 'O(nlogn)']"
      />
    </el-col>
    <el-col :span="22" :lg="10" :xl="9"
      ><demo-container
        :sortObject="quickSort"
        :originalSize="100"
        :originalAnimation="true"
        :originalDelay="160"
        sortName="快速排序"
        description="快速排序是由东尼·霍尔所发展的一种排序算法。在平均状况下，排序 n 个项目要 Ο(nlogn) 次比较。在最坏状况下则需要 Ο(n2) 次比较，但这种状况并不常见。事实上，快速排序通常明显比其他 Ο(nlogn) 算法更快，因为它的内部循环（inner loop）可以在大部分的架构上很有效率地被实现出来。"
        :tags="['交换排序', '高级排序', '不稳定', 'O(nlogn)']"
      />
    </el-col>
    <el-col :span="22" :lg="10" :xl="9"
      ><demo-container
        :sortObject="mergeSort"
        :originalSize="100"
        :originalAnimation="true"
        :originalDelay="160"
        sortName="归并排序"
        description="归并排序（Merge sort）是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。"
        :tags="['归并排序', '高级排序', '稳定', 'O(nlogn)']"
      />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DemoContainer from "./components/DemoContainer.vue";
import {
  bubbleSort,
  heapSort,
  quickSort,
  mergeSort,
  insertionSort,
  shellSort,
} from "./SortingMethods";

export default defineComponent({
  name: "App",
  components: {
    DemoContainer,
  },
  data() {
    return {
      heapSort,
      bubbleSort,
      quickSort,
      mergeSort,
      insertionSort,
      shellSort,
    };
  },
});
</script>

<style>
#app * {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.grand-container {
  justify-content: center;
}
.main-title {
  padding: 30px 0px 2px;
  font-weight: 600;
}
.secondary-title {
  color: #a3a3a3;
  font-weight: 300;
  font-size: 1rem;
  border-left: 4px solid #a3a3a3;
  margin: 0;
  padding: 2px 10px;
}
</style>
