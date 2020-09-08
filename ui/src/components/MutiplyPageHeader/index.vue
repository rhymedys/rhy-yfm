<template>
  <div class="apimgr-header">
    <span class="apimgr-header__title">{{ serviceName }}</span>
    <div class="content"></div>
  </div>
</template>

<script>
export default {
  name: 'MutiplyPageHeader',
  props: {
    serviceName: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="less" scoped>
.apimgr-header {
  height: 56px;
  width: 100%;
  background: #32363a;
  display: flex;
  flex-direction: row;
  align-items: center;

  &__title {
    color: white;
    font-size: 16px;
    margin-left: 20px;
  }

  .content {
  }
}
</style>
