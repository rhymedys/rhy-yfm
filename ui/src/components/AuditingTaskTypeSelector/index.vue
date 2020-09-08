<template>
  <div class="task-type">
    <ButtonGroup>
      <Button
        v-for="item of selectedItemList"
        :key="item.account"
        :type="selectedItemAccount === item.account ? 'primary' : 'default'"
        @click="$emit('on-button-click', item.account)"
        >{{ item.realname }}</Button
      >
    </ButtonGroup>

    <a @click="$emit('on-task-show-type-change')">
      <Icon size="30" :type="computeShowType" />
      切换视图
    </a>
  </div>
</template>

<script>
export default {
  props: {
    taskShowType: {
      type: String,
      default: 'list',
    },
    selectedItemList: {
      type: Array,
      default: () => [],
    },
    selectedItemAccount: {
      type: String,
      default: '',
    },
  },
  computed: {
    computeShowType() {
      return (
        (this.taskShowType === 'list' && 'ios-apps-outline') ||
        'ios-list-box-outline'
      )
    },
  },
}
</script>

<style lang="less" scoped>
.task-type {
  padding: 14px 16px;

  a {
    float: right;
    font-size: 14px;
  }
}
</style>
