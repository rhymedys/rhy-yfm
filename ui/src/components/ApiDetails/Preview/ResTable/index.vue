<template>
  <div v-if="compputeResBody.length">
    <h2 class="preview__title">返回数据</h2>
    <div class="preview__res">
      <el-table
        style="width: 100%"
        row-key="id"
        :data="compputeResBody"
        :row-style="mapTableRowStyle"
        :header-cell-style="mapTableHeaderCellStyle"
        border
      >
        <el-table-column
          v-for="(item, index) of $options.resQueryCol"
          :key="item.key || index"
          :prop="item.key"
          :label="item.title"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { nomalizeResData } from '~/utils/normalizeApiToTable'

export default {
  name: 'ResTable',
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  resQueryCol: [
    {
      title: '名称',
      key: 'name',
    },
    {
      title: '类型',
      key: 'type',
    },
    {
      title: '是否必须',
      key: 'required',
    },
    {
      title: '默认值',
      key: 'example',
    },
    {
      title: '备注',
      key: 'description',
    },
    {
      title: '其他信息',
      key: 'desc',
    },
  ],
  computed: {
    compputeResBody() {
      let res = []
      let { resBody } = this.info
      if (resBody) {
        try {
          resBody = JSON.parse(resBody)
          resBody = resBody.properties
          res = nomalizeResData(resBody)
        } catch (e) {
          console.warn('compputeResBody.err', e)
        }
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
</script>
