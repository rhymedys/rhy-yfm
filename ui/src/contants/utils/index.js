/**
 *
 *
 * @export
 * @param {*} list
 */
export function tranArrToValueMap(list) {
  if (!this.valueMap) {
    this.valueMap = {}
    list.forEach((val) => {
      this.valueMap[val.value] = val
    })
  }

  return this.valueMap
}

export function tranArrToKeyMap(list) {
  if (!this.keyMap) {
    this.keyMap = {}
    list.forEach((val) => {
      this.keyMap[val.key] = val
    })
  }
  return this.keyMap
}

/**
 * label 映射 value
 *
 * @export
 * @param {IFromSeriesCommonSelectOption[]} list
 * @param {(string|number)} value
 * @returns
 */
export function mapKeyByValue(list, value) {
  const res = mapObjectByValue.call(this, list, undefined, value)

  return (res && res.key) || value
}

/**
 * value 映射 label
 *
 * @export
 * @param {IFromSeriesCommonSelectOption[]} list
 * @param {string} label
 * @returns
 */
export function mapValueByKey(list, key) {
  const res = mapObjectByKey.call(this, list, undefined, key)

  return (res && res.value) || ''
}

/**
 * 通过value找到配置对象
 *
 * @export
 * @param {IFromSeriesCommonSelectOption[]} list
 * @param {(string | number)} value
 * @returns
 */
export function mapObjectByValue(list, defVal, value) {
  return tranArrToValueMap.call(this, list)[String(value)] || defVal
}

/**
 * 通过label找到配置对象
 *
 * @export
 * @param {IFromSeriesCommonSelectOption[]} list
 * @param {string} label
 * @returns
 */
export function mapObjectByKey(list, defVal, key) {
  return tranArrToKeyMap.call(this, list)[String(key)] || defVal
}
