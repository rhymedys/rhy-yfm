<template>
  <div>
    <h2 class="edit__title">返回数据设置</h2>
    <div class="edit__res-set">
      <button-group class="tabs">
        <i-button
          v-for="item of $options.btnClassical"
          :key="item"
          :type="selectedBtnClassical === item ? 'primary' : 'default'"
          @click="onBtnClassicalClick(item)"
          >{{ item }}</i-button
        >
      </button-group>
      <json-body
        v-show="selectedBtnClassical === 'JSON'"
        ref="jsonBody"
        :info="info"
        @on-remove-json-param-click="
          (item, i) => $emit('on-remove-json-param-click', item, i)
        "
        @on-add-json-param-click="$emit('on-add-json-param-click')"
      />
      <i-input
        v-show="selectedBtnClassical === 'RAW'"
        ref="rawBody"
        v-model="rawValue"
        type="textarea"
        :rows="4"
        placeholder="Enter something..."
      />
    </div>
  </div>
</template>

<script>
import JsonBody from './JsonBody'
export default {
  name: 'ResConfig',
  btnClassical: ['JSON', 'RAW'],
  // body 类型
  components: {
    JsonBody,
  },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      selectedBtnClassical: this.$options.btnClassical[0],
      rawValue: undefined,
    }
  },
  watch: {
    selectedBtnClassical(newVal) {},
  },
  created() {
    this.rawValue = this.info.resBody
  },
  methods: {
    onBtnClassicalClick(item) {
      this.selectedBtnClassical = item
    },
    // 获取所有表单数据
    getWholeFormValue() {
      const { selectedBtnClassical } = this

      const resBodyIsJsonSchema = true
      let resBodyType = this.selectedBtnClassical
      let resBody

      if (resBodyType === 'JSON') {
        const jsonBodyEl = this.$refs.jsonBody
        const value = jsonBodyEl.reqJson
        resBody = jsonBodyEl.$options.normalizeCommitContent(value, true)
        resBody = JSON.stringify(resBody)
      } else if (selectedBtnClassical === 'raw') {
        resBody = this.rawValue
      }

      resBodyType = resBodyType.toLowerCase()

      return {
        resBodyIsJsonSchema,
        resBodyType,
        resBody,
      }
    },
  },
}
</script>
