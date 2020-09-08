/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-19 15:22:26
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-11-28 21:22:33
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
const planned = '’planned'
const projected = 'projected'
const developing = 'developing'
const developed = 'developed'
const testing = 'testing'
const tested = 'tested'
const verified = 'verified'
const released = 'released'
const closed = 'closed'

const value = [
  {
    value: wait,
    key: '等待中',
    color: 'magenta',
  },
  {
    value: planned,
    key: '计划中',
    color: 'red',
  },
  {
    value: projected,
    key: '已立项',
    color: 'volcano',
  },
  {
    value: developing,
    key: '开发中',
    color: 'orange',
  },
  {
    value: developed,
    key: '完成开发',
    color: 'gold',
  },
  {
    value: testing,

    key: '测试中',
    color: 'yellow',
  },
  {
    value: tested,
    key: '已测试',
    color: 'lime',
  },
  {
    value: verified,
    key: '校验中',
    color: 'green',
  },
  {
    value: released,
    key: '已发布',
    color: 'cyan',
  },
  {
    value: closed,
    key: '已关闭',
    color: 'blue',
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
  planned,
  projected,
  developing,
  developed,
  testing,
  tested,
  verified,
  released,
  closed,
}
export default {
  mapValueByKeyFn,
  mapKeyByValueFn,
  mapObjectByValueFn,
  mapObjectByKeyFn,
  value,
  wait,
  planned,
  projected,
  developing,
  developed,
  testing,
  tested,
  verified,
  released,
  closed,
}
