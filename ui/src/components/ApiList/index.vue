<template>
  <Layout ref="layoutWrapper" class="content-layout">
    <div class="task-table">
      <Table
        ref="taskTableRef"
        width="100%"
        :height="tableConfig.tableHeight"
        :columns="tableConfig.coloum"
        :data="tableConfig.data"
        @on-row-click="(e) => $emit('on-row-click', [e])"
      >
        <template slot="path" slot-scope="{ row }">
          <Tag :color="mapApiMethodConfig(row).color">{{
            mapApiMethodConfig(row).key
          }}</Tag>
          {{ row.path }}
        </template>
        <template slot="status" slot-scope="{ row }">
          <Tag :color="mapApiStatusConfig(row).color">{{
            mapApiStatusConfig(row).key
          }}</Tag>
        </template>
      </Table>
    </div>
    <div style="margin: 10px; overflow: hidden; padding: 0 16px">
      <div style="width: 100%; text-align: right">
        <page
          :total="tableConfig.totalCount"
          show-elevator
          show-sizer
          @on-change="onPagnationPageChange"
          @on-page-size-change="onPagnationPageSizeChange"
        />
      </div>
    </div>
  </Layout>
</template>

<script>
import pagnationMixin, {
  invokeRequestPagnationDataInServer,
} from '~/mixins/pagnation.js'
import { reqeustTaskevaluatecheckList } from '~/services/projecttask/taskevaluatecheck'
import showTaskEvaluateItemModal from '~/components/TaskEvaluateItemModal/api'
import taskEvaluateCheckStatus from '~/contants/taskEvaluateCheckStatus.js'
import apiStatus from '~/contants/apiStatus'
import apiMethod from '~/contants/apiMethod'

const tableCol = [
  {
    key: 'title',
    title: '接口名称',
  },
  {
    key: 'path',
    slot: 'path',
    title: '接口路径',
  },
  {
    key: 'status',
    slot: 'status',
    title: '状态',
  },
]

export default {
  name: 'ApiList',
  mixins: [pagnationMixin],
  tableCol,
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.layoutWrapper) {
        this.tableConfig.tableHeight =
          this.$refs.layoutWrapper.$el.clientHeight - 60 - 28
      }
    })
  },
  methods: {
    mapApiStatusConfig(info) {
      return apiStatus.mapObjectByValueFn(info.status)
    },
    mapApiMethodConfig(info) {
      return apiMethod.mapObjectByValueFn(info.method)
    },
  },
}
</script>
<style lang="less" scoped>
.content-layout {
  background-color: white;
  box-shadow: 1px 1px 4px rgba(0, 21, 41, 0.08);
  height: ~'calc(100vh - 112px)';
  padding: 14px 16px;
  > * {
    user-select: none;
  }
}
</style>
