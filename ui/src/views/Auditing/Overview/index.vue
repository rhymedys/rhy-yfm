<template>
  <div class="app-container">
    <Layout ref="layoutWrapper" class="content-layout">
      <div class="task-table">
        <Table
          ref="taskTableRef"
          width="100%"
          :height="tableConfig.tableHeight"
          :columns="tableConfig.coloum"
          :data="tableConfig.data"
          :loading="tableConfig.loading"
          :draggable="true"
        >
          <template slot="operation" slot-scope="{ row }">
            <div>
              <a @click="onDetailClick(row)">审核</a>
            </div>
          </template>

          <template slot="mountTaskId" slot-scope="{ row }">
            <tag color="default">{{ row.id }}</tag>
            {{ mountTaskId(row) }}
          </template>

          <tag
            slot="status"
            slot-scope="{ row }"
            :color="mapTaskStatusConfig(row).color"
          >{{ mapTaskStatusConfig(row).key }}</tag>
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
  </div>
</template>

<script>
import pagnationMixin, {
  invokeRequestPagnationDataInServer,
} from '@/mixins/pagnation.js'
import { reqeustTaskevaluatecheckList } from '@/api/projecttask/taskevaluatecheck'
import showTaskEvaluateItemModal from '@/components/TaskEvaluateItemModal/api'
import taskEvaluateCheckStatus from '@/contants/taskEvaluateCheckStatus.js'

const tableCol = [
  {
    key: 'taskId',
    slot: 'mountTaskId',
    title: '标题',
    width: 360,
  },
  {
    key: 'userName',
    title: '提交者',
    width: 80,
  },
  {
    key: 'status',
    slot: 'status',
    title: '状态',
    width: 120,
  },
  {
    key: 'createTime',
    title: '创建时间',
  },
  {
    key: 'planStartTime',
    title: '计划开始时间',
  },
  {
    key: 'totalTime',
    title: '预计用时(分钟)',
    width: 120,
  },
  {
    key: 'operation',
    slot: 'operation',
    title: '操作',
    width: 100,
  },
]

export default {
  name: 'Auditing',
  mixins: [pagnationMixin],
  pagnationApi: reqeustTaskevaluatecheckList,
  async created() {
    await invokeRequestPagnationDataInServer(
      this,
      reqeustTaskevaluatecheckList,
      tableCol
    )

    this.$nextTick(() => {
      if (this.$refs.layoutWrapper) {
        this.tableConfig.tableHeight =
          this.$refs.layoutWrapper.$el.clientHeight - 60 - 28
      }
    })
  },
  methods: {
    onDetailClick(row) {
      showTaskEvaluateItemModal({
        context: this,
        row,
        onOk: (res) => {
          if (res.code === 0) {
            this.$Message.success(res.msg)
          } else {
            this.$Message.error(res.msg)
          }

          this.invokeRequestList({
            queryFn: {
              page: this.tableConfig.page,
            },
          })
        },
      })
    },
    // 映射任务状态
    mapTaskStatusConfig(row) {
      return taskEvaluateCheckStatus.mapObjectByValueFn(row.status)
    },
    // 获取任务描述
    mountTaskId(row) {
      return row.taskName
    },
  },
}
</script>
<style lang="less" scoped>
.content-layout {
  background-color: white;
  box-shadow: 1px 1px 4px rgba(0, 21, 41, 0.08);
  height: ~'calc(100vh - 124px)';
  padding: 14px 16px;
  > * {
    user-select: none;
  }
}
</style>
