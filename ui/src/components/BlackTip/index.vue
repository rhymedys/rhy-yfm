<template>
  <div v-show="computeVisiable" class="tip" :style="computeStyle">
    <div>
      <div class="tip__arrow"></div>
      <div class="tip__content">{{ title }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BlackTip',
  data() {
    return {
      top: undefined,
      left: undefined,
      visible: false,
      title: '',
    }
  },
  computed: {
    computeVisiable() {
      const { top, left, visible } = this
      return visible && top && left
    },
    computeStyle() {
      let res
      const { top, left } = this
      if (top && left) {
        res = {
          top: `${top}px`,
          left: `${left}px`,
        }
      }

      return res
    },
  },
}
</script>

<style lang="less" scoped>
.tip {
  position: absolute;
  z-index: 4;

  &__arrow {
    left: -4px;
    border-width: 5px 5px 5px 0;
    border-right-color: rgba(70, 76, 91, 0.9);
    top: 50%;
    margin-top: -5px;
    position: absolute;
    width: 0;
    height: 0;
    border-bottom-color: transparent;
    border-top-color: transparent;
    border-style: solid;
  }
  &__content {
    max-width: 250px;
    min-height: 30px;
    padding: 8px 12px;
    color: #fff;
    text-align: left;
    text-decoration: none;
    background-color: rgba(70, 76, 91, 0.9);
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    word-break: break-all;
  }
}
</style>
