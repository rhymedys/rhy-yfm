/*

 * @Author: Rhymedys/Rhymedys@gmail.com

 * @Date: 2019-08-14 13:45:30

 * @Last Modified by: Rhymedys

 * @Last Modified time: 2020-09-10 21:54:39

 */

import {
  reqeustBoardStoryBoardInfoByProjectId,
  reqeustBoardStoryBoardInfoByProduct,
  requestBoardRecentWeeksStoryGanttChart,
  requestBoardStoryBoardInfoByProductPlan,
  requestBoardStoryBoardInfoByProjectBuild,
} from '@/api/projecttask/board'
import {
  requestProductplanQueryAll
} from '@/api/projecttask/productplan'
import {
  requestBuildQueryAll
} from '@/api/projecttask/build'

import ProjectAndProductTypeSelector from '@/components/ProjectAndProductTypeSelector'

import projectAndProductClassical from '@/contants/projectAndProductClassical'

import {
  makeDebounceFn
} from '@/utils'

import quickProgressPreviewerApi from '@/components/QuickProgressPreviewer/api'

import quickCombineTaskPreviewerApi from '@/components/QuickComineTaskPreviewer/api'

import ProjectAndProductTable from '@/components/ProjectAndProductTable'

import ProjectAndProductTableClassicalCard from '@/components/ProjectAndProductTableClassicalCard'

import config from '@/config'

import TaskGrantter from '@/components/TaskGrantter'

import showCommonSelModal from '@/components/common/CommonSelModal/api'

import projectAndProductTableClassicalCardClassicalInfoPreviewerApi from '@/components/ProjectAndProductTableClassicalCardClassicalInfoPreviewer/api'

let requestTaskListPendingId = 0

const tableCol = [{
    key: 'pri',

    title: '优先级',

    width: 80,

    slot: 'pri',
  },

  {
    key: 'title',

    slot: 'title',

    title: '需求名称',
  },

  {
    key: 'project',

    title: '项目',
  },

  {
    key: 'openedBy',

    title: '创建者',
  },

  {
    key: 'assignedTo',

    title: '当前指派',
  },
]

/**

 * 请求列表数据

 *

 * @param {*} obj

 */

const invokeRequestList = makeDebounceFn({
  beforePending(pendingId) {
    this.tableConfig.loading = true

    requestTaskListPendingId = pendingId
  },

  async pending(pendingId, obj) {
    const {
      type
    } = obj

    const params = {}

    let api

    if (!type || type === 'storyBoardInfoByProjectId') {
      api = reqeustBoardStoryBoardInfoByProjectId
      params.projectId = config.projectId
    } else if (type === 'storyBoardInfoByProduct') {
      api = reqeustBoardStoryBoardInfoByProduct
      params.productId = config.productId
    }

    const storyBoardInfoByProjectIdRes = await api
      .call(this, params)
      .catch((e) => {
        return {}
      })

    const {
      code,
      data
    } = storyBoardInfoByProjectIdRes

    if (pendingId === requestTaskListPendingId) {
      this.tableConfig.loading = false

      if (code === 0) {
        if (data) {
          this.boardData = data
        }
      }
    }
  },
})

// 关闭进度预览

const invokeHideQuickProgressPreviewer = makeDebounceFn({
  pending() {
    if (!this.mouseInProgressPreviewer && !this.mouseInProgressTxt) {
      quickProgressPreviewerApi.hide()
    }
  },
})

// 关闭进度预览

const invokeHideCombineTaskPreviewer = makeDebounceFn({
  pending() {
    if (!this.mouseInCombineTaskPreviewer && !this.mouseInCombineTaskTxt) {
      quickCombineTaskPreviewerApi.hide()
    }
  },
})

// 关闭进度预览

const invokeHideClassicalInfoPreviewer = makeDebounceFn({
  pending() {
    if (!this.mouseInClassicalInfoPreviewer && !this.mouseInClassicalInfoTxt) {
      projectAndProductTableClassicalCardClassicalInfoPreviewerApi.hide()
    }
  },
})

/**

 * @description 请求甘特图数据

 */

