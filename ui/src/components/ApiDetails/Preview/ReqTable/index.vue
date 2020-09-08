<template>
  <div v-if="computeShowContent">
    <h2 class="preview__title">请求参数</h2>
    <template v-if="compputeReqHeader.length">
      <div class="preview__req">
        <h3 class="col-title">Header：</h3>
        <el-table
          style="width: 100%"
          row-key="_id"
          :data="compputeReqHeader"
          :row-style="mapTableRowStyle"
          :header-cell-style="mapTableHeaderCellStyle"
          border
        >
          <el-table-column
            v-for="item of $options.reqHeaderCol"
            :key="item.key"
            :prop="item.key"
            :label="item.title"
          />
        </el-table>
      </div>
    </template>
    <template v-if="compputeReqQuery.length">
      <div class="preview__req">
        <h3 class="col-title">Query：</h3>
        <el-table
          style="width: 100%"
          row-key="id"
          :data="compputeReqQuery"
          :row-style="mapTableRowStyle"
          :header-cell-style="mapTableHeaderCellStyle"
          border
        >
          <el-table-column
            v-for="item of $options.reqQueryCol"
            :key="item.key"
            :prop="item.key"
            :label="item.title"
          />
        </el-table>
      </div>
    </template>

    <template v-if="computeShowReqBody.length">
      <div class="preview__req">
        <h3 class="col-title">Body：</h3>
        <el-table
          style="width: 100%"
          row-key="key"
          :data="computeShowReqBody"
          :row-style="mapTableRowStyle"
          :header-cell-style="mapTableHeaderCellStyle"
          border
        >
          <el-table-column
            v-for="item of computeShowReqBodyHeader"
            :key="item.key"
            :prop="item.key"
            :label="item.title"
          >
            <template slot-scope="scope">
              <template v-if="item.key === 'otherDesc'">
                <p v-for="row of scope.row.otherDesc" :key="row[0]">
                  <span style="fontweight: 700px">{{ row[0] }}： </span>
                  <span>{{ row[1] }}</span>
                </p>
              </template>
              <template v-if="item.key !== 'otherDesc'">
                {{ scope.row[item.key] }}
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template v-if="computeShowRawData">
      <div class="preview__req">
        <h3 class="col-title">Body：</h3>
        <ace-editor
          :read-only="true"
          mode="javascript"
          :data="computeShowRawData"
        />
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import { Pagination, Table, TableColumn } from 'element-ui'
import messageMap from '~/contants/apiMessageMap'
import {
  normalizeApiToTable,
  nomalizeResData,
} from '~/utils/normalizeApiToTable'
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)

const opts = {
  name: 'ReqTable',
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  reqQueryCol: [
    {
      title: '参数名称',
      key: 'name',
    },
    {
      title: '是否必须',
      key: 'required',
      slot: 'required',
    },
    {
      title: '示例',
      key: 'example',
    },
    {
      title: '备注',
      key: 'desc',
    },
  ],
  reqHeaderCol: [
    {
      title: '参数名称',
      key: 'name',
    },
    {
      title: '参数值',
      key: 'value',
    },
    {
      title: '是否必须',
      key: 'required',
    },
    {
      title: '示例',
      key: 'example',
    },
    {
      title: '备注',
      key: 'desc',
    },
  ],
  reqBodyFormCol: [
    {
      title: '参数名称',
      key: 'name',
    },
    {
      title: '参数类型',
      key: 'type',
    },
    {
      title: '是否必须',
      key: 'required',
    },
    {
      title: '示例',
      key: 'example',
    },
    {
      title: '备注',
      key: 'desc',
    },
  ],
  reqBodyJsonCol: [
    {
      title: '参数名称',
      key: 'name',
    },
    {
      title: '参数类型',
      key: 'type',
    },
    {
      title: '是否必须',
      key: 'required',
    },
    {
      title: '默认值',
      key: 'default',
    },
    {
      title: '备注',
      key: 'description',
    },
    {
      title: '其他信息',
      key: 'otherDesc',
    },
  ],
  computed: {
    compputeReqQuery() {
      if (!this.info.reqQuery) {
        return []
      }
      return this.info.reqQuery.map((val, i) => {
        return {
          ...val,
          id: val.id || i,
          required: val.required ? '是' : '否',
        }
      })
    },
    compputeReqHeader() {
      return this.info.reqHeaders.map((val) => {
        return {
          ...val,
          required: val.required === '1' ? '是' : '否',
        }
      })
    },
    compputeReqBodyForm() {
      return this.info.reqBodyForm.map((val) => {
        return {
          ...val,
          required: val.required === '1' ? '是' : '否',
        }
      })
    },
    computeReqBodyJson() {
      let res = []
      if (this.info.reqBodyOther) {
        try {
          res = normalizeApiToTable(JSON.parse(this.info.reqBodyOther))
          res = res.map((val) => {
            val.otherDesc = Object.keys(val.sub)
              .map((des) => {
                const name = messageMap[des]
                const value = val.sub[des]

                const isNull = (arg) => {
                  const nullVal = ['[object Null]', '[object Undefined]']

                  return nullVal.includes(Object.prototype.toString.call(arg))
                }
                if (!isNull(name) && !isNull(value)) {
                  return [name, value]
                }
              })
              .filter((val) => val)

            return val
          })
        } catch (e) {}
      }

      return res
    },

    computeShowContent() {
      const {
        compputeReqQuery,
        compputeReqHeader,
        computeShowReqBody,
        computeShowRawData,
      } = this
      return (
        compputeReqQuery.length ||
        compputeReqHeader.length ||
        computeShowReqBody.length ||
        computeShowRawData
      )
    },
    computeShowReqBody() {
      let res = {}
      const { reqBodyType } = this.info

      if (reqBodyType === 'json') {
        res = this.computeReqBodyJson
      } else if (reqBodyType === 'form') {
        res = this.compputeReqBodyForm
      }

      return res
    },
    computeShowReqBodyHeader() {
      let res = []
      const { reqBodyType } = this.info
      if (reqBodyType === 'json') {
        res = this.$options.reqBodyJsonCol
      } else if (reqBodyType === 'form') {
        res = this.$options.reqBodyFormCol
      }

      return res
    },
    computeShowRawData() {
      let res

      const { reqBodyType, reqBodyIsJsonSchema } = this.info
      if (reqBodyType === 'raw') {
        res = this.info.reqBodyOther
      }

      return res
    },
  },
  methods: {
    mapTableRowStyle({ row, rowIndex }) {
      const res = {}
      const mod = rowIndex % 2
      if (mod) {
        res['background-color'] = '#f8f8f9'
      }
      return res
    },
    mapTableHeaderCellStyle() {
      return {
        'background-color': '#f8f8f9',
        color: '#515a6e',
      }
    },
  },
}

if (!process.server) {
  const AceEditor = () => import('../../../AceEditor')
  if (!opts.components) {
    opts.components = {}
  }
  opts.components.AceEditor = AceEditor
}

export default opts
</script>
