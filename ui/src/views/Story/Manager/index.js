/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-11-20 14:49:46
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-09 15:12:12
 */
import moment from 'moment'
import storyProgressStatus, {
  story,
  preDev,
  developing,
  mapKeyByValueFn,
} from '@/contants/storyProgressStatus'
import storyStage from '@/contants/storyStage'

import {
  openNewTab
} from '@/utils'
import {
  requestBoardStoryBoardInfoByProductPlan
} from '@/api/projecttask/board'
import {
  requestStoryUpdateStoryPlanAndQueue,
  requestStoryGetStorysBuild,
} from '@/api/projecttask/story'
import {
  requestPlanDetail
} from '@/api/projecttask/productplan'
import prior from '@/contants/prior'
import SimpleImportantIcon from '@/components/SimpleImportantIcon'

const storyPermissionToMoveStageMap = {
  [storyStage.wait]: 1,
  [storyStage.planned]: 1,
  [storyStage.projected]: 1,
}

function invokeClearOnStoryTimeout() {
  if (this.$options.onStoryTouchMouseDownTimeoutId) {
    clearTimeout(this.$options.onStoryTouchMouseDownTimeoutId)
    this.$options.onStoryTouchMouseDownTimeoutId = undefined
  }
}

/**
 * 格式化ui显示的数据
 *
 * @param {*} data
 * @param {*} aim
 */
function invokeNormalizeClassicalUiData(data, aim, permissionCb) {
  const {
    storyDraging,
    storyDragingAim,
    storyDragingAimIndex,
    mapStoryUiDataByClassical,
    storyDragingSource,
    storyDragingSourceIndex,
  } = this

  const res = data.slice()

  let permission = true

  if (typeof permissionCb === 'function') {
    permission = permissionCb(
      storyDragingSource,
      storyDragingAim,
      storyDragingSourceIndex,
      storyDragingAimIndex
    ).insertQueueRes
  }

  try {
    if (
      permission &&
      storyDraging &&
      storyDragingSource &&
      storyDragingSourceIndex >= 0 &&
      storyDragingAim === aim &&
      storyDragingAimIndex >= 0
    ) {
      if (storyDragingSource === storyDragingAim) {
        const dragingObj = res.splice(storyDragingSourceIndex, 1)
        res.splice(storyDragingAimIndex, 0, dragingObj[0])
      } else {
        let dragingObj = mapStoryUiDataByClassical(storyDragingSource)

        dragingObj = dragingObj && dragingObj[storyDragingSourceIndex]

        dragingObj && res.splice(storyDragingAimIndex, 0, dragingObj)
      }
    }
  } catch (e) {
    console.error('invokeNormalizeUiData error', e)
  }

  return res
}

/**
 * 格式化原始的分类列表数据
 *
 * @param {*} data
 * @returns
 */
function invokeNormalizeClassicalListData(data) {
  let res = []

  if (data) {
    res = data.slice()
  }

  return res
}

/**
 * 检验移动许可
 *
 * @param {*} { source, aim, type }
 * @returns
 */
function invokeCheckMovePermission({
  source,
  sourceIndex,
  aim,
  aimIndex,
  type,
}) {
  let insertQueueRes = false
  let insertRes = false

  const isSame = source && aim && source === aim

  const isSameIndex = aimIndex === sourceIndex

  if (isSame && isSameIndex) {
    return {
      insertQueueRes,
      insertRes,
    }
  }

  if (type === preDev) {
    // 移入预研发库

    const isFromStoryToPreDev = source === story && aim === preDev

    insertQueueRes = isSame || isFromStoryToPreDev
    insertRes = insertQueueRes
  } else if (type === developing) {
    // 移入研发库
    const isFromPreDevToDeveloping = source === preDev && aim === developing
    insertRes = true
    if (sourceIndex >= 0 && isSame) {
      // 1.正在研发的内容不能移动位置
      let data = this.mapStoryOrginDataByClassical(source)
      data = data[sourceIndex]

      if (data) {
        insertQueueRes = storyPermissionToMoveStageMap[data.stage]
      } else {
        insertQueueRes = true
      }
    } else if (isFromPreDevToDeveloping) {
      insertQueueRes = true
    }

    if (insertQueueRes && aimIndex >= 0) {
      // 2.移动的内容是否插队正在研发的前面
      let aimOrginData = this.mapStoryOrginDataByClassical(developing)
      aimOrginData = aimOrginData[aimIndex]

      if (aimOrginData) {
        insertQueueRes = storyPermissionToMoveStageMap[aimOrginData.stage]
      } else {
        insertQueueRes = true
      }
    }
  }

  return {
    insertQueueRes,
    insertRes,
  }
}