async function invokeRequestRecentWeeksStoryGanttChart() {
  const res = await requestBoardRecentWeeksStoryGanttChart.call(this, {
    projectId: 23,
  })

  if (res.code === 0) {
    if (res.data.projectGanttStoryInfoList) {
      this.projectGanttStoryInfoList = invokeNormalizeProjectGanttStoryInfoList(
        res.data.projectGanttStoryInfoList
      )

      this.startTime = res.data.startTime
      this.endTime = res.data.endTime
    }
  } else {
    this.$Message.error(res.msg)
  }

  this.tableConfig.loading = false
}

function invokeNormalizeProjectGanttStoryInfoList(list, isChildren) {
  const res = []

  list.forEach((val) => {
    if (isChildren) {
      val.name = `【${val.realname}】${val.name}`
      val.label = `${val.name}` || '未知任务'
      val.startDate = val.estStarted
      val.isTask = true
      val.endDate = val.deadline
    } else {
      val.label = val.title || '未知需求'
    }
    res.push(val)
    if (val.projectGanttStoryTaskInfos) {
      res.push(
        ...invokeNormalizeProjectGanttStoryInfoList(
          val.projectGanttStoryTaskInfos,
          true
        )
      )
    }
  })

  return res
}

export default {
  data() {
    return {


      taskStatusArr: Object.freeze(Object.keys(projectAndProductClassical)),

      boardData: {},

      // 任务显示类型

      taskShowType: 'classicalList', // list ,classicalList,grantt

      boardType: 'storyBoardInfoByProjectId', // storyBoardInfoByProjectId 项目 storyBoardInfoByProduct 产品

      tableConfig: {
        tableHeight: undefined,

        type: 'projecteds',

        coloum: Object.freeze(tableCol),

        loading: true
      },

      startTime: '', // 甘特图开始时间

      endTime: '', // 甘特图结束时间

      loadingProductplan: false, // 正在查询产品计划

      requestProductplanQueryAllRes: [], //  产品计划列表

      requestBuildQueryAllRes: [], // 项目计划列表

      showCommonSelModalAfteRrequestProductplanQueryAll: false, //  请求完回来显示选择任务弹窗
    }
  },

  projectAndProductClassical,

  components: {
    ProjectAndProductTypeSelector,

    TaskGrantter,

    ProjectAndProductTable,

    ProjectAndProductTableClassicalCard,
  },


  async created() {


    console.log('created')

    const {
      query
    } = this.$route



    const params = {}

    let isGrantt = false

    let taskShowType = 'classicalList'

    let api




    const boardType = query.type || 'storyBoardInfoByProjectId'

    this.boardType = boardType

    if (boardType === 'storyBoardInfoByProjectId') {
      api = reqeustBoardStoryBoardInfoByProjectId
      params.projectId = config.projectId
    } else if (boardType === 'storyBoardInfoByProduct') {
      api = reqeustBoardStoryBoardInfoByProduct

      params.productId = config.productId
    } else if (boardType === 'grantt') {
      api = requestBoardRecentWeeksStoryGanttChart
      params.projectId = config.projectId

      isGrantt = true

      taskShowType = 'grantt'
    }
    const storyBoardInfoByProjectIdRes = await api(params)
      .catch((e) => {
        return {}
      })

    let boardData = {}

    let projectGanttStoryInfoList = []

    let startTime = ''
    let endTime = ''

    try {
      const {
        code,
        data
      } = storyBoardInfoByProjectIdRes

      if (!isGrantt) {
        if (code === 0 && data) {
          boardData = data
        }
      } else if (code === 0 && data) {
        projectGanttStoryInfoList = invokeNormalizeProjectGanttStoryInfoList(
          data.projectGanttStoryInfoList
        )
        startTime = data.startTime
        endTime = data.endTime
      }
    } catch (error) {
      console.log(
        'projectandproduct asyncData error',

        error,

        storyBoardInfoByProjectIdRes.data
      )

      console.log(error)
    }





    const res = {
      boardData: {
        projecteds: boardData.projecteds || [],

        developings: boardData.developings || [],

        developeds: boardData.developeds || [],

        title: boardData.title || '',

        beginTime: boardData.beginTime || '',

        endTime: boardData.endTime || '',
      },

      boardType,

      mouseInProgressPreviewer: false,

      mouseInProgressTxt: false,

      taskShowType,

      mouseInCombineTaskPreviewer: false,

      mouseInCombineTaskTxt: false,

      mouseInClassicalInfoPreviewer: false,

      mouseInClassicalInfoTxt: false,

      // 前两周，后两周需求甘特图

      projectGanttStoryInfoList,

      startTime,

      endTime,
    }




    for (const [k, v] of Object.entries(res)) {
      this[k] = v
    }

    this.tableConfig.loading = false



    this.$nextTick(() => {
      if (this.$refs.layoutWrapper) {
        this.tableConfig.tableHeight =
          this.$refs.layoutWrapper.$el.clientHeight - 60 - 14
      }
    })

    this.loadingProductplan = true
    const requestProductplanQueryAllReq = requestProductplanQueryAll.call(
      this, {
        product: config.productId,
      }
    )

    const requestBuildQueryAllReq = requestBuildQueryAll.call(this, {
      product: config.productId,
      project: config.projectId,
    })

    const [
      requestProductplanQueryAllRes,
      requestBuildQueryAllRes,
    ] = await Promise.all([
      requestProductplanQueryAllReq,
      requestBuildQueryAllReq,
    ])

    const isRequestProductplanQueryAllResOk =
      requestProductplanQueryAllRes.code === 0

    const isRequestBuildQueryAllResOk = requestBuildQueryAllRes.code === 0

    if (isRequestProductplanQueryAllResOk) {
      this.loadingProductplan = false
      this.requestProductplanQueryAllRes = requestProductplanQueryAllRes.data.map(
        (val) => {
          return {
            value: val.id,
            label: val.title,
          }
        }
      )
    }

    if (isRequestBuildQueryAllResOk) {
      this.loadingProductplan = false
      this.requestBuildQueryAllRes = requestBuildQueryAllRes.data.map(
        (val) => {
          return {
            value: val.id,
            label: val.name,
          }
        }
      )
    }

    if (isRequestBuildQueryAllResOk || isRequestProductplanQueryAllResOk) {
      if (this.showCommonSelModalAfteRrequestProductplanQueryAll) {
        this.onPlanSelectClick()
      }
    }




  },


  methods: {
    // 根据任务状态映射任务

    mapClassilcalTask(status) {
      let res = []

      if (this.boardData) {
        res = this.boardData[status] || []
      }

      return res
    },

    // 分类点击

    onTaskTypeClick(type) {
      this.tableConfig.type = type
    },

    onTaskShowTypeChange() {
      let res

      if (this.taskShowType === 'list') {
        res = 'classicalList'
      } else {
        res = 'list'
      }

      this.taskShowType = res
    },

    // 项目产品切换

    onProductOrProjectClassicalClick(type) {
      if (type !== this.boardType) {
        this.boardData = {}

        this.projectGanttStoryInfoList = []

        this.tableConfig.loading = true

        this.boardType = type

        this.$router.replace({
          query: {
            type,
          },
        })

        if (type !== 'grantt') {
          this.$nextTick(() => {
            invokeRequestList.call(this, {
              type,
            })
          })

          this.taskShowType = 'classicalList'
        } else {
          this.taskShowType = type

          invokeRequestRecentWeeksStoryGanttChart.call(this)
        }
      }
    },

    // 鼠标移进分类概览

    onClassicalInfoMouseMove(e, classical) {
      const {
        x,
        y
      } = e.srcElement.getBoundingClientRect()

      invokeHideClassicalInfoPreviewer.resetDebounceId()

      this.mouseInProgressTxt = true

      const {
        boardData
      } = this

      projectAndProductTableClassicalCardClassicalInfoPreviewerApi.show({
        boardData,
        classical,
        x,
        y,
        onMouseMove: (e) => {
          invokeHideClassicalInfoPreviewer.resetDebounceId()

          this.mouseInClassicalInfoPreviewer = true
        },
        onMouseOut: (e) => {
          this.mouseInClassicalInfoPreviewer = false

          invokeHideClassicalInfoPreviewer.call(this)
        },
      })
    },

    // 鼠标移出分类概览

    onClassicalInfoMouseOut(e) {
      this.mouseInClassicalInfoTxt = false

      invokeHideClassicalInfoPreviewer.call(this)
    },

    // 鼠标移进完成率

    onCompleteRateMouseMove(e) {
      const index = e.target.dataset.index

      const status = e.target.dataset.status

      const {
        x,
        y
      } = e.srcElement.getBoundingClientRect()

      invokeHideQuickProgressPreviewer.resetDebounceId()

      this.mouseInProgressTxt = true

      quickProgressPreviewerApi.show({
        storyBoardTaskInfoList: this.mapClassilcalTask(status)[index]
          .storyBoardTaskInfoList,

        x,

        y,

        onMouseMove: (e) => {
          invokeHideQuickProgressPreviewer.resetDebounceId()

          this.mouseInProgressPreviewer = true
        },

        onMouseOut: (e) => {
          this.mouseInProgressPreviewer = false

          invokeHideQuickProgressPreviewer.call(this)
        },
      })
    },

    // 鼠标移出完成率

    onCompleteRateMouseOut(e) {
      this.mouseInProgressTxt = false

      invokeHideQuickProgressPreviewer.call(this)
    },

    // 鼠标移进关联任务情况

    onCombineTaskMouseMove(e) {
      const index = e.target.dataset.index

      const status = e.target.dataset.status

      const {
        x,
        y
      } = e.srcElement.getBoundingClientRect()

      invokeHideCombineTaskPreviewer.resetDebounceId()

      this.mouseInCombineTaskTxt = true

      quickCombineTaskPreviewerApi.show({
        storyBoardTaskInfoList: this.mapClassilcalTask(status)[index]
          .storyBoardTaskInfoList,
        x,
        y,
        onMouseMove: (e) => {
          invokeHideCombineTaskPreviewer.resetDebounceId()

          this.mouseInCombineTaskPreviewer = true
        },

        onMouseOut: (e) => {
          this.mouseInCombineTaskPreviewer = false

          invokeHideCombineTaskPreviewer.call(this)
        },
      })
    },

    // 鼠标移出关联任务情况

    onCombineTaskMouseOut(e) {
      this.mouseInCombineTaskTxt = false

      invokeHideCombineTaskPreviewer.call(this)
    },

    // 跳转需求详情

    onStoryDetailClick(storyId) {

      this.$router.push({
        path: this.routePathPrefix+`/projectandproduct/detail`,
        query: {
          id: storyId
        }
      })
    },
    // 点击弹出选择计划弹窗
    onPlanSelectClick() {
      if (!this.loadingProductplan) {
        let list = []

        if (this.boardType === 'storyBoardInfoByProjectId') {
          list = this.requestBuildQueryAllRes
        } else if (this.boardType === 'storyBoardInfoByProduct') {
          list = this.requestProductplanQueryAllRes
        }

        showCommonSelModal({
          list,
          onOk: this.invokeSelectPlan,
        })
        this.showCommonSelModalAfteRrequestProductplanQueryAll = false
        this.$options.hideGetPlanSelLoading &&
          this.$options.hideGetPlanSelLoading()
      } else {
        this.$options.hideGetPlanSelLoading = this.$Message.loading({
          content: '正在获取计划信息...',
          duration: 0,
        })
        this.showCommonSelModalAfteRrequestProductplanQueryAll = true
      }
    },

    // 选中计划
    async invokeSelectPlan(id) {
      this.tableConfig.loading = true

      let api
      const params = {}

      if (this.boardType === 'storyBoardInfoByProjectId') {
        api = requestBoardStoryBoardInfoByProjectBuild
        params.projectBuildId = id
      } else if (this.boardType === 'storyBoardInfoByProduct') {
        api = requestBoardStoryBoardInfoByProductPlan
        params.productPlanId = id
      }

      const res = await api.call(this, params)

      if (res.code === 0) {
        this.boardData = res.data
      }

      this.tableConfig.loading = false
    },
  },
}
