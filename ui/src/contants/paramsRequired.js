/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-11 22:40:37
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-11-14 14:00:35
 */

import { mapKeyByValue, mapValueByKey } from './utils'

const required = '1'
const unRequired = '0'

const defValueObj = {}

const value = [
  {
    value: required,
    key: '必需',
  },
  {
    value: unRequired,
    key: '非必需',
  },
]

const mapValueByKeyFn = mapValueByKey.bind(value, value)

const mapKeyByValueFn = mapKeyByValue.bind(value, value)

export default {
  mapValueByKeyFn,
  mapKeyByValueFn,
  required,
  unRequired,
  value,
}
