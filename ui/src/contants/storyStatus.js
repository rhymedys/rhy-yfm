/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-19 15:22:26
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-10-21 14:04:02
 */

// ,’changed’,’active’,’draft’,’closed’

import {
  mapKeyByValue,
  mapValueByKey,
  mapObjectByValue,
  mapObjectByKey,
} from './utils'

const defValueObj = {
  key: '未知',
}

const changed = 'changed'
const active = 'active'
const draft = 'draft'
const closed = 'closed'

const value = [
  {
    value: '',
    key: '全部',
  },
  {
    value: changed,
    key: '变更',
    color: 'magenta',
  },
  {
    value: active,
    key: '激活',
    color: 'volcano',
  },
  {
    value: draft,
    key: '草稿',
    color: 'purple',
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
  changed,
  active,
  draft,
  closed,
}
export default {
  mapValueByKeyFn,
  mapKeyByValueFn,
  mapObjectByValueFn,
  mapObjectByKeyFn,
  value,
  changed,
  active,
  draft,
  closed,
}
