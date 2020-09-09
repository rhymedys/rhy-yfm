/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-07 11:38:06
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-09 17:19:01
 */

import moment from 'moment'
import {
  reqeustTaskList,
  requestTaskStart,
  requestTaskDone,
  requestTaskDetail,
  requestTaskSignTaskWork,
} from '@/api/projecttask/task'
import {
  requestStoryGetStorysBuild
} from '@/api/projecttask/story'
import {
  makeDebounceFn,
  showSecondConfirm,
  openNewTab
} from '@/utils'
import prior from '@/contants/prior'
import TaskTypeSelector from '@/components/TaskTypeSelector'
import showTaskRecordModalComponent from '@/components/TaskRecordModal/api'
import showSchduleValueInputModal from '@/components/SchduleValueInputModal/api'
import SimpleImportantIcon from '@/components/SimpleImportantIcon'
import taskStatus, {
  wait,
  doing,
  pause,
  done
} from '@/contants/taskStatus.js'

import {
  requestAddTaskEvaluateCheckContent
} from '@/api/projecttask/taskevaluatecheck'

import Cookies from 'js-cookie'

let requestTaskListPendingId = 0
let requesTaskDetailPendingId = 0

let invokeRequestEditTaskDetailsAndShowLoading

const tableCol = [{
    key: 'pri',
    title: '优先级',
    width: 100,
    slot: 'pri',
    fixed: 'left',
  },
  {
    key: 'name',
    slot: 'name',
    title: '任务状态/名称',
    width: 600,
    fixed: 'left',
  },

  {
    key: 'project',
    title: '项目',
    width: 300,
  },

  {
    key: 'openedBy',
    title: '创建者',
    width: 150,
  },
  {
    key: 'assignedTo',
    title: '当前指派',
    width: 150,
  },
  {
    key: 'finishedBy',
    title: '完成者',
    width: 150,
  },
  {
    key: 'operation',
    slot: 'operation',
    title: '操作',
    width: 150,
    fixed: 'right',
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
      toReqPage,
      pageSize,
      type
    } = obj
    // 请求列表数据

    const params = {
      page: toReqPage,
      limit: pageSize,
      // assignedTo
    }

    const userName = Cookies.get("yfmusername")

    if (type === 'assignedToMe') {
      params.assignedTo = userName
      params.nostatus = 'closed'
    } else if (type === 'createdByMe') {
      params.createdBy = userName
    } else if (type === 'finishedByMe') {
      params.finishedBy = userName
    } else if (type === 'closedByMe') {
      params.closedBy = userName
    } else if (type === 'canceledByMe') {
      params.canceledBy = userName
    }

    const userListRes = await reqeustTaskList.call(this, params)

    const {
      code,
      data
    } = userListRes

    if (pendingId === requestTaskListPendingId) {
      this.tableConfig.loading = false

      if (code === 0) {
        if (data) {
          const {
            list,
            currPage,
            totalCount,
            pageSize
          } = data
          this.tableConfig.data = list || []
          this.tableConfig.page = currPage
          this.tableConfig.totalCount = totalCount
          this.tableConfig.pageSize = pageSize
        }
      }
      this.tableConfig.type = type

      if (type === 'assignedToMe') {
        invokeGetStorysBuild.call(
          this,
          this.computeWaitTask,
          this.computeDoingTask
        )
      }
    }
  },
})

/**
 * 改变等待中的任务状态
 *
 */
async function invokeChangeStatusFromWaitStatus(params) {
  const {
    elData,
    newStatus,
    elOrginStatus
  } = params

  if (newStatus === doing) {
    elData.status = newStatus

    const res = await requestTaskStart({
      id: elData.id,
    })

    if (res.code !== 0) {
      elData.status = elOrginStatus
      this.$Message.error(res.msg)
    }
  }
}
/**
 * 改变等待中的任务状态
 *
 */
async function invokeChangeStatusFromDoing(params) {
  const {
    elData,
    newStatus,
    elOrginStatus
  } = params

  if (newStatus === done) {
    elData.status = newStatus

    const res = await requestTaskDone({
      id: elData.id,
    })

    if (res.code !== 0) {
      elData.status = elOrginStatus
      this.$Message.error(res.msg)
    }
  }
}

/**
 * 请求任务详情并且显示编辑弹窗
 */
const invokeRequestEditTaskDetailsAndShow = makeDebounceFn({
  beforePending(pendingId) {
    requesTaskDetailPendingId = pendingId
    if (!invokeRequestEditTaskDetailsAndShowLoading) {
      invokeRequestEditTaskDetailsAndShowLoading = this.$Message.loading(
        '正在查询中',
        0
      )
    }
  },
  async pending(pendingId, task) {
    if (pendingId === requesTaskDetailPendingId) {
      const {
        id
      } = task

      const res = await requestTaskDetail.call(this, id)

      if (requesTaskDetailPendingId === pendingId) {
        if (res.code === 0) {
          showTaskRecordModalComponent({
            task: res.task,
            onOk: (val) => {
              return requestTaskSignTaskWork.call(this, {
                taskId: id,
                workContent: val.log,
                consumedTime: val.hour,
              })
            },
          })
        }
        invokeRequestEditTaskDetailsAndShowLoading()
        invokeRequestEditTaskDetailsAndShowLoading = undefined
      }
    }
  },
})

