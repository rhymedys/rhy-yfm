/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-13 16:45:45
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-11-18 22:03:31
 */

import Vue from 'vue'
import Component from '.'
import { requestInterfacecategorySave } from '~/services/apimgr/interfacecategory'

const ComponentConstuctor = Vue.extend(Component)

let componentInstance

let closeTimeoutId

let wrapperEl

const clearVMTimeout = 10 * 60 * 1000

const closeModal = () => {
  const vm = componentInstance
  vm.visible = false
  vm.formItem = {
    classicalName: '',
    remark: '',
  }
  vm.loading = false
  closeTimeoutId = setTimeout(() => {
    componentInstance = undefined
    document.body.removeChild(wrapperEl)
    clearTimeout(closeTimeoutId)
    closeTimeoutId = undefined
  }, clearVMTimeout)
}

const index = (options) => {
  clearTimeout(closeTimeoutId)
  closeTimeoutId = undefined

  if (!componentInstance) {
    componentInstance = new ComponentConstuctor({})
    componentInstance.vm = componentInstance.$mount()
    wrapperEl = document.createElement('div', {
      id: componentInstance.vm.$options.name,
    })

    document.body.appendChild(wrapperEl)
    wrapperEl.appendChild(componentInstance.vm.$el)
  }

  const vm = componentInstance.vm

  vm.visible = true
  vm.task = options.task

  vm.$off('on-ok')
  vm.$off('on-cancel')

  vm.$on('on-ok', async (val) => {
    const { classicalName, remark } = val
    const { serviceId, context } = options
    const res = await requestInterfacecategorySave.call(context, {
      name: classicalName,
      desc: remark,
      createUserId: '',
      serviceId,
      parentId: -1,
      rootId: -1,
    })
    options.onOk && (await options.onOk(val))

    if (res.data.code === 0) {
      closeModal()
    }
  })

  return closeModal
}

export default index
