<template>
  <div>
    <h2 class="edit__title">基本设置</h2>
    <div class="edit__base-info">
      <i-form :model="info" :label-width="80">
        <form-item label="接口名称">
          <i-input v-model="info.name" placeholder="请输入接口名称" />
        </form-item>
        <row>
          <i-col span="6">
            <common-form-select
              v-model="info.method"
              label="接口路径"
              :list="$options.httpMethod"
            />
          </i-col>
          <i-col span="5">
            <div>basePath</div>
          </i-col>
          <i-col span="11">
            <form-item :label-width="0">
              <i-input v-model="info.path" placeholder="" />
            </form-item>
          </i-col>
        </row>

        <common-form-select
          v-model="info.interfaceCategoryId"
          label="分类"
          :list="computeClassical"
        />
        <common-form-select
          v-model="info.status"
          label="请选择状态"
          :list="$options.status"
        />
      </i-form>
    </div>
  </div>
</template>

<script>
import CommonFormSelect from '~/components/common/CommonFormSelect'
import variable from '~/contants/variable'

const httpMethod = Object.keys(variable.httpMethod).map((val) => {
  return {
    value: val,
    label: val,
  }
})

export default {
  name: 'BaseSet',
  components: {
    CommonFormSelect,
  },
  httpMethod,
  props: {
    info: {
      type: Object,
      default: () => {},
    },
    classical: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    computeClassical() {
      return this.classical.map((val) => {
        return {
          label: val.name,
          value: val.id,
        }
      })
    },
  },
  status: [
    {
      value: 'done',
      label: '已完成',
    },
    {
      value: 'undone',
      label: '未完成',
    },
  ],
}
</script>
