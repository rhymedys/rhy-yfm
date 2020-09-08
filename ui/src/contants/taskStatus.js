/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-11 17:42:36
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-16 17:25:13
 */

import {
  mapKeyByValue,
  mapValueByKey,
  mapObjectByValue,
  mapObjectByKey,
} from './utils'

const defValueObj = {
  key: '未知',
}

const wait = 'wait'
const doing = 'doing'
const done = 'done'
const pause = 'pause'
const cancel = 'cancel'
const closed = 'closed'

const value = [
  {
    value: wait,
    key: '等待中',
    color: 'magenta',
  },
  {
    value: doing,

    key: '进行中',
    color: 'volcano',
  },
  {
    value: pause,

    key: '已暂停',
    color: 'purple',
  },
  {
    value: done,
    key: '已完成',
    color: 'green',
  },

  {
    value: cancel,

    key: '已取消',
    color: 'blue',
  },
  {
    value: closed,
    key: '已关闭',
    color: 'gold',
  },
]

const mapValueByKeyFn = mapValueByKey.bind(value, value)

const mapKeyByValueFn = mapKeyByValue.bind(value, value)

const mapObjectByValueFn = mapObjectByValue.bind(value, value, defValueObj)

const mapObjectByKeyFn = mapObjectByKey.bind(value, value, defValueObj)

export {
  mapValueByKeyFn,
  mapKeyByValueFn,
  mapObjectByValueFn,
  mapObjectByKeyFn,
  value,
  wait,
  doing,
  done,
  pause,
  cancel,
  closed,
}
export default {
  mapValueByKeyFn,
  mapKeyByValueFn,
  mapObjectByValueFn,
  mapObjectByKeyFn,
  value,
  wait,
  doing,
  done,
  pause,
  cancel,
  closed,
}
