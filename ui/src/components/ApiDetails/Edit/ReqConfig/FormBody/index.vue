<template>
  <div>
    <i-button
      class="import-form-btn"
      type="primary"
      @click="$emit('on-add-form-param-click')"
    >
      添加form参数
    </i-button>
    <row
      v-for="(item, i) of info.reqBodyForm"
      :key="item._id || item.name || item.localId"
      :gutter="2"
      type="flex"
      class="formbody"
      justify="start"
    >
      <i-col span="4">
        <i-input v-model="item.name" placeholder="name" />
      </i-col>
      <i-col span="4">
        <i-select v-model="item.type" class="formbody__type">
          <i-option
            v-for="type of $options.formBodyType"
            :key="type"
            :value="type"
          >
            {{ type }}
          </i-option>
        </i-select>
      </i-col>
      <i-col span="4">
        <i-select v-model="item.required" class="formbody__require">
          <i-option
            v-for="required of $options.formBodyRequired"
            :key="required.v"
            :value="required.v"
          >
            {{ required.l }}
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
      <i-col span="4" class="formbody__remove">
        <icon
          type="md-close-circle"
          color="red"
          size="20"
          @click.native="$emit('on-remove-form-param-click', item, i)"
        />
      </i-col>
    </row>
  </div>
</template>

<script>
export default {
  name: 'FormBody',
  // 表单类型  文本| 文件
  formBodyType: ['text', 'file'],
  // 表单参数是否必须
  formBodyRequired: [
    {
      v: '1',
      l: '必须',
    },
    {
      v: '0',
      l: '非必须',
    },
  ],
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
