<template>
  <Card
    v-show="computeVisiable"
    class="quick-compbine-task-previewer"
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
        style="margin-bottom: 10px"
      >
        <tag :color="mapTaskStatusConfig(peopleTask).color">
          {{ mapTaskStatusConfig(peopleTask).key }}
        </tag>
        <span> {{ peopleTask.realname }}_{{ peopleTask.taskId }}</span>
      </div>
    </template>
    <span v-if="!storyBoardTaskInfoList || !storyBoardTaskInfoList.length"
      >暂无数据
    </span>
  </Card>
</template>

<script>
import taskStatus from '@/contants/taskStatus.js'

export default {
  name: 'QuickComineTaskPreviewer',
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
    // 映射任务状态
    mapTaskStatusConfig(row) {
      return taskStatus.mapObjectByValueFn(row.status)
    },
  },
}
</script>

<style lang="less">
.quick-compbine-task-previewer {
  width: 300px;
  height: 500px;
  position: fixed;
  z-index: 10;
  box-shadow: 2px 2px 4px 2px rgba(0, 21, 41, 0.08);

  .ivu-card-body {
    height: calc(100% - 51px);
    overflow: scroll;
  }
}
</style>
