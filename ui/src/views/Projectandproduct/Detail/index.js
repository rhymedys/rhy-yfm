/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-11 16:08:59
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-10 16:00:39
 */
import {
  reqeustStoryspecDetail
} from '@/api/projecttask/storyspec'
import {
  requestGetTaskInfoByStoryId
} from '@/api/projecttask/task'
import {
  requestStoryDetail
} from '@/api/projecttask/story'
import taskStatus from '@/contants/taskStatus.js'
import storyStatus from '@/contants/storyStatus.js'
import storyStage from '@/contants/storyStage.js'
import {
  mapImg
} from '@/utils/img'

export default {

  data() {
    return {
      // 需求详情
      storyDetail: {},
      // 需求描述
      storyspec: {},
      // 参与者信息
      storyTaskInfo: {},
      // 其他信息tab  participant：参与者
      extraInfoTab: 'participant',
      // 日志
      logList: [],
      // 请求日志？
      requestLogListPending: false,
      // 是否完成初始化
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
      k: 'plan',
      l: '所属计划',
    },
    {
      k: 'source',
      l: '需求来源',
    },
    {
      k: 'sourceNote',
      l: '来源备注',
    },
    {
      k: 'status',
      l: '当前状态',
      slot: 'status',
    },
    {
      k: 'stage',
      l: '所处阶段',
      slot: 'stage',
    },
    {
      k: 'pri',
      l: '优先级',
    },
    {
      k: 'estimate',
      l: '预计工时',
    },
    {
      k: 'keywords',
      l: '关键词',
    },
    {
      k: 'mailto',
      l: '抄送给',
    },
  ],
  async created() {


    const {
      query
    } = this.$route
    const storyId = query.id

    const storyDetailReq = requestStoryDetail(storyId).catch((e) => {
      return {}
    })

    const storyspecDetailReq = reqeustStoryspecDetail(storyId)
      .catch((e) => {
        return {}
      })

    const getTaskInfosByStoryIdReq = requestGetTaskInfoByStoryId(storyId)
      .catch((e) => {
        return {}
      })

    const [
      storyspecDetailRes,
      getTaskInfosByStoryIdRes,
      storyDetailRes,
    ] = await Promise.all([
      storyspecDetailReq,
      getTaskInfosByStoryIdReq,
      storyDetailReq,
    ])

    let storyDetail = {}
    let storyspec = {}
    let storyTaskInfo = {}


    if (storyDetailRes.code === 0 && storyDetailRes.data) {
      storyDetail = storyDetailRes.data
    }

    if (storyspecDetailRes.code === 0 && storyspecDetailRes.data) {
      storyspec = storyspecDetailRes.data
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

    this.storyspec = storyspec
    this.storyTaskInfo = storyTaskInfo
    this.storyDetail = storyDetail

    this.hadInit =true
  },
  methods: {
    mapTaskStatusConfig(val) {
      return taskStatus.mapObjectByValueFn(val)
    },
    mapStoryStatusConfig(val) {
      return storyStatus.mapObjectByValueFn(val)
    },
    mapStoryStageConfig(val) {
      return storyStage.mapObjectByValueFn(val)
    },
  },
}
