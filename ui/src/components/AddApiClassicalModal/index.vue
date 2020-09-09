<template>
  <modal
    ref="modalRef"
    v-model="visible"
    title="添加分类"
    :loading="loading"
    :mask-closable="false"
    @on-ok="onOkProxy"
    @on-cancel="$emit('on-cancel')"
  >
    <i-form
      ref="formRef"
      :model="formItem"
      :label-width="80"
      :rules="$options.ruleValidate"
    >
      <form-item label="分类名称" prop="classicalName">
        <i-input v-model="formItem.classicalName" placeholder="分类名称" />
      </form-item>
      <form-item label="备注">
        <i-input v-model="formItem.remark" placeholder="备注" />
      </form-item>
    </i-form>
  </modal>
</template>

<script>
import modalMixin from '@/mixins/modal'

export default {
  name: 'AddApiClassicalModal',
  mixins: [modalMixin],
  data() {
    return {
      visible: false,
      loading: false,
      formItem: {
        classicalName: '',
        remark: '',
      },
    }
  },
  ruleValidate: {
    classicalName: [
      { required: true, message: '分类名称不能为空', trigger: 'blur' },
    ],
  },
  methods: {
    onOkProxy() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$emit('on-ok', this.formItem)
        }
      })
    },
  },
}
</script>
