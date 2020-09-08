<template>
  <modal
    ref="modalRef"
    v-model="visible"
    title="新建接口"
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
      <form-item label="接口名称" prop="name">
        <i-input v-model="formItem.name" placeholder="接口名称" />
      </form-item>
      <i-option label="请求方法" prop="method">
        <i-select v-model="formItem.method">
          <i-option v-for="method of $options.httpMethod" :key="method">
            {{ method }}
          </i-option>
        </i-select>
      </i-option>
      <form-item label="接口路径" prop="path">
        <i-input v-model="formItem.path" placeholder="接口路径" />
      </form-item>
    </i-form>
  </modal>
</template>

<script>
import modalMixin from '~/mixins/modal'
import variable from '~/contants/variable'

export default {
  name: 'AddApiModal',
  mixins: [modalMixin],
  httpMethod: Object.keys(variable.httpMethod),
  data() {
    return {
      visible: false,
      loading: false,
      formItem: {
        name: '',
        path: '',
        method: this.$options.httpMethod[0],
      },
    }
  },
  ruleValidate: {
    name: [{ required: true, message: '接口名称不能为空', trigger: 'blur' }],
    method: [{ required: true, message: '请求方法不能为空', trigger: 'blur' }],
    path: [{ required: true, message: '接口路径不能为空', trigger: 'blur' }],
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