function invokeClearOnTaskTimeout() {
  if (this.$options.onTaskTouchMouseDownTimeoutId) {
    clearTimeout(this.$options.onTaskTouchMouseDownTimeoutId)
    this.$options.onTaskTouchMouseDownTimeoutId = undefined
  }
}

/**
 * 添加任务评估审核内容
 *
 * @param {*} task
 * @param {*} record
 */
function invokeAddTaskEvaluateCheckContent(task, record) {
  return new Promise((resolve) => {
    showSecondConfirm.call(this, {
      onCancel() {
        resolve(false)
      },
      onOk: async () => {
        const data = {
          contents: record.content.map((val) => {
            return {
              content: val.content,
              time: Number(val.hour) * 60,
            }
          }),
          planStartTime: record.datePickerVal,
          taskId: task.id,
        }

        const res = await requestAddTaskEvaluateCheckContent.call(this, data)

        if (res.code !== 0) {
          resolve(false)
          this.$Message.error(res.msg)
        }

        resolve()
      },
    })
  })
}

async function invokeGetStorysBuild(
  computeWaitTask = [],
  computeDoingTask = []
) {
  let storyId = []

  if (!computeWaitTask.length || !computeDoingTask.length) {
    return
  }

  storyId = computeWaitTask.map((val) => val.story) || []

  storyId = storyId.concat(computeDoingTask.map((val) => val.story) || [])

  const res = await requestStoryGetStorysBuild.call(
    this,
    Array.from(new Set(storyId)).join()
  )

  if (res.code === 0) {
    this.requestStoryGetStorysBuildRes = res.data
  }
}

