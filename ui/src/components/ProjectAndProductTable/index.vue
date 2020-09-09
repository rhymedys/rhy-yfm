<template>
  <div class="task-table">
    <Table
      width="100%"
      :height="tableConfig.tableHeight"
      :columns="tableConfig.coloum"
      :data="computeTableData"
    >
      <template slot="pri" slot-scope="{ row }">
        <tag :color="mapPriColorConfig(row).color">{{
          mapPriColorConfig(row).key
        }}</tag>
      </template>
      <template slot="title" slot-scope="{ row }">
        <span>{{ row.title }}</span>
      </template>
    </Table>
  </div>
</template>

<script>
import prior from '@/contants/prior'

export default {
  name: 'ProjectAndProductTable',
  props: {
    boardData: {
      type: Object,
      default: () => {},
    },
    tableConfig: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    computeTableData() {
      let res = []
      if (this.boardData) {
        res = this.boardData[this.tableConfig.type] || []
      }

      return res
    },
  },
  methods: {
    // 映射优先级配置
    mapPriColorConfig(row) {
      let res = {}
      if (row.pri !== undefined) {
        res = prior.mapObjectByValueFn(row.pri)
      }

      return res
    },
  },
}
</script>
