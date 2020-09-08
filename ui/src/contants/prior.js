/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-11 22:40:37
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-26 09:38:23
 */

import {
  mapKeyByValue,
  mapValueByKey,
  mapObjectByValue,
  mapObjectByKey,
} from './utils'

const urgent = '1'
const height = '2'
const middle = '3'
const low = '4'

const defValueObj = {}

const value = [
  {
    value: urgent,
    key: '紧急',
    color: 'red',
  },
  {
    value: height,
    key: '高',
    color: 'volcano',
  },
  {
    value: middle,
    key: '中',
    color: 'orange',
  },
  {
    value: low,
    key: '低',
    color: 'cyan',
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
  urgent,
  height,
  middle,
  low,
  value,
}
