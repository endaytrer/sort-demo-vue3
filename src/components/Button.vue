<template>
  <button class="button"><slot></slot><button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: "Button"
})
</script>

<style scoped>
.button {

}
</style>