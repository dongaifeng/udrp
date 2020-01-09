<template>
  <div class="box" :style="`background: ${$store.getters.theme}`">
    <div class="text">{{ context }}</div>
  </div>
</template>

<script>
export default {
  name: 'CompHeader',
  props: {
    context: {
      default: '',
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .box{
    font-size: 14px;
    padding: 5px 5px;
    // background: blue;
    color: #fff;
  }
</style>
