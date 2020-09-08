/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-13 16:45:45
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-20 09:26:17
 */

import Vue from 'vue'
import moment from 'moment'
import { requestTaskevaluateitemList } from '../../services/projecttask/taskevaluateitem'
import { requestTaskevaluatecheckCheckTaskEvaluateCheck } from '../../services/projecttask/taskevaluatecheck'
import Component from '.'

const ComponentConstuctor = Vue.extend(Component)

let componentInstance

let pendingId = 0

/**
 *  请求评估详情
 *
 *
 * @param {*} taskEvaluateId
 * @returns
 */
function invokeRequestDetail(taskEvaluateId) {
  return requestTaskevaluateitemList.call(this, {
    page: 1,
    limit: 100,
    taskEvaluateId,
  })
}

function invokeRequestTaskevaluatecheckCheckTaskEvaluateCheck(data) {
  return requestTaskevaluatecheckCheckTaskEvaluateCheck.call(this, data)
}

const index = async (options) => {
  const pId = (pendingId += 1)
  if (!componentInstance) {
    componentInstance = new ComponentConstuctor({})
    componentInstance.vm = componentInstance.$mount()
    document.body.appendChild(componentInstance.vm.$el)
  }

  const vm = componentInstance.vm

  vm.$Message.loading({
    duration: 0,
    content: '正在加载中',
  })

  const res = await invokeRequestDetail.call(options.context, options.row.id)

  if (pId !== pendingId) {
    return
  }

  vm.$Message.destroy()

  if (res.data.code !== 0) {
    vm.$Message.error(res.data.msg)
    return
  }

  vm.visible = true
  vm.$off('on-ok')
  vm.$off('on-cancel')

  vm.content = res.data.page.list
  vm.startDatePickerVal = options.row.planStartTime
  vm.defDatePickerVal = options.row.planStartTime
  vm.endDatePickerVal = moment(options.row.planStartTime)
    .add(options.row.totalTime, 'minutes')
    .format('YYYY-MM-DD HH:mm:ss')
  vm.$on('on-ok', async (val) => {
    vm.loading = true

    let res = await invokeRequestTaskevaluatecheckCheckTaskEvaluateCheck.call(
      options.context,
      {
        ...val,
        taskEvaluateId: options.row.id,
      }
    )

    if (options.onOk) {
      res = options.onOk && (await options.onOk(res))
    }

    if (res !== false) {
      vm.loading = false
      vm.visible = false
      vm.content = []
      vm.defDatePickerVal = undefined
      vm.startDatePickerVal = undefined
      vm.startDatePickerOpen = false
      vm.commentContent = undefined

      vm.endDatePickerVal = undefined
      vm.startDatePickerOpen = false
      vm.endDatePickerOpen = false
    }
    return res
  })

  vm.$on('on-cancel', () => {
    vm.visible = false
    vm.loading = false
    vm.content = []
    vm.defDatePickerVal = undefined
    vm.startDatePickerVal = undefined
    vm.startDatePickerOpen = false
    vm.commentContent = undefined

    vm.endDatePickerVal = undefined
    vm.startDatePickerOpen = false
    vm.endDatePickerOpen = false
  })
}

export default index
