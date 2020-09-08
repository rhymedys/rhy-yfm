<template>
  <div>
    <i-button
      class="import-form-btn"
      type="primary"
      @click="$emit('on-add-query-param-click')"
    >
      添加query参数
    </i-button>
    <row
      v-for="(item, i) of info.reqQuery"
      :key="item.id || item.name || item.localId"
      :gutter="2"
      type="flex"
      class="querybody"
      justify="start"
    >
      <i-col span="4">
        <i-input v-model="item.name" placeholder="name" />
      </i-col>
      <i-col span="4">
        <i-select v-model="item.required" class="querybody__require">
          <i-option
            v-for="required of $options.formBodyRequired"
            :key="required.value"
            :value="required.value"
          >
            {{ required.key }}
          </i-option>
        </i-select>
      </i-col>
      <i-col span="4">
        <i-input
          v-model="item.example"
          type="textarea"
          :autosize="{ minRows: 1 }"
          placeholder="参数实例"
        />
      </i-col>
      <i-col span="4">
        <i-input
          v-model="item.desc"
          type="textarea"
          :autosize="{ minRows: 1 }"
          placeholder="备注"
        />
      </i-col>
      <i-col span="4" class="querybody__remove">
        <icon
          type="md-close-circle"
          color="red"
          size="20"
          @click.native="$emit('on-remove-query-param-click', item, i)"
        />
      </i-col>
    </row>
  </div>
</template>

<script>
import paramsRequired from '~/contants/paramsRequired.js'
export default {
  name: 'QueryBody',
  // 表单参数是否必须
  formBodyRequired: paramsRequired.value,
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
