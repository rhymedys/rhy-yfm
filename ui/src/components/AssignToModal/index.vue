<template>
  <modal
    v-model="visible"
    title="编辑任务"
    @on-ok="onOkProxy"
    @on-cancel="$emit('on-cancel')"
  >
    <div>
      <div>任务总时间</div>
      <div>{{ computeTask.estimate || '未知' }}</div>
    </div>
    <div>
      <div>剩余</div>
      <div>{{ computeTask.left || '未知' }}</div>
    </div>
    <div>
      <div>截至时间</div>
      <div>{{ computeDeadline }}</div>
    </div>
  </modal>
</template>

<script>
import moment from 'moment'
export default {
  name: 'EditTaskModal',
  data() {
    return {
      visible: false,
      task: {},
    }
  },
  computed: {
    computeTask() {
      return this.task || {}
    },
    computeDeadline() {
      if (this.computeTask.deadline) {
        return moment(this.computeTask.deadline).format('YYYY-MM-DD HH:mm:ss')
      }

      return '未知'
    },
  },
  methods: {
    onOkProxy() {
      this.$emit('on-ok')
    },
  },
}
</script>
