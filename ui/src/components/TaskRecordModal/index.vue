<template>
  <Modal
    ref="modalRef"
    v-model="visible"
    title="写日志"
    class="edit-task"
    :width="750"
    :loading="loading"
    @on-ok="onOkProxy"
    @on-cancel="$emit('on-cancel')"
  >
    <div class="preview">
      <div class="preview__item">
        <div class="preview__item_title">总时间</div>
        <div class="preview__item_val">
          {{ computeTask.estimate || '--' }}
        </div>
      </div>
      <div class="preview__item">
        <div class="preview__item_title">剩余</div>
        <div class="preview__item_val">
          {{ computeTask.left || '--' }}
        </div>
      </div>
      <div class="preview__item">
        <div class="preview__item_title">截至时间</div>
        <div class="preview__item_val">
          {{ computeDeadline }}
        </div>
      </div>
    </div>

    <div style="margin: 10px 5px">
      <InputNumber ref="hourRef" :min="0" :step="0.1" />
      <span>小时</span>
    </div>
    <div style="margin: 10px 5px">
      <Input ref="logRef" type="textarea" placeholder="请输入日志" :rows="4" />
    </div>
  </Modal>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TaskRecordModal',
  data() {
    return {
      visible: false,
      task: {},
      loading: false,
    }
  },
  computed: {
    computeTask() {
      return this.task || {}
    },
    computeDeadline() {
      if (this.computeTask.deadline) {
        return moment(this.computeTask.deadline).format('YYYY-MM-DD HH:mm')
      }

      return '--'
    },
  },
  mounted() {
    // 看源码,代理其方法
    // eslint-disable-next-line no-new-func
    const orginOk = this.$refs.modalRef.ok
    const refFn = function () {
      orginOk()
      if (!this.loading) {
        this.visible = true
        this.$emit('input', true)
      }
    }

    this.$refs.modalRef.ok = refFn.bind(this.$refs.modalRef)
  },
  methods: {
    onOkProxy() {
      const hour = this.$refs.hourRef.currentValue
      let log = this.$refs.logRef.$refs.textarea.value

      log = log.trim()
      if (!log || !hour) {
        this.$Message.warning('消耗时间不能为0或日志记录内容不能为空')
      } else {
        this.$emit('on-ok', {
          hour,
          log,
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.edit-task {
  .preview {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    &__item {
      text-align: center;
      flex: 1;
      background: #e6f7ff;
      border: 1px solid #e8eaec;
      border-color: #91d5ff;
      border-radius: 5px;
      margin: 0 5px;
      &_title {
        font-size: 16px;
        margin-bottom: 0;
      }

      &_val {
        font-size: 28px;
      }
    }
  }
}
</style>
