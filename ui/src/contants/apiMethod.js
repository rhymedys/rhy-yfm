/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-11 22:40:37
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-26 09:46:57
 */

import {
  mapKeyByValue,
  mapValueByKey,
  mapObjectByValue,
  mapObjectByKey,
} from './utils'

const post = 'POST'
const get = 'GET'

const defValueObj = {}

const value = [
  {
    value: post,
    key: post,
    color: 'green',
  },
  {
    value: get,
    key: get,
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
  post,
  get,
  value,
}
