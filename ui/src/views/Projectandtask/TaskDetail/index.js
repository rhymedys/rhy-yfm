/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-11 16:08:59
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-10 15:34:45
 */

import moment from 'moment'
import {
  requestGetTaskInfoByStoryId,
  requestTaskDetail,
} from '@/api/projecttask/task'
import {
  reqeustStoryspecDetail
} from '@/api/projecttask/storyspec'
import {
  reqeustTaskestimateQueryAll
} from '@/api/projecttask/taskestimate'
import taskStatus from '@/contants/taskStatus.js'
import taskType from '@/contants/taskType.js'
import {
  mapImg
} from '@/utils/img'

async function invokeTaskestimateQueryAll() {
  if (!this.logList.length) {
    this.requestLogListPending = true

    const res = await reqeustTaskestimateQueryAll({
      task: this.$route.query.id,
    })

    const {
      code,
      data
    } = res
    if (code === 0 && data) {
      data.forEach((val) => {
        val.date = moment(val.date).format('YYYY-MM-DD HH:mm:ss')
      })
      this.logList = data || []
    }

    this.requestLogListPending = false
  }
}

export default {

  data() {
    return {
      // 任务信息
      task: {},
      // 需求详情
      storyspec: {},
      // 参与者信息
      storyTaskInfo: {},
      // 其他信息tab  participant：参与者
      extraInfoTab: 'participant',
      // 日志
      logList: [],
      // 请求日志？
      requestLogListPending: false,
      // 任务id
      taskId: undefined,
      // 是否初始完成
      hadInit:false
    }
  },
  baseInfoKeyMap: [{
      k: 'project',
      l: '所属项目',
    },
    {
      k: 'module',
      l: '所属模块',
    },
    {
      k: 'story',
      l: '相关需求',
    },
    {
      k: 'assignedTo',
      l: '指派',
    },
    {
      k: 'type',
      l: '任务类型',
      render(val) {
        return (taskType[val] && taskType[val].desc) || '未知'
      },
    },
    {
      k: 'status',
      slot: 'status',
      l: '任务状态',
    },
    {
      k: 'pri',
      l: '优先级',
    },
    {
      k: 'mailto',
      l: '抄送给',
    },
    {
      k: 'openedDate',
      l: '创建时间',
    },
  ],

  async created() {


    const {
      query
    } = this.$route


    this.taskId = query.id

    const taskDetailReq = requestTaskDetail(query.id).catch((e) => {
      return {}
    })

    const storyDetailReq = reqeustStoryspecDetail(query.story)
      .catch((e) => {
        return {}
      })

    const getTaskInfosByStoryIdReq = requestGetTaskInfoByStoryId(query.story)
      .catch((e) => {
        return {}
      })

    const [
      taskDetailRes,
      storyDetailRes,
      getTaskInfosByStoryIdRes,
    ] = await Promise.all([
      taskDetailReq,
      storyDetailReq,
      getTaskInfosByStoryIdReq,
    ])

    let task = {}
    let storyspec = {}
    let storyTaskInfo = {}


    if (taskDetailRes.code === 0 && taskDetailRes.data) {
      task = taskDetailRes.data
    }

    if (storyDetailRes.code === 0 && storyDetailRes.data) {
      storyspec = storyDetailRes.data
      if (storyspec.spec) {
        storyspec.spec = mapImg(storyspec.spec)
      }
    }

    if (
      getTaskInfosByStoryIdRes.code === 0 &&
      getTaskInfosByStoryIdRes.storyTaskInfo
    ) {
      storyTaskInfo = getTaskInfosByStoryIdRes.storyTaskInfo
    }

    this.task = task
    this.storyspec = storyspec
    this.storyTaskInfo = storyTaskInfo
    this.hadInit = true


    document.title = this.task.name
  },

  methods: {
    mapTaskStatusConfig(val) {
      return taskStatus.mapObjectByValueFn(val)
    },
    onExtraInfoTabClick(val) {
      if (val === 'log') {
        // 日志
        invokeTaskestimateQueryAll.call(this)
      }
      this.extraInfoTab = val
    },
  },
}