export default {

  data() {
    return {
      // 任务状态数组
      taskStatusArr: Object.freeze([wait, doing, done, pause]),
      // 任务显示类型
      taskShowType: 'classicalList', // list ,classicalList
      // 表格配置
      tableConfig: {
        // 列表高度

        tableHeight: undefined,
        loading: false,
        totalCount: 0,
        page: 1,
        pageSize: 10,
        type: 'assignedToMe',
        data: [],
        coloum: tableCol,
      },
      // 拖动任务？
      taskDraging: false,
      // 正在拖动的目标
      taskDragingAim: '',
      // 正在拖动的原始
      taskDragingSource: '',
      // 对应的发版计划列表
      requestStoryGetStorysBuildRes: [],
    }
  },
  taskStatus,
  onTaskTouchMouseDownTimeoutId: undefined,
  startWeekTimestamp: moment().startOf('weeks').valueOf(),
  endWeekTimestamp: moment().endOf('weeks').valueOf(),
  components: {
    TaskTypeSelector,
    SimpleImportantIcon,
  },

  async created() {


    const {
      query
    } = this.$route


    let assignedTo = Cookies.get("yfmusername")
    const limit = 200




    if (!assignedTo) {
      return
    }

    const taskListRes = await reqeustTaskList.call(this, {
      page: 1,
      limit,
      assignedTo,
      nostatus: 'closed',
    })


    let taskList = []
    let totalCount = 0
    const {
      code,
      data
    } = taskListRes
    if (code === 0) {
      taskList = data.list
      totalCount = data.totalCount
    }

    this.tableConfig = {
        tableHeight: undefined,
        loading: false,
        totalCount,
        page: 1,
        pageSize: limit,
        type: 'assignedToMe',
        coloum: Object.freeze(tableCol),
        data: taskList,
      },


      invokeGetStorysBuild.call(this, this.computeWaitTask, this.computeDoingTask)
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.layoutWrapper) {
        this.tableConfig.tableHeight =
          this.$refs.layoutWrapper.$el.clientHeight - 60 - 14 - 48 - 50
      }
    })
  },
  beforeDestroy() {
    requestTaskListPendingId += 1
    requesTaskDetailPendingId += 1
  },
  computed: {
    // 计算正在等待中的任务
    computeWaitTask() {
      return this.tableConfig.data.filter((val) => val.status === wait)
    },
    // 计算正在进行中的任务
    computeDoingTask() {
      return this.tableConfig.data.filter((val) => val.status === doing)
    },
    // 计算已暂停的任务
    computePauseTask() {
      return this.tableConfig.data.filter((val) => val.status === pause)
    },
    // 计算已完成的任务
    computeDoneTask() {
      return this.tableConfig.data.filter((val) => val.status === done)
    },
    // 计算发版任务映射表
    computeTaskBuildMap() {
      const res = {}

      this.requestStoryGetStorysBuildRes.forEach((val) => {
        res[val.story] = val
      })

      return res
    },
  },
  methods: {
    // 映射当前任务是否在发版周期内
    mapStoryIsInBuildSchdule(row) {
      const mapObj = this.computeTaskBuildMap[row.story]
      let res
      if (mapObj) {
        const buildDate = mapObj.buildDate && moment(mapObj.buildDate).valueOf()

        const {
          startWeekTimestamp,
          endWeekTimestamp
        } = this.$options
        res = startWeekTimestamp <= buildDate && buildDate <= endWeekTimestamp
      }

      return res
    },

    // 映射任务状态
    mapTaskStatusConfig(row) {
      return taskStatus.mapObjectByKeyFn(row.status)
    },

    // 映射优先级配置
    mapPriColorConfig(row) {
      if (row.pri) {
        return prior.mapObjectByValueFn(row.pri)
      }
    },

    // 根据任务状态映射任务
    mapClassilcalTask(status) {
      let res = []
      if (status === wait) {
        res = this.computeWaitTask
      } else if (status === doing) {
        res = this.computeDoingTask
      } else if (status === pause) {
        res = this.computePauseTask
      } else if (status === done) {
        res = this.computeDoneTask
      }

      return res
    },

    // 分页器页码发生改变
    onPagnationPageChange(toReqPage) {
      const {
        type,
        pageSize
      } = this.tableConfig
      invokeRequestList.call(this, {
        toReqPage,
        type,
        pageSize,
      })
    },

    // 分页器每页大小发生改变
    onPagnationPageSizeChange(pageSize) {
      let timeoutId = setTimeout(() => {
        const {
          type
        } = this.tableConfig
        invokeRequestList.call(this, {
          toReqPage: 1,
          type,
          pageSize,
        })
        clearTimeout(timeoutId)
        timeoutId = undefined
      }, 0)
    },

    // 点击分类
    onTaskTypeClick(k) {
      let {
        page,
        type
      } = this.tableConfig

      const {
        pageSize
      } = this.tableConfig

      if (k === 'assignedToMe') {
        this.taskShowType = 'classicalList'
      } else {
        this.taskShowType = 'list'
      }

      if (k !== type) {
        page = 1
        type = k
        this.tableConfig.data = []
        this.tableConfig.type = k
        this.tableConfig.loading = true

        this.$nextTick(() => {
          invokeRequestList.call(this, {
            toReqPage: page,
            type,
            pageSize,
          })
        })
      }
    },

    // 点击任务
    onTaskClick(row) {
      const {
        id,
        story,
        project
      } = row
      openNewTab(
        `workspace/projectandtask/task/detail/${id}?story=${story}&project=${project}&hideSlider=1`
      )
    },
    //  图表显示类型发生改变
    onTaskShowTypeChange() {
      let res
      if (this.taskShowType === 'list') {
        res = 'classicalList'
      } else {
        res = 'list'
      }

      this.taskShowType = res
    },

    // 任务完成拖动
    onTaskDrop(e, containerStatus) {
      // const containerStatus = e.target.dataset.status
      const elOrginStatus = e.dataTransfer.getData('status')
      const elIndex = e.dataTransfer.getData('index')
      const elData = this.mapClassilcalTask(elOrginStatus)[elIndex]

      if (containerStatus === elOrginStatus) return

      const params = {
        elOrginStatus,
        elIndex,
        elData,
        newStatus: containerStatus,
      }

      if (elOrginStatus === wait) {
        // 等待中的任务
        invokeChangeStatusFromWaitStatus.call(this, params)
      } else if (elOrginStatus === doing) {
        // 进行中的任务
        invokeChangeStatusFromDoing.call(this, params)
      }
      this.onTaskDragEnd()
    },
    // 开始拖动
    onTaskDragStart(e) {
      const index = e.target.dataset.index
      const status = e.target.dataset.status
      this.taskDragingSource = status
      e.dataTransfer.setData('index', index)
      e.dataTransfer.setData('status', status)
      this.taskDraging = true
    },
    // 拖动完成
    onTaskDragEnd() {
      this.taskDraging = false
      this.taskDragingAim = undefined
      this.taskDragingSource = undefined
    },
    // 拖动进去某一个区块
    onTaskDragEnter(e) {
      const containerStatus = e.target.dataset.status
      if (containerStatus) {
        this.taskDragingAim = containerStatus
      }
    },
    // 任务点击事件
    onTaskTouchMouseDown(e, status) {
      invokeClearOnTaskTimeout.call(this)
      this.$options.onTaskTouchMouseDownTimeoutId = setTimeout(() => {
        if (e.button === 0) {
          this.taskDraging = true
          this.taskDragingAim = this.taskDragingSource = status
        }
        invokeClearOnTaskTimeout.call(this)
      }, 100)
    },
    // 释放点击事件
    onTaskTouchMouseUp(e) {
      this.taskDragingSource = undefined
      this.taskDraging = false
      this.taskDragingAim = undefined
      invokeClearOnTaskTimeout.call(this)
    },
    // 点击（进行中的任务）编辑
    onEditDoingTaskClick(task) {
      invokeRequestEditTaskDetailsAndShow.call(this, task)
    },
    // 点击预估时间
    onEstimeatedTimeClick(task) {
      showSchduleValueInputModal({
        data: task,
        title: '预估时间',
        onOk: invokeAddTaskEvaluateCheckContent.bind(this, task),
      })
    },
  },
}
