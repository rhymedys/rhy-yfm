<template>
  <div>
    <i-button
      class="import-form-btn"
      type="primary"
      @click="$emit('on-add-json-param-click')"
      >导入json</i-button
    >
    <json-tree style="margin-left: 30px" :req-json="reqJson" is-root />
  </div>
</template>

<script>
import json5 from 'json5'
import JsonTree from '../../JsonTree'
import paramsRequired from '~/contants/paramsRequired.js'

// 检查是否是json序列
function invokeCheckIsJsonSchema(json) {
  try {
    json = json5.parse(json)
    if (json.properties && typeof json.properties === 'object' && !json.type) {
      json.type = 'object'
    }
    if (json.items && typeof json.items === 'object' && !json.type) {
      json.type = 'array'
    }
    if (!json.type) {
      return false
    }
    json.type = json.type.toLowerCase()
    const types = ['object', 'string', 'number', 'array', 'boolean', 'integer']
    if (!types.includes(json.type)) {
      return false
    }
    return JSON.stringify(json)
  } catch (e) {
    return false
  }
}

function normalizeReqJson(obj, isRoot, name) {
  let res = []

  if (obj) {
    if (isRoot) {
      const root = {}

      Object.keys(obj).forEach((k) => {
        const val = obj[k]
        if (k !== 'properties') {
          root[k] = val
        } else {
          root.children = normalizeReqJson(val)
        }
      })
      res.push(root)
    } else {
      const keys = Object.keys(obj)
      res = keys.map((k, i) => {
        const child = obj[k]
        const name = keys[i]

        const mapObj = {
          name,
        }

        Object.keys(child).forEach((childK) => {
          const val = child[childK]
          if (childK === 'properties') {
            mapObj.children = normalizeReqJson(val)
          } else {
            mapObj[childK] = val
          }
        })
        return mapObj
      })
    }
  } else {
    res = null
  }

  return res
}

export default {
  name: 'JsonBody',
  // 表单参数是否必须
  formBodyRequired: paramsRequired.value,
  components: {
    JsonTree,
  },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      reqJson: false,
    }
  },
  created() {
    let invokeCheckIsJsonSchemaRes = invokeCheckIsJsonSchema(
      this.info.reqBodyOther
    )

    invokeCheckIsJsonSchemaRes = normalizeReqJson(
      JSON.parse(invokeCheckIsJsonSchemaRes),
      true
    )
    console.log('invokeCheckIsJsonSchemaRes', invokeCheckIsJsonSchemaRes)
    // console.time('normalizeReqJson')
    // console.timeEnd('normalizeReqJson')
    this.reqJson = invokeCheckIsJsonSchemaRes
  },
  // 格式化提交的内容
  normalizeCommitContent(arr, isRoot, beforeRequiredQueue) {
    const res = {
      required: [],
    }
    if (arr) {
      arr.forEach((val) => {
        if (val.required && beforeRequiredQueue) {
          beforeRequiredQueue.push(val.name)
        }

        Object.keys(val).forEach((k) => {
          const currentVal = val[k]
          if (isRoot) {
            if (k === 'children') {
              res.properties = this.normalizeCommitContent(
                currentVal,
                false,
                res.required
              )
            } else if (k !== 'showChildren') {
              res[k] = currentVal
            }
          } else if (val.name) {
            if (!res[val.name]) {
              res[val.name] = {
                required: [],
              }
            }

            const mapVal = res[val.name]
            if (val.type === 'array') {
              this.normalizeArrayObj(
                mapVal,
                val,
                k,
                currentVal,
                mapVal.required
              )
            } else {
              this.normalizeCommonObj(
                mapVal,
                val,
                k,
                currentVal,
                mapVal.required
              )
            }
          }
        })
      })
    }

    return res
  },
  // 非数组类型对象
  normalizeCommonObj(mapVal, val, k, currentVal, beforeRequiredQueue) {
    if (k === 'children') {
      mapVal.properties = this.normalizeCommitContent(
        currentVal,
        false,
        beforeRequiredQueue
      )
    } else if (!['name', 'showChildren', 'localId', 'required'].includes(k)) {
      mapVal[k] = val[k]
    }
  },
  // 数组对象
  normalizeArrayObj(mapVal, val, k, currentVal, beforeRequiredQueue) {
    if (k === 'children') {
      mapVal.items = this.normalizeArrayChildren(currentVal)
    } else if (
      !['name', 'showChildren', 'localId', 'mock', 'required'].includes(k)
    ) {
      mapVal[k] = val[k]
    }
  },
  // 格式化数组类型数据
  normalizeArrayChildren(children) {
    const [val] = children
    const { type, mock, description } = val
    return {
      type,
      mock,
      description,
    }
  },
}
</script>
