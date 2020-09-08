<template>
  <form-item :label="label" :required="required">
    <i-select
      :placeholder="`请选择${label}`"
      :value="value"
      @on-change="(e) => $emit('on-change', e)"
    >
      <i-option v-for="item of list" :key="item.value" :value="item.value">
        {{ item.label }}
      </i-option>
    </i-select>
  </form-item>
</template>

<script>
export default {
  name: 'CommonFormSelect',
  model: {
    prop: 'value',
    event: 'on-change',
  },
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => [],
    },
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: undefined,
    },
  },
}
</script>
