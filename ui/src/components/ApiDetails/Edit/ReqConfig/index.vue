<template>
  <div>
    <h2 class="edit__title">请求参数设置</h2>
    <div class="edit__req-set">
      <button-group class="tabs">
        <i-button
          v-for="item of $options.btnClassical"
          :key="item"
          :type="selectedBtnClassical === item ? 'primary' : 'default'"
          @click="onBtnClassicalClick(item)"
          >{{ item }}</i-button
        >
      </button-group>
      <div v-show="selectedBtnClassical === 'Body'">
        <radio-group v-model="bodyType" class="body-type">
          <radio v-for="item of $options.bodyType" :key="item" :label="item">
            <span>{{ item }}</span>
          </radio>
        </radio-group>

        <i-input
          v-show="computeShowRawOrFileTextarea"
          type="textarea"
          :value="info.reqBodyOther"
          :rows="4"
          placeholder="Enter something..."
          @on-change="(e) => $emit('on-req-body-other-change', e)"
        />

        <form-body
          v-show="bodyType === 'form'"
          ref="formBody"
          :info="info"
          @on-remove-form-param-click="
            (item, i) => $emit('on-remove-form-param-click', item, i)
          "
          @on-add-form-param-click="$emit('on-add-form-param-click')"
        />

        <json-body
          v-show="bodyType === 'json'"
          ref="jsonBody"
          :info="info"
          @on-remove-json-param-click="
            (item, i) => $emit('on-remove-json-param-click', item, i)
          "
          @on-add-json-param-click="$emit('on-add-json-param-click')"
        />
      </div>

      <query-body
        v-show="selectedBtnClassical === 'Query'"
        :info="info"
        @on-remove-query-param-click="
          (item, i) => $emit('on-remove-query-param-click', item, i)
        "
        @on-add-query-param-click="$emit('on-add-query-param-click')"
      />
      <header-body
        v-show="selectedBtnClassical === 'Headers'"
        :info="info"
        @on-remove-header-param-click="
          (item, i) => $emit('on-remove-header-param-click', item, i)
        "
        @on-add-header-param-click="$emit('on-add-header-param-click')"
      />
    </div>
  </div>
</template>

<script>
import JsonBody from './JsonBody'
import FormBody from './FormBody'
import QueryBody from './QueryBody'
import HeaderBody from './HeaderBody'
export default {
  name: 'ReqConfig',
  btnClassical: ['Body', 'Query', 'Headers'],
  // body 类型
  bodyType: ['form', 'json', 'file', 'raw'],
  components: {
    FormBody,
    QueryBody,
    HeaderBody,
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
      bodyType: this.$options.bodyType[0],
    }
  },
  computed: {
    computeShowRawOrFileTextarea() {
      return this.bodyType === 'raw' || this.bodyType === 'file'
    },
  },
  created() {
    if (this.info.reqBodyType) {
      this.bodyType = this.info.reqBodyType
    }
  },
  methods: {
    onBtnClassicalClick(item) {
      this.selectedBtnClassical = item
    },
    // 获取所有表单数据
    getWholeFormValue() {
      const reqBodyIsJsonSchema = true
      const reqBodyType = this.bodyType
      let reqBodyOther
      let reqBodyForm = []
      const reqParams = []

      if (reqBodyType === 'json') {
        const jsonBodyEl = this.$refs.jsonBody
        const value = jsonBodyEl.reqJson
        reqBodyOther = jsonBodyEl.$options.normalizeCommitContent(value, true)
        reqBodyOther = JSON.stringify(reqBodyOther)
      } else if (reqBodyType === 'form') {
        const formBodyEl = this.$refs.formBody
        reqBodyForm = this.info.reqBodyForm
      } else if (reqBodyType === 'raw' || reqBodyType === 'file') {
        reqBodyOther = this.info.reqBodyOther
      }

      const reqHeaders = this.info.reqHeaders.map((val) => {
        const { desc, example, name, value } = val
        return {
          desc,
          example,
          name,
          value,
        }
      })
      const reqQuery = this.info.reqQuery

      return {
        reqBodyIsJsonSchema,
        reqBodyType,
        reqBodyOther,
        reqBodyForm,
        reqHeaders,
        reqQuery,
        reqParams,
      }
    },
  },
}
</script>
