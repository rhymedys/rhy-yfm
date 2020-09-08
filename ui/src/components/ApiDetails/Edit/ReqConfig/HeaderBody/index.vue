<template>
  <div>
    <i-button
      class="import-form-btn"
      type="primary"
      @click="$emit('on-add-header-param-click')"
    >
      添加Header
    </i-button>
    <row
      v-for="(item, i) of info.reqHeaders"
      :key="item._id || item.name || item.localId"
      :gutter="2"
      type="flex"
      class="headerbody"
      justify="start"
    >
      <i-col span="4">
        <auto-complete
          v-model="item.name"
          :data="$options.httpReqHeaders"
          placeholder="参数名称"
          :filter-method="filterNameMethod"
        />
      </i-col>
      <i-col span="4">
        <i-input
          v-model="item.value"
          type="textarea"
          :autosize="{ minRows: 1, maxRow: 1 }"
          placeholder="参数值"
        />
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
      <i-col span="4" class="headerbody__remove">
        <icon
          type="md-close-circle"
          color="red"
          size="20"
          @click.native="$emit('on-remove-header-param-click', item, i)"
        />
      </i-col>
    </row>
  </div>
</template>

<script>
import variable from '~/contants/variable'
export default {
  name: 'HeaderBody',
  httpReqHeaders: variable.HTTP_REQUEST_HEADER,
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    filterNameMethod(val, option) {
      return (
        option.toLocaleLowerCase().includes(val.toLocaleLowerCase()) || !val
      )
    },
  },
}
</script>
