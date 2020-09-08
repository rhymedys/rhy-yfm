/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-13 16:45:45
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-08-22 16:25:40
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
  vm.task = options.task
  vm.$off('on-ok')
  vm.$off('on-cancel')

  vm.$on('on-ok', async (val) => {
    vm.loading = true
    const res = options.onOk && (await options.onOk(val))
    vm.loading = false
    vm.$refs.hourRef.currentValue = 1
    vm.$refs.logRef.$refs.textarea.value = ''
    vm.visible = false
    return res
  })

  vm.$on('on-cancel', () => {
    vm.$refs.hourRef.currentValue = 1
    vm.$refs.logRef.$refs.textarea.value = ''
    vm.visible = false
    vm.loading = false
  })
}

export default index
