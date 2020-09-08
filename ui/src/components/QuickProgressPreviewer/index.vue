<template>
  <Card
    v-show="computeVisiable"
    class="quick-progress-previewer"
    :style="computeStyle"
    shadow
    @mousemove.native="(e) => $emit('mousemove', e)"
    @mouseout.native="(e) => $emit('mouseout', e)"
  >
    <p slot="title">工作进度</p>
    <template v-if="storyBoardTaskInfoList">
      <div
        v-for="peopleTask of storyBoardTaskInfoList"
        :key="peopleTask.taskId"
      >
        <tag :color="mapTaskStatusConfig(peopleTask).color">
          {{ mapTaskStatusConfig(peopleTask).key }}
        </tag>
        <span> {{ peopleTask.realname }}_{{ peopleTask.taskId }}</span>
        <br />

        <Progress
          style="height: 5px"
          :stroke-width="5"
          :status="'active'"
          :percent="mapPersonalProgress(peopleTask)"
        />
      </div>
    </template>
  </Card>
</template>

<script>
import taskStatus from '~/contants/taskStatus.js'

export default {
  name: 'QuickProgressPreviewer',
  data() {
    return {
      top: undefined,
      left: undefined,
      visible: false,
      storyBoardTaskInfoList: [],
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
  methods: {
    // 计算个人进度值
    mapPersonalProgress(peopleTask) {
      return Number(Number(peopleTask.completeRate * 100 || 0).toFixed(2))
    },
    // 映射任务状态
    mapTaskStatusConfig(row) {
      return taskStatus.mapObjectByValueFn(row.status)
    },
  },
}
</script>

<style lang="less">
.quick-progress-previewer {
  width: 300px;
  height: 500px;
  position: fixed;
  z-index: 2;
  box-shadow: 2px 2px 4px 2px rgba(0, 21, 41, 0.08);

  .ivu-card-body {
    height: calc(100% - 51px);
    overflow: scroll;
  }
}
</style>
