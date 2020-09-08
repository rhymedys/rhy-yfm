/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-13 16:45:45
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-08-20 19:41:02
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

  const componentHeight = 500
  const componentWidth = 300
  vm.visible = true

  const { boardData, classical, x, y, onMouseMove, onMouseOut } = options
  vm.left = x - componentWidth

  const bodyElOffsetHeight = document.body.offsetHeight
  const containerTop = 64

  let top

  const halfOfComponentHeight = componentHeight / 2

  vm.$off('mousemove')
  vm.$off('mouseout')

  onMouseMove && vm.$on('mousemove', onMouseMove)
  onMouseOut && vm.$on('mouseout', onMouseOut)

  if (y + halfOfComponentHeight > bodyElOffsetHeight) {
    top = bodyElOffsetHeight - componentHeight
  } else if (y - halfOfComponentHeight < containerTop) {
    top = containerTop
  } else {
    top = y - halfOfComponentHeight
  }
  vm.top = top
  vm.boardData = boardData || {}
  vm.classical = classical
}

const hide = () => {
  if (componentInstance) {
    const vm = componentInstance.vm
    vm.visible = false
    vm.boardData = {}
    vm.classical = undefined
    vm.top = undefined
    vm.left = undefined
    vm.$off('mousemove')
    vm.$off('mouseout')
  }
}

export default {
  show,
  hide,
}
