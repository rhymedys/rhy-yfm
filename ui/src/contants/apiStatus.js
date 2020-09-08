/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-11 22:40:37
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-26 09:41:00
 */

import {
  mapKeyByValue,
  mapValueByKey,
  mapObjectByValue,
  mapObjectByKey,
} from './utils'

const undone = 'undone'
const done = 'done'

const defValueObj = {}

const value = [
  {
    value: undone,
    key: '未完成',
    color: 'red',
  },
  {
    value: done,
    key: '已完成',
    color: 'blue',
  },
]

const mapValueByKeyFn = mapValueByKey.bind(value, value)

const mapKeyByValueFn = mapKeyByValue.bind(value, value)

const mapObjectByValueFn = mapObjectByValue.bind(value, value, defValueObj)

const mapObjectByKeyFn = mapObjectByKey.bind(value, value, defValueObj)

export default {
  mapValueByKeyFn,
  mapKeyByValueFn,
  mapObjectByValueFn,
  mapObjectByKeyFn,
  undone,
  done,
  value,
}
