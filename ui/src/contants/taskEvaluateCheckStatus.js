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

const draft = 'draft'
const wait = 'wait'
const pass = 'pass'
const refuse = 'refuse'

const value = [
  {
    value: draft,
    key: '草稿',
    color: 'magenta',
  },
  {
    value: wait,
    key: '待审核',
    color: 'volcano',
  },
  {
    value: pass,
    key: '通过',
    color: 'green',
  },
  {
    value: refuse,
    key: '已拒绝',
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
  draft,
  wait,
  pass,
  refuse,
}

export default {
  mapValueByKeyFn,
  mapKeyByValueFn,
  mapObjectByValueFn,
  mapObjectByKeyFn,
  value,
  draft,
  wait,
  pass,
  refuse,
}
