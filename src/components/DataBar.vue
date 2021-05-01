<template>
  <el-tooltip :content="value.toFixed(2)" effect="light"
    ><div
      @isReading="highlight"
      class="data-bar"
      :class="{ highlighted: isHighlighting }"
      :style="{
        width: `${width}%`,
        height: `${value}%`,
        transform: `translateX(calc(${index * 100}% - 2px))`,
        transition: (() => {
          if (delay && animation)
            return `transform ${delay}ms ease-in-out, filter ${
              delay / 2
            }ms ease-out, height ${delay / 2}ms ease-in-out`;
          else return undefined;
        })(),
      }"
    ></div
  ></el-tooltip>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "DataBar",
  props: {
    index: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    visitTime: {
      type: Number,
      default: 0,
    },
    delay: {
      type: Number,
      default: 200,
    },
    animation: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isHighlighting: false,
  }),
  methods: {
    highlight() {
      console.log(this.index);
    },
  },
  watch: {
    async visitTime() {
      await new Promise<void>((resolve) => {
        this.isHighlighting = true;
        setTimeout(() => {
          this.isHighlighting = false;
          resolve();
        }, 200);
      });
    },
  },
});
</script>
<style scoped>
.data-bar {
  background-image: linear-gradient(
    0deg,
    #d7e4ec 0px,
    #7fc2ec calc(20% + 120px)
  );
  margin: 2px;
  border-radius: 5px;
  position: absolute;
}
.highlighted {
  filter: brightness(1.2);
}
</style>