<template>
  <div
    type="text"
    :class="['sider-trigger-a', collapsed ? 'collapsed' : '']"
    @click="$emit('on-collapesed-click', !collapsed)"
  >
    <Icon :type="icon" :size="size" />
  </div>
</template>
<script>
export default {
  name: 'SiderTrigger',
  props: {
    collapsed: Boolean,
    icon: {
      type: String,
      default: 'navicon-round',
    },
    size: {
      type: Number,
      default: 18,
    },
  },
}
</script>
<style lang="less">
@import './index.less';
</style>
