<template>
  <Modal
    ref="modalRef"
    v-model="visible"
    :title="title"
    class="schdule-value-input-modal"
    :width="730"
    :loading="loading"
    :mask-closable="false"
    @on-ok="onOkProxy"
    @on-cancel="$emit('on-cancel')"
  >
    <div class="plan-decollate">
      <div class="plan-decollate__title">预计开始时间</div>
      <div>
        <DatePicker
          type="datetime"
          style="width: 200px"
          placeholder="选择日期"
          :options="dataPickerOptions"
          :value="datePickerVal"
          :open="datePickerOpen"
          @on-change="onDatePickerChange"
          @on-open-change="onDatePickerOpenChange"
        />
      </div>
    </div>
    <div class="plan-header">
      <h3>内容</h3>
      <h3>时间(小时)</h3>
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
          />
          <InputNumber v-model="item.hour" :min="0.1" />
          <Icon
            v-if="i"
            size="28"
            type="ios-remove-circle"
            color="#ed4014"
            @click.native="onRemoveClick(i)"
          />
        </div>
        <Button
          class="plan-decollate__add"
          type="dashed"
          size="small"
          @click="onAddClick"
        >
          添加
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script>
import moment from 'moment'
export default {
  name: 'SchduleValueInputModal',
  data() {
    return {
      visible: false,
      loading: false,
      title: '',
      content: [
        {
          hour: 1,
        },
      ],
      dataPickerOptions: Object.freeze({
        disabledDate: (currentDate) => {
          return moment(currentDate).isBefore(moment().startOf('days'))
        },
      }),
      datePickerVal: undefined,
      datePickerOpen: false,
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
    onAddClick() {
      this.content.push({
        hour: 1,
      })
    },
    onRemoveClick(i) {
      this.content.splice(i, 1)
    },
    onDatePickerChange(value, type) {
      this.datePickerVal = value
    },
    onDatePickerOpenChange(value) {
      this.datePickerOpen = value
      if (!this.datePickerOpen) {
        if (
          this.datePickerVal &&
          moment(this.datePickerVal).isBefore(moment())
        ) {
          this.$Message.error('请选择正确的预计开始时间')
          this.datePickerVal = undefined
        }
      }
    },
    onOkProxy() {
      const { datePickerVal, content } = this
      if (!datePickerVal) {
        this.$Message.error('请选择正确的预计开始时间')
        return
      }

      for (const item of content) {
        if (!item.content || !item.hour) {
          this.$Message.error('请计划详情分割内容/时间不能为空')
          return
        }
      }

      this.$emit('on-ok', {
        datePickerVal,
        content,
      })
    },
  },
}
</script>
<style lang="less" scoped>
.schdule-value-input-modal {
  .plan-header,
  .plan-decollate {
    display: flex;
    flex-direction: row;
  }

  .plan-decollate {
    &__title {
      vertical-align: middle;
      line-height: 32px;
      margin-right: 10px;
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
.schdule-value-input-modal {
  .ivu-modal-body {
    max-height: 505px;
    overflow-y: auto;
  }
}
</style>
