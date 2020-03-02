<template>
  <div class="box" :style="`background: ${$store.getters.theme}`">
    <!-- header左边 -->
    <div class="left-solt">
      <span>{{ context }}</span>
      <slot />
      <slot name="left" />
    </div>

    <!-- header右边 -->
    <div class="right-solt">
      <slot name="right" />
    </div>
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
    padding: 0px 5px;
    color: #fff;
    margin-bottom: 10px;
    height: 35px;
    line-height: 35px;
    .left-solt{
      float: left;
    }
    .right-solt{
      float: right;
    }
  }
</style>
