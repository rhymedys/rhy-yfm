<template>
  <Modal
    ref="modalRef"
    v-model="visible"
    :title="title"
    class="tast-evaluateitem-modal"
    :width="730"
    :loading="loading"
    :mask-closable="false"
    @on-cancel="$emit('on-cancel')"
  >
    <div class="plan-decollate">
      <div class="plan-decollate__title">开始时间</div>
      <div>
        <DatePicker
          type="datetime"
          style="width: 200px"
          placeholder="选择日期"
          :options="dataPickerOptions"
          :value="startDatePickerVal"
          :open="startDatePickerOpen"
          @on-change="onStartDatePickerChange"
          @on-open-change="onStartDatePickerOpenChange"
        />
      </div>
    </div>
    <div class="plan-decollate">
      <div class="plan-decollate__title">结束时间</div>
      <div>
        <DatePicker
          type="datetime"
          style="width: 200px"
          placeholder="选择日期"
          :options="dataPickerOptions"
          :value="endDatePickerVal"
          :open="endDatePickerOpen"
          @on-change="onEndDatePickerChange"
          @on-open-change="onEndDatePickerOpenChange"
        />
      </div>
    </div>
    <div class="plan-header">
      <h3>内容</h3>
      <h3>时间(分钟)</h3>
    </div>
    <div class="plan-decollate">
      <div class="plan-decollate__title">计划详情分割</div>
      <div class="plan-decollate__list">
        <div
          v-for="(item, i) of content"
          :key="i"
          :style="mapInputContentStyle(i)"
          class="plan-decollate__item"
        >
          <Input
            v-model="item.content"
            placeholder="请输入内容"
            class="item__content"
            readonly
          />
          <InputNumber v-model="item.time" :min="0.1" readonly />
        </div>
      </div>
    </div>
    <div class="plan-decollate">
      <div class="plan-decollate__title" style="width: 72px; text-align: right">
        备注信息
      </div>
      <div class="plan-decollate__list" style="width: 60%">
        <Input
          v-model="commentContent"
          class="remark"
          type="textarea"
          :rows="4"
          placeholder="备注信息"
        />
      </div>
    </div>
    <div slot="footer">
      <Button type="error" @click="onOkProxy(0)">不通过</Button>
      <Button type="primary" @click="onOkProxy(1)">通过</Button>
    </div>
  </Modal>
</template>

<script>
import moment from 'moment'
import { showSecondConfirm } from '~/utils'

export default {
  name: 'TaskEvaluateItemModal',
  data() {
    return {
      visible: false,
      loading: false,
      commentContent: undefined,
      title: '任务评估详情',
      content: [],
      dataPickerOptions: Object.freeze({
        disabledDate: (currentDate) => {
          return moment(currentDate).isBefore(moment().startOf('days'))
        },
      }),
      defDatePickerVal: undefined,
      startDatePickerVal: undefined,
      endDatePickerVal: undefined,
      startDatePickerOpen: false,
      endDatePickerOpen: false,
    }
  },
  mounted() {
    // 看源码,代理其方法
    // eslint-disable-next-line no-new-func
    const orginOk = this.$refs.modalRef.ok
    const refFn = function () {
      orginOk()
      // 此this非彼this
      if (!this.loading) {
        this.visible = true
        this.$emit('input', true)
      }
    }

    this.$refs.modalRef.ok = refFn.bind(this.$refs.modalRef)
  },
  methods: {
    mapInputContentStyle(i) {
      return {
        'margin-top': (i && '10px') || '',
      }
    },
    onStartDatePickerChange(value, type) {
      this.startDatePickerVal = value
    },
    onEndDatePickerChange(value, type) {
      this.endDatePickerVal = value
    },
    onStartDatePickerOpenChange(value) {
      this.startDatePickerOpen = value
      if (!this.startDatePickerOpen) {
        const notChange =
          this.defDatePickerVal &&
          this.defDatePickerVal === this.startDatePickerVal

        if (
          this.startDatePickerVal &&
          moment(this.startDatePickerVal).isBefore(moment()) &&
          !notChange
        ) {
          this.$Message.error('请选择正确的预计开始时间')
          this.startDatePickerVal = undefined
        }
      }
    },
    onEndDatePickerOpenChange(value) {
      this.endDatePickerOpen = value
      if (!this.endDatePickerOpen) {
        const isBeforeCurrentDate = moment(this.endDatePickerVal).isBefore(
          moment()
        )
        const isBeforeStartDate = moment(this.endDatePickerVal).isBefore(
          moment(this.startDatePickerVal)
        )
        const isNotValiid = isBeforeCurrentDate || isBeforeStartDate

        if (!this.endDatePickerVal && isNotValiid) {
          this.$Message.error('请选择正确的预计开始时间')
          this.endDatePickerVal = undefined
        }
      }
    },
    onOkProxy(status) {
      const { startDatePickerVal, commentContent, endDatePickerVal } = this

      if (!startDatePickerVal || !endDatePickerVal) {
        this.$Message.error('请选择正确的开始/结束时间')
        return
      }

      showSecondConfirm.call(this, {
        onOk: () => {
          this.$emit('on-ok', {
            commentContent,
            planStartTime: startDatePickerVal,
            planEndTime: endDatePickerVal,
            status,
          })
        },
      })
    },
  },
}
</script>
<style lang="less" scoped>
.tast-evaluateitem-modal {
  .plan-header,
  .plan-decollate {
    display: flex;
    flex-direction: row;
  }

  .plan-decollate {
    margin-top: 10px;
    .remark {
      margin-top: 10px;
    }

    &__title {
      vertical-align: middle;
      line-height: 32px;
      margin-right: 10px;
      width: 72px;
      text-align: right;
    }

    &__list {
      width: 80%;
    }
    &__item {
      // display: flex;
      // flex-direction: row;
      .item {
        &__content {
          width: 75%;
        }
      }
    }

    &__add {
      width: 90%;
      margin-top: 10px;
    }
  }

  .plan-header {
    padding-left: 82px;
    margin-top: 10px;

    > h3 {
      &:first-child {
        width: 69%;
      }
    }
  }
}
</style>
<style lang="less">
.tast-evaluateitem-modal {
  .ivu-modal-body {
    max-height: 505px;
    overflow-y: auto;
  }
}
</style>
