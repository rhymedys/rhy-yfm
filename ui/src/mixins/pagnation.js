/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-16 13:48:59
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-09 14:27:46
 */
import { makeDebounceFn } from '@/utils/index'

/**
 * 服务端
 *
 * @export
 */
export async function invokeRequestPagnationDataInServer(ctx, api, tableCol) {

  const query = ctx.$route.query


  let mapQuery
  let mapApi
  let formatDataFn

  if (Object.prototype.toString.call(api) === '[object Object]') {
    mapApi = api.api
    formatDataFn = api.formatDataFn
    if (Object.prototype.toString.call(api.query) === '[object Function]') {
      mapQuery = api.query()
    } else {
      mapQuery = api.query
    }
  } else {
    mapApi = api
  }

  const res = await mapApi.call(ctx, {
    page: 1,
    limit: 10,
    ...query,
    ...mapQuery,
  })

  let totalCount = 0
  let data = []
  const { code } = res
  let { page } = res
  if (code === 0) {
    if (formatDataFn) {
      page = formatDataFn(res)
    }

    data = page.list
    totalCount = page.totalCount
  }


  ctx.tableConfig = {
    tableHeight: undefined,
    loading: false,
    totalCount,
    page: 1,
    pageSize: 10,
    coloum: Object.freeze(tableCol),
    data,
  }



}

export default {
  data() {
    return {
      tableConfig: {
        loading: false,
        totalCount: 0,
        page: 0,
        pageSize: 10,
        data: [],
        tableHeight: undefined,
      },
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    useTableData: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    const { asyncData, tableCol } = this.$options
    if (this.useTableData) {
      this.tableConfig.data = this.tableData.slice(0, this.pageSize || 10)
      this.tableConfig.totalCount = this.tableData.length
    }

    if (!asyncData && tableCol) {
      this.tableConfig.coloum = Object.freeze(tableCol)
    }
  },
  beforeCreate() {
    this.invokeRequestList = makeDebounceFn({
      beforePending(pendingId) {
        this.tableConfig.loading = true
        this.invokeRequestListPengindId = pendingId
      },
      async pending(pendingId, opts) {
        const { queryFn, formatDataFn } = opts

        if (this.$options.pagnationApi) {
          this.tableConfig.page += 1

          const { page, pageSize } = this.tableConfig

          let query = {
            page,
            pageSize,
          }

          if (typeof queryFn === 'function') {
            query = {
              ...query,
              ...queryFn(),
            }
          } else if (
            Object.prototype.toString.call(queryFn) === '[object Object]'
          ) {
            query = {
              ...query,
              ...queryFn,
            }
          }

          const res = await this.$options.pagnationApi.call(this, {
            page,
            limit: pageSize,
            ...query,
          })

          if (pendingId !== this.invokeRequestListPengindId) {
            return
          }

          if (formatDataFn) {
            res.page = formatDataFn(res)
          }

          if (res.code === 0) {
            this.tableConfig.data = res.page.list
            this.tableConfig.totalCount = res.page.totalCount
          } else {
            this.tableConfig.data = []
          }

          this.tableConfig.page = query.page
          this.tableConfig.pageSize = query.pageSize
          this.tableConfig.loading = false
        }
      },
    })
  },

  methods: {
    // 分页器页码发生改变
    onPagnationPageChange(toReqPage, query, formatDataFn) {
      const { pageSize } = this.tableConfig

      if (this.useTableData) {
        let start = toReqPage - 1
        start = start * pageSize

        this.tableConfig.data = this.tableData.slice(
          start,
          toReqPage * pageSize
        )
        this.tableConfig.page = toReqPage
      } else {
        this.invokeRequestList({
          queryFn: {
            page: toReqPage,
            limit: pageSize,
            ...query,
          },
          formatDataFn,
        })
      }
    },
    // 分页器每页大小发生改变
    onPagnationPageSizeChange(pageSize, query, formatDataFn) {
      let timeoutId = setTimeout(() => {
        if (this.useTableData) {
          this.tableConfig.page = 1
          this.tableConfig.pageSize = pageSize
          this.tableConfig.data = this.tableData.slice(0, pageSize)
        } else {
          this.invokeRequestList({
            queryFn: {
              page: 1,
              limit: pageSize,
              ...query,
            },
            formatDataFn,
          })
        }

        clearTimeout(timeoutId)
        timeoutId = undefined
      }, 0)
    },
  },
}
