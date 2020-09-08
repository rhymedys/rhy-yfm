/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-13 16:45:45
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-02 15:48:49
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
  vm.$off('on-ok')
  vm.$off('on-cancel')

  vm.title = options.title

  vm.$on('on-ok', async (val) => {
    vm.loading = true
    const res = options.onOk && (await options.onOk(val))

    if (res !== false) {
      vm.loading = false
      vm.visible = false
      vm.content = [
        {
          hour: 1,
        },
      ]
      vm.datePickerVal = undefined
      vm.datePickerOpen = false
    }
    return res
  })

  vm.$on('on-cancel', () => {
    vm.visible = false
    vm.loading = false
    vm.content = [
      {
        hour: 1,
      },
    ]
    vm.datePickerVal = undefined
    vm.datePickerOpen = false
  })
}

export default index
