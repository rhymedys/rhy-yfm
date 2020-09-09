<template>
  <div class="app-container">
    <Layout ref="layoutWrapper" class="content-layout">
      <search-header-area ref="searchHeaderRef">
        <i-form :model="searchArea" :label-width="80" @submit.native.prevent>
          <i-col span="6">
            <form-item label="指派给">
              <i-input
                v-model="searchArea.assignedTo"
                placeholder="请输入指派给"
                @on-enter="onAssignToEnter"
              />
            </form-item>
          </i-col>
          <i-col span="6">
            <form-item label="状态">
              <i-select v-model="searchArea.status">
                <i-option
                  v-for="item of $options.storyStatus.value"
                  :key="item.value"
                  :value="item.value"
                >{{ item.key }}</i-option>
              </i-select>
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
          <template slot="status" slot-scope="{ row }">
            <tag
              :color="mapStoryStatusConfig(row.status).color"
            >{{ mapStoryStatusConfig(row.status).key }}</tag>
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
import { requestStoryList } from '@/api/projecttask/story'
import config from '@/config'
import { openNewTab, makeDebounceFn } from '@/utils'
import storyStatus from '@/contants/storyStatus.js'
import SearchHeaderArea from '@/components/common/SearchHeaderArea'

const tableCol = [
  {
    key: 'id',
    title: 'id',
    width: 80,
  },
  {
    key: 'title',
    title: '标题',
  },
  {
    key: 'pri',
    title: '级别',
    width: 60,
  },
  {
    key: 'status',
    title: '状态',
    slot: 'status',
    width: 120,
  },
  {
    key: 'openedBy',
    title: '创建',
    width: 120,
  },
  {
    key: 'operation',
    slot: 'operation',
    title: '操作',
    width: 100,
  },
]

const formatDataFn = (res) => {
  console.log(res)
  return res.data
}

const invokeReplaceRouter = makeDebounceFn({
  pending(pendingId, query) {
    this.$router.replace({
      query,
    })
  },
})

// 按条件搜索
function invokeSearchByParams() {
  const { assignedTo, status } = this.searchArea

  invokeReplaceRouter.call(this, {
    assignedTo,
    status,
  })

  this.onPagnationPageChange(
    1,
    {
      assignedTo,
      status,
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
  storyStatus,
  mixins: [pagnationMixin],
  async created() {
    const query = this.$route.query

    const { status, assignedTo } = query


    this.searchArea = {
      ...this.searchArea,
      assignedTo,
      status
    }

    await invokeRequestPagnationDataInServer(
      this,
      {
        api: requestStoryList,
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
  data() {
    return {
      searchArea: {
        assignedTo: '',
        status: '',
      },
    }
  },
  pagnationApi: requestStoryList,
  methods: {
    // 点击查看需求详情
    onDetailClick(row) {
      openNewTab(`story/detail/${row.id}`)
    },
    onPagnationPageChangeProxy(toReqPage) {
      this.onPagnationPageChange(
        toReqPage,
        {
          ...this.$route.query,
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
    mapStoryStatusConfig(val) {
      return storyStatus.mapObjectByValueFn(val)
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
