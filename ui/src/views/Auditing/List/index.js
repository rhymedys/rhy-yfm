import moment from 'moment'
import {
  reqeustTaskList,
  requestTaskDetail,
  requestTaskSignTaskWork,
} from '@/api/projecttask/task'
import {
  requestGetTeamDevelops
} from '@/api/projecttask/team'
import {
  requestStoryGetStorysBuild
} from '@/api/projecttask/story'
import {
  makeDebounceFn,
  showSecondConfirm,
  openNewTab
} from '@/utils'
import config from '@/config/index'
import prior from '@/contants/prior'
import AuditingTaskTypeSelector from '@/components/AuditingTaskTypeSelector'
import showTaskRecordModalComponent from '@/components/TaskRecordModal/api'
import showSchduleValueInputModal from '@/components/SchduleValueInputModal/api'
import taskStatus, {
  wait,
  doing,
  pause,
  done
} from '@/contants/taskStatus.js'

import {
  requestAddTaskEvaluateCheckContent
} from '@/api/projecttask/taskevaluatecheck'
import SimpleImportantIcon from '@/components/SimpleImportantIcon'
import Cookies from 'js-cookie'


let requestTaskListPendingId = 0
let requesTaskDetailPendingId = 0
const limit = 200

let invokeRequestEditTaskDetailsAndShowLoading

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


    params.assignedTo = Cookies.get('yfmusername')
    params.nostatus = 'closed'

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

          invokeGetStorysBuild.call(
            this,
            this.computeWaitTask,
            this.computeDoingTask
          )
        }
      }
      this.tableConfig.type = type
    }
  },
})

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
  async asyncData(ctx) {
    let assignedTo = ''

    assignedTo = Cookies.get('yfmusername')

    const requestGetTeamDevelopsRes = await requestGetTeamDevelops.call(ctx, {
      projectId: config.projectId,
    })




    let requestGetTeamDevelopsData = []

    if (
      requestGetTeamDevelopsRes.code === 0 &&
      requestGetTeamDevelopsRes.data
    ) {
      requestGetTeamDevelopsData = requestGetTeamDevelopsRes.data
    }

    if (!assignedTo) {
      const firstPeople = requestGetTeamDevelopsData[0]
      if (!firstPeople) {
        return
      }
      assignedTo = firstPeople.account
    }

    const taskListRes = await reqeustTaskList.call(ctx, {
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
      data: taskList,
    }

    this.requestGetTeamDevelopsData = requestGetTeamDevelopsData

    this.selectedTeamAccount = assignedTo
  },
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
        loading: true,
        totalCount: 0,
        page: 1,
        pageSize: 10,
        type: 'assignedToMe',
        data: [],
      },
      // 人员列表
      requestGetTeamDevelopsData: [],
      // 选中的分类
      selectedTeamAccount: '',
      // 对应的发版计划列表
      requestStoryGetStorysBuildRes: [],
    }
  },
  taskStatus,
  onTaskTouchMouseDownTimeoutId: undefined,
  startWeekTimestamp: moment().startOf('weeks').valueOf(),
  endWeekTimestamp: moment().endOf('weeks').valueOf(),
  components: {
    AuditingTaskTypeSelector,
    SimpleImportantIcon,
  },
  created() {
    Promise.all([
      this.$options.asyncData.call(this, this),
      invokeGetStorysBuild.call(this, this.computeWaitTask, this.computeDoingTask)
    ])
  },
  beforeMount() {

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
    onTaskTypeClick(account) {
      let {
        page
      } = this.tableConfig

      const {
        pageSize
      } = this.tableConfig

      if (this.selectedTeamAccount !== account) {
        page = 1
        this.tableConfig.data = []
        this.tableConfig.loading = true

        this.$router.replace({
          query: {
            account,
          },
        })

        this.selectedTeamAccount = account
        this.$nextTick(() => {
          invokeRequestList.call(this, {
            toReqPage: page,
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
