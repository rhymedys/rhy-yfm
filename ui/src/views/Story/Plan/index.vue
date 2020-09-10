<template>
  <div class="app-container">
    <Layout ref="layoutWrapper" class="content-layout">
      <search-header-area ref="searchHeaderRef">
        <i-form :model="searchArea" :label-width="80" @submit.native.prevent>
          <i-col span="6">
            <form-item label="所属项目">
              <i-input
                v-model="searchArea.project"
                placeholder="请输所属项目"
                @on-enter="onAssignToEnter"
              />
            </form-item>
          </i-col>
          <i-col span="6">
            <i-button type="primary" @click.native="onSearchClick">搜索</i-button>
          </i-col>
        </i-form>
      </search-header-area>
      <div class="task-table">
        <Table
          ref="taskTableRef"
          width="100%"
          :height="tableConfig.tableHeight"
          :columns="tableConfig.coloum"
          :data="tableConfig.data"
          :loading="tableConfig.loading"
          :draggable="true"
          @on-row-click="onDetailClick"
        >
          <template slot="operation" slot-scope="{ row }">
            <div>
              <a @click="onDetailClick(row)">详情</a>
            </div>
          </template>
        </Table>
      </div>
      <div style="margin: 10px; overflow: hidden; padding: 0 16px">
        <div style="width: 100%; text-align: right">
          <page
            :total="tableConfig.totalCount"
            show-elevator
            show-sizer
            @on-change="onPagnationPageChangeProxy"
            @on-page-size-change="onPagnationPageSizeChangeProxy"
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
import { requestProductplanList } from '@/api/projecttask/productplan'
import config from '@/config'
import {  makeDebounceFn } from '@/utils'

import SearchHeaderArea from '@/components/common/SearchHeaderArea'

const tableCol = [
  {
    key: 'title',
    title: '标题',
  },
  {
    key: 'desc',
    title: '描述',
  },
  {
    key: 'begin',
    title: '开始',
    width: 200,
  },
  {
    key: 'end',
    title: '结束',
    width: 200,
  },
  {
    key: 'operation',
    slot: 'operation',
    title: '操作',
    width: 100,
  },
]

const formatDataFn = (res) => res.data

const invokeReplaceRouter = makeDebounceFn({
  pending(pendingId, query) {
    this.$router.replace({
      query,
    })
  },
})

// 按条件搜索
function invokeSearchByParams() {
  const { project } = this.searchArea

  invokeReplaceRouter.call(this, {
    project,
  })

  this.onPagnationPageChange(
    1,
    {
      project,
      product: config.productId,
    },
    formatDataFn
  )
}

export default {
  name: 'List',
  components: {
    SearchHeaderArea,
  },
  mixins: [pagnationMixin],

  data() {
    return {
      searchArea: {
        project: '',
      },
    }
  },
  pagnationApi: requestProductplanList,
  async created() {
    const query = this.$route.query

    const { project } = query

    await invokeRequestPagnationDataInServer(
      this,
      {
        api: requestProductplanList,
        query: {
          ...query,
          product: config.productId,
        },
        formatDataFn,
      },
      tableCol
    )

    this.$nextTick(() => {
      if (this.$refs.layoutWrapper) {
        this.tableConfig.tableHeight =
          this.$refs.layoutWrapper.$el.clientHeight -
          this.$refs.searchHeaderRef.$el.clientHeight -
          60 -
          28 -
          10
      }
    })
  },
  methods: {
    onDetailClick(row) {
    },
    onPagnationPageChangeProxy(toReqPage) {
      this.onPagnationPageChange(
        toReqPage,
        {
          ...this.$getRouteQuery(),
          product: config.productId,
        },
        formatDataFn
      )
    },
    onPagnationPageSizeChangeProxy(pageSize) {
      this.onPagnationPageSizeChange(
        pageSize,
        {
          ...this.$getRouteQuery(),
          product: config.productId,
        },
        formatDataFn
      )
    },
    // 点击搜索
    onSearchClick() {
      invokeSearchByParams.call(this)
    },
    // 指派回车
    onAssignToEnter(e) {
      invokeSearchByParams.call(this)
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