/**
 * 更新调整UI后的数据
 *
 * @param {*} {
 *   source, 移除库
 *   sourceIndex, 移除库索引
 *   aim, 移入库
 *   aimIndex, 移入库索引
 *   data 数据
 * }
 */
function invokeUpdateLocalStoryPlanIdAndSort({
  source,
  sourceIndex,
  aim,
  aimIndex,
  data,
}) {
  data.plan = invokeMapProductPlanId(aim)
  let newAimArr = []

  if (source !== aim) {
    // 移除原始库
    const sourceArr = this.mapStoryOrginDataByClassical(source)
    sourceArr.splice(sourceIndex, 1)
    const orginAimArr = this.mapStoryOrginDataByClassical(aim)
    if (orginAimArr.length && aimIndex >= 0) {
      // 移入库 是有数据的
      orginAimArr.splice(aimIndex, 0, data)
      newAimArr = orginAimArr
    } else {
      // 移入库没有数据
      newAimArr.push(data)
    }
  } else {
    newAimArr = this.mapStoryUiDataByClassical(aim)
  }

  if (aim === preDev) {
    this.preDevRes = newAimArr
  } else if (aim === developing) {
    this.developingRes = newAimArr
  }
}

/**
 * 建立 storyId 的需求map
 *
 * @param {*} data
 */
function invokeBuildClassicalListDataMapByStoryId(data) {
  const res = {}

  if (data.data) {
    const {
      projecteds = [], developings = [], developeds = []
    } = data.data

    const buildFn = (map, arr) => {
      arr.forEach((val) => {
        map[String(val.storyId)] = val
      })
    }

    buildFn(res, projecteds)
    buildFn(res, developings)
    buildFn(res, developeds)
  }

  return res
}

function invokeNormlizeInitCbData(data, planDetail) {
  let res = []
  const dataMap = invokeBuildClassicalListDataMapByStoryId.call(this, data)

  const order = planDetail.data && planDetail.data.order
  if (order) {
    const orderArr = order.split(',')

    // eslint-disable-next-line no-unmodified-loop-condition
    while (orderArr && orderArr.length) {
      const val = dataMap[String(orderArr.shift())]
      val && res.push(val)
    }
  } else {
    res = Object.values(dataMap)
  }

  return res
}

/**
 * 映射planId
 *
 * @param {*} type
 * @returns
 */
function invokeMapProductPlanId(type) {
  let res

  if (type === story) {
    res = '382'
  } else if (type === preDev) {
    res = '434'
  } else if (type === developing) {
    res = '432'
  }

  return res
}

async function invokeRequestStoryBuildData() {
  const {
    storyRes,
    preDevRes,
    developingRes
  } = this

  const mapStoryIdFn = (arr) => {
    return arr.map((val) => val.storyId)
  }

  const storyIds = mapStoryIdFn(storyRes)
    .concat(mapStoryIdFn(preDevRes), mapStoryIdFn(developingRes))
    .join()

  const res = await requestStoryGetStorysBuild.call(this, storyIds)

  if (res.code === 0) {
    res.data.forEach((val) => {
      this.storyBuildMap[String(val.story)] = Object.freeze(val)
    })
  }
}

/**
 * 初始化数据请求
 *
 * @returns
 */
function invokeRequestInitData(ctx) {
  const storyPlanId = invokeMapProductPlanId(story)
  const preDevPlanId = invokeMapProductPlanId(preDev)
  const developingPlanId = invokeMapProductPlanId(developing)

  // 格式化数据
  const normalizeCb = ([
    storyRes,
    preDevRes,
    developingRes,
    storyPlanRes,
    preDevPlanRes,
    developingPlanRes,
  ]) => {
    storyRes = invokeNormlizeInitCbData.call(ctx, storyRes, storyPlanRes)

    preDevRes = invokeNormlizeInitCbData.call(
      ctx,
      preDevRes,
      preDevPlanRes
    )

    developingRes = invokeNormlizeInitCbData.call(
      ctx,
      developingRes,
      developingPlanRes
    )

    return {
      storyRes,
      preDevRes,
      developingRes,
    }
  }



  return Promise.all([
      // 需求
      requestBoardStoryBoardInfoByProductPlan({
        productPlanId: storyPlanId,
      }),
      // 预研发
      requestBoardStoryBoardInfoByProductPlan({
        productPlanId: preDevPlanId,
      }),
      // 研发
      requestBoardStoryBoardInfoByProductPlan({
        productPlanId: developingPlanId,
      }),
      // 需求
      requestPlanDetail(storyPlanId),
      // 预研发
      requestPlanDetail(preDevPlanId),
      // 研发
      requestPlanDetail(developingPlanId),
    ])
    .then(normalizeCb)
}

