/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-13 16:45:45
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-08-22 16:19:27
 */

import Vue from 'vue'
import Component from '.'

const ComponentConstuctor = Vue.extend(Component)

let componentInstance

const show = (options) => {
  if (!componentInstance) {
    componentInstance = new ComponentConstuctor({})
    componentInstance.vm = componentInstance.$mount()
    document.body.appendChild(componentInstance.vm.$el)
  }

  const vm = componentInstance.vm

  const componentWidth = 80

  const { x, y, onMouseMove, onMouseOut, title } = options

  if (!title) {
    return
  }

  vm.left = x + componentWidth

  const top = y

  vm.$off('mousemove')
  vm.$off('mouseout')

  onMouseMove && vm.$on('mousemove', onMouseMove)
  onMouseOut && vm.$on('mouseout', onMouseOut)

  vm.top = top
  vm.title = title

  vm.visible = true
}

const hide = () => {
  if (componentInstance) {
    const vm = componentInstance.vm
    vm.visible = false
    vm.top = undefined
    vm.left = undefined
    vm.title = ''
    vm.$off('mousemove')
    vm.$off('mouseout')
  }
}

export default {
  show,
  hide,
}
