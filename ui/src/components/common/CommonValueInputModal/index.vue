<template>
  <Modal
    ref="modalRef"
    v-model="visible"
    :title="title"
    class="common-value-input-modal"
    :width="730"
    :loading="loading"
    :mask-closable="false"
    @on-ok="onOkProxy"
    @on-cancel="$emit('on-cancel')"
  >
    <div class="plan-decollate">
      <div class="plan-decollate__title">预计开始时间</div>
    </div>
  </Modal>
</template>

<script>
import moment from 'moment'
export default {
  name: 'CommonValueInputModal',
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
    onDatePickerChange(value, type) {
      this.datePickerVal = value
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
.common-value-input-modal {
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
.common-value-input-modal {
  .ivu-modal-body {
    max-height: 505px;
    overflow-y: auto;
  }
}
</style>