export default {
  name: 'Manager',
  classical: [story, preDev, developing],
  components: {
    SimpleImportantIcon,
  },
  storyProgressStatus,
  onStoryTouchMouseDownTimeoutId: undefined,
  startWeekTimestamp: moment().startOf('weeks').valueOf(),
  endWeekTimestamp: moment().endOf('weeks').valueOf(),
  async created() {

    // 需求库，预研发库，研发库。
    const {
      storyRes,
      preDevRes,
      developingRes
    } = await invokeRequestInitData(
      this,
    )

    await invokeRequestStoryBuildData.call(this)

    this.storyRes = storyRes
    this.preDevRes = preDevRes
    this.developingRes = developingRes
    this.loading = false
  },
  data() {
    return {
      // 拖动任务？
      storyDraging: false,
      // 正在拖动的目标
      storyDragingAim: '',
      // 正在拖动目标索引
      storyDragingAimIndex: undefined,
      // 正在拖动的原始
      storyDragingSource: '',
      // 正在拖动的原始索引
      storyDragingSourceIndex: undefined,
      // 需求库模块数据
      storyRes: [],
      // 预研发库模块数据
      preDevRes: [],
      // 研发库模块数据
      developingRes: [],
      // 正在加载页面中
      loading: true,
      //  发版计划map映射
      storyBuildMap: {},
    }
  },
  computed: {
    // 计算需求库的内容
    computeStoryList() {
      return invokeNormalizeClassicalListData.call(this, this.storyRes)
    },
    // 计算预研发库的内容
    computePreDev() {
      return invokeNormalizeClassicalListData.call(this, this.preDevRes)
    },
    // 计算研发库的内容
    computeDeveloping() {
      return invokeNormalizeClassicalListData.call(this, this.developingRes)
    },
    // 计算预研发库的内容ui数据
    computePreDevUiData() {
      return invokeNormalizeClassicalUiData.call(
        this,
        this.computePreDev,
        preDev,
        () => {
          const {
            storyDragingSource,
            storyDragingSourceIndex,
            storyDragingAim,
            storyDragingAimIndex,
          } = this
          return invokeCheckMovePermission.call(this, {
            source: storyDragingSource,
            sourceIndex: storyDragingSourceIndex,
            aim: storyDragingAim,
            aimIndex: storyDragingAimIndex,
            type: preDev,
          })
        }
      )
    },
    // 计算研发库的内容ui数据
    computeDevelopingUiData() {
      return invokeNormalizeClassicalUiData.call(
        this,
        this.computeDeveloping,
        developing,
        () => {
          const {
            storyDragingSource,
            storyDragingAim,
            storyDragingSourceIndex,
            storyDragingAimIndex,
          } = this

          return invokeCheckMovePermission.call(this, {
            source: storyDragingSource,
            sourceIndex: storyDragingSourceIndex,
            aim: storyDragingAim,
            aimIndex: storyDragingAimIndex,
            type: developing,
          })
        }
      )
    },
  },
  methods: {
    // 映射当前任务是否在发版周期内
    mapStoryIsInBuildSchdule(story, classical) {
      if (classical !== developing) {
        return
      }

      const mapObj = this.storyBuildMap[story.storyId]
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
    // 映射优先级配置
    mapPriColorConfig(row) {
      let res = {}
      if (row.pri !== undefined) {
        res = prior.mapObjectByValueFn(row.pri)
      }

      return res
    },
    // 根据分类映射ui数据
    mapStoryUiDataByClassical(classical) {
      let res = []

      if (classical === story) {
        res = this.computeStoryList
      } else if (classical === preDev) {
        res = this.computePreDevUiData
      } else if (classical === developing) {
        res = this.computeDevelopingUiData
      }

      return res
    },
    // 根据分类映射原始数据
    mapStoryOrginDataByClassical(classical) {
      let res = []

      if (classical === story) {
        res = this.storyRes
      } else if (classical === preDev) {
        res = this.preDevRes
      } else if (classical === developing) {
        res = this.developingRes
      }

      return res
    },
    // 点击详情
    onStoryDetailClick(item) {
      openNewTab(`story/detail/${item.storyId}`)
    },

    // 需求完成拖动
    async onStoryDrop(e, containerClassical) {
      if (containerClassical === story) {
        // 需求库不做任何修改
        return
      }

      const classical = e.dataTransfer.getData('classical')
      const elIndex = e.dataTransfer.getData('index')
      const elData = this.mapStoryOrginDataByClassical(classical)[elIndex]
      const {
        storyDragingAimIndex,
        storyDragingSourceIndex,
        storyDragingAim,
      } = this

      const movePermission = invokeCheckMovePermission.call(this, {
        source: classical,
        sourceIndex: elIndex,
        aim: containerClassical,
        aimIndex: storyDragingAimIndex,
        type: containerClassical,
      })

      let insertIndex = 0

      if (!movePermission.insertRes) {
        return
      }

      let storyIds = ''
      let sortQueue = this.mapStoryUiDataByClassical(containerClassical)
        .map((val) => val.storyId)
        .join(',')
      const isSameSource = containerClassical === classical
      let needWarn = false

      if (isSameSource) {
        // 同源与同须
        insertIndex = storyDragingAimIndex
      } else {
        // 改变需求计划
        storyIds = String(elData.storyId)
        insertIndex = storyDragingAimIndex
        needWarn = true
      }

      if (!movePermission.insertQueueRes) {
        // 不允许插队
        insertIndex = this.mapStoryOrginDataByClassical(storyDragingAim).length
        sortQueue = `${sortQueue},${storyIds}`
      }

      if (needWarn) {
        await new Promise((resolve) => {
          const sourceKey = mapKeyByValueFn(classical)
          const aimKey = mapKeyByValueFn(containerClassical)
          let content = `是否确认将需求【${elData.title}】从【${sourceKey}】移到【${aimKey}】`
          if (insertIndex > 0) {
            content += `第【${
              Number(insertIndex) + 1
            }】的位置，该操作将改变原先排序！`
          }
          this.$Modal.confirm({
            title: '是否确认',
            content,
            onOk: () => {
              resolve()
            },
          })
        })
      }

      // 更新数据到服务器
      const params = {
        fromProductPlanId: invokeMapProductPlanId.call(this, classical),
        toProductPlanId: invokeMapProductPlanId.call(this, containerClassical),
        storyIds,
        sortQueue,
      }

      requestStoryUpdateStoryPlanAndQueue.call(this, params)

      // 本地更新列表数据
      invokeUpdateLocalStoryPlanIdAndSort.call(this, {
        source: classical,
        sourceIndex: storyDragingSourceIndex,
        aim: containerClassical,
        aimIndex: insertIndex,
        data: elData,
      })
      // 释放拖拉事件
      this.onStoryDragEnd()
    },
    // 开始拖动
    onStoryDragStart(e) {
      const {
        index,
        classical
      } = e.target.dataset
      e.dataTransfer.setData('index', index)
      e.dataTransfer.setData('classical', classical)
      this.storyDragingSource = classical
      this.storyDragingSourceIndex = index
      this.storyDragingAim = classical
      this.storyDraging = true
    },
    // 拖动完成
    onStoryDragEnd() {
      this.storyDraging = false

      this.storyDragingAim = undefined
      this.storyDragingAimIndex = undefined
      this.storyDragingSource = undefined
      this.storyDragingSourceIndex = undefined
    },
    // 拖动进去某一个区块
    onStoryDragEnter(e) {
      this.onStoryDragOver(e)
    },
    //  当某被拖动的对象在容器范围内拖动时触发此事件
    onStoryDragOver(e) {
      const liTarget = e.path.find(
        (val) => val.dataset && val.dataset.type === 'item'
      )

      if (!liTarget) {
        return
      }

      const {
        classical
      } = liTarget.dataset
      const {
        index
      } = liTarget.dataset
      // index = Nuindex)

      if (classical && index >= 0) {
        if (this.storyDragingAim !== classical) {
          this.storyDragingAim = classical
        }

        if (this.storyDragingAimIndex !== index) {
          this.storyDragingAimIndex = index
        }
      }
    },
    // 需求点击事件
    onStoryTouchMouseDown(e, classical) {
      // invokeClearOnStoryTimeout.call(this)
      // this.$options.onStoryTouchMouseDownTimeoutId = setTimeout(() => {
      //   // if (e.button === 0) {
      //   //   this.storyDragingAim = this.storyDragingSource = classical
      //   //   this.storyDragingAimIndex = this.storyDragingSourceIndex =
      //   //     e.target.dataset.index
      //   //   this.taskDraging = true
      //   // }
      //   // invokeClearOnStoryTimeout.call(this)
      // }, 100)
    },
    // 释放点击事件
    onStoryTouchMouseUp(e) {
      invokeClearOnStoryTimeout.call(this)

      this.storyDraging = false
      this.storyDragingSource = undefined
      this.storyDragingSourceIndex = undefined
      this.storyDragingAim = undefined
      this.storyDragingAimIndex = undefined
    },
  },
}
