<template>
  <Card
    v-show="computeVisiable"
    class="grantt-story-or-task-priviewer"
    :style="computeStyle"
    shadow
    @mousemove.native="(e) => $emit('mousemove', e)"
    @mouseout.native="(e) => $emit('mouseout', e)"
  >
    <p slot="title">{{ computeContent.title }}详情</p>
    <template v-if="computeContent.dataMap.length">
      <div v-for="item of computeContent.dataMap" :key="item.k" class="detail">
        <div class="detail__lable">{{ item.l }}：</div>
        <div class="detail__value">{{ data[item.k] || '未知' }}</div>
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  name: 'QuickProgressPreviewer',
  data() {
    return {
      top: undefined,
      left: undefined,
      visible: false,
      data: {},
      title: '需求',
    }
  },
  computed: {
    computeContent() {
      const { storyId, projectGanttStoryTaskInfos } = this.data
      let dataMap = []
      let title = ''
      if (storyId && projectGanttStoryTaskInfos) {
        dataMap = [
          {
            k: 'storyId',
            l: '编号',
          },
          {
            k: 'title',
            l: '需求',
          },
          {
            k: 'startDate',
            l: '开始',
          },
          {
            k: 'endDate',
            l: '结束',
          },
        ]

        title = '需求'
      } else {
        dataMap = [
          {
            k: 'taskId',
            l: '编号',
          },
          {
            k: 'name',
            l: '任务',
          },
          {
            k: 'startDate',
            l: '开始',
          },
          {
            k: 'endDate',
            l: '结束',
          },
        ]
        title = '任务'
      }

      return {
        dataMap,
        title,
      }
    },

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
  methods: {},
}
</script>

<style lang="less">
.grantt-story-or-task-priviewer {
  width: 300px;
  height: 300px;
  position: fixed;
  z-index: 4;
  box-shadow: 2px 2px 4px 2px rgba(0, 21, 41, 0.08);

  .ivu-card-body {
    height: calc(100% - 51px);
    overflow: scroll;

    .detail {
      display: flex;
      flex-direction: row;

      &__lable {
        font-weight: bold;
        min-width: 50px;
        text-align: right;
      }
    }
  }
}
</style>
