/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-13 16:45:45
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-20 18:35:40
 */

import Vue from 'vue'
import Component from '.'

const ComponentConstuctor = Vue.extend(Component)

let componentInstance

const index = (options) => {
  if (!componentInstance) {
    componentInstance = new ComponentConstuctor({})
    componentInstance.vm = componentInstance.$mount()
    document.body.appendChild(componentInstance.vm.$el)
  }

  const vm = componentInstance.vm

  vm.visible = true
  vm.list = options.list
  vm.selVal = options.value

  vm.$off('on-ok')
  vm.$off('on-cancel')

  vm.$on('on-ok', async (val) => {
    vm.loading = false

    vm.selVal = undefined
    ;(await options.onOk) && options.onOk(val)
    vm.visible = false
    vm.list = []
  })

  vm.$on('on-cancel', () => {
    vm.visible = false
    vm.loading = false
    vm.list = []
    vm.selVal = undefined
    options.onCancel && options.onCancel()
    vm.list = []
  })
}

export default index
