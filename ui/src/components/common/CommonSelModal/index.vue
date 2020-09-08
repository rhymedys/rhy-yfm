<template>
  <modal
    ref="modalRef"
    v-model="visible"
    :title="title"
    class="tast-evaluateitem-modal"
    :width="730"
    :loading="loading"
    :mask-closable="false"
    @on-cancel="$emit('on-cancel')"
    @on-ok="$emit('on-ok', selVal)"
  >
    <Select v-model="selVal">
      <Option v-for="item in list" :key="item.value" :value="item.value">
        {{ item.label }}
      </Option>
    </Select>
  </modal>
</template>

<script>
import modalMixin from '~/mixins/modal'
export default {
  name: 'Index',
  mixins: [modalMixin],
  data() {
    return {
      visible: false,
      loading: false,
      title: '选择计划',
      list: [],
      selVal: '',
    }
  },
  // mounted() {
  //   // 看源码,代理其方法
  //   // eslint-disable-next-line no-new-func
  //   const orginOk = this.$refs.modalRef.ok
  //   const refFn = function() {
  //     orginOk()
  //     // 此this非彼this
  //     if (!this.loading) {
  //       this.visible = true
  //       this.$emit('input', true)
  //     }
  //   }

  //   this.$refs.modalRef.ok = refFn.bind(this.$refs.modalRef)
  // },
  // methods: {}
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
