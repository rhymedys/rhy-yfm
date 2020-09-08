<template>
  <div class="page-header" :class="collapsed ? 'page-header_collapsed' : ''">
    <sider-trigger
      v-show="!hideSliderTrigger"
      icon="ios-menu"
      :collapsed="collapsed"
      @on-collapesed-click="$emit('on-collapesed-click')"
    />
    <bread-crumd show-icon :list="breadCrumbList" />
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BreadCrumd from './BreadCrumd'
import SiderTrigger from './SiderTrigger'
export default {
  name: 'PageHeader',
  components: {
    BreadCrumd,
    SiderTrigger,
  },
  props: {
    collapsed: Boolean,
    hideSliderTrigger: Boolean,
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList
    },
  },
}
</script>

<style lang="less" scoped>
.page-header {
  position: relative;
  background: #fff;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 11;
  line-height: normal;
  height: 64px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: all 0.2s ease-in-out;
  width: ~'calc(100% - 256px)';

  &_collapsed {
    width: ~'calc(100% - 64px)';
  }

  .custom-content-con {
    float: right;
    height: auto;
    padding-right: 20px;
    line-height: 64px;
    & > * {
      float: right;
    }
  }
}
</style>
