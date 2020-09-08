/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-19 15:22:26
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-11-25 17:45:31
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

const story = 'story'
const preDev = 'predev'
const developing = 'developing'

const value = [
  {
    value: '',
    key: '全部',
  },
  {
    value: story,
    key: '需求库',
  },
  {
    value: preDev,
    key: '预研发库',
  },
  {
    value: developing,
    key: '研发库 ',
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
  story,
  preDev,
  developing,
}
export default {
  mapValueByKeyFn,
  mapKeyByValueFn,
  mapObjectByValueFn,
  mapObjectByKeyFn,
  value,
  story,
  preDev,
  developing,
}
