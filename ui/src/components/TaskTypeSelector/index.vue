<template>
  <div class="task-type">
    <ButtonGroup>
      <Button
        v-for="item of taskType"
        :key="item.k"
        :type="item.type || 'default'"
        @click="onButtonClick(item)"
        >{{ item.l }}</Button
      >
    </ButtonGroup>

    <a
      v-show="tableConfigType === 'assignedToMe'"
      @click="$emit('on-task-show-type-change')"
    >
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
    tableConfigType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      taskType: [
        {
          k: 'assignedToMe',
          l: '指派给我',
          type: 'primary',
        },
        // {
        //   k: 'createdByMe',
        //   l: '由我创建'
        // },
        {
          k: 'finishedByMe',
          l: '由我完成',
        },
        {
          k: 'closedByMe',
          l: '由我关闭',
        },
        {
          k: 'canceledByMe',
          l: '由我取消',
        },
      ],
    }
  },
  computed: {
    computeShowType() {
      return (
        (this.taskShowType === 'list' && 'ios-apps-outline') ||
        'ios-list-box-outline'
      )
    },
  },
  methods: {
    onButtonClick(item) {
      this.taskType = this.taskType.map((val) => {
        if (val.k === item.k) {
          val.type = 'primary'
        } else {
          val.type = 'default'
        }

        return val
      })

      this.$emit('on-button-click', item.k)
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
