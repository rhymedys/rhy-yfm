<template>
  <div class="json-tree">
    <row
      v-for="(item, i) of reqJson"
      :key="`${index}-${item.id || item.name || item.localId || i}`"
      :gutter="2"
      type="flex"
      class="jsonbody"
      justify="start"
    >
      <!-- 参数名 -->
      <i-col span="8" :style="nameStyle" class="jsonbody__name">
        <div>
          <icon
            v-if="mapIsArrayOrObject(item)"
            size="25"
            class="expand"
            :type="
              item.showChildren ? 'md-arrow-dropdown' : 'md-arrow-dropright'
            "
            @click.native="onHideOrShowClick(item)"
          />

          <i-input
            v-if="!mapIsRootNode(item)"
            v-model="item.name"
            placeholder="name"
            :disabled="mapNameDisabled()"
          />

          <i-input
            v-if="mapIsRootNode(item)"
            value="root"
            placeholder="name"
            disabled
          />
        </div>
      </i-col>
      <!-- 必须？ -->
      <i-col span="2">
        <i-select
          v-model="item.required"
          class="jsonbody__require"
          :disabled="mapRequriedDisabled()"
        >
          <i-option
            v-for="required of $options.formBodyRequired"
            :key="required.value"
            :value="required.value"
            >{{ required.key }}</i-option
          >
        </i-select>
      </i-col>
      <!-- 类型 -->
      <i-col span="3">
        <i-select
          :value="item.type"
          class="jsonbody__schemaType"
          placeholder="mock"
          @on-change="(v) => onTypeChange(v, item, index)"
        >
          <i-option
            v-for="schemaType of $options.schemaType"
            :key="schemaType"
            :value="schemaType"
            >{{ schemaType }}</i-option
          >
        </i-select>
      </i-col>
      <!-- mock -->
      <i-col span="3">
        <i-select
          :value="(item.mock && item.mock.mock) || ''"
          class="jsonbody__mock"
          :disabled="mapIsArrayOrObject(item)"
          @on-change="(v) => onMockSelectChange(v, item, index)"
        >
          <i-option
            v-for="mockItem of $options.mockSource"
            :key="mockItem.mock"
            :value="mockItem.mock"
            >{{ mockItem.mock }}</i-option
          >
        </i-select>
      </i-col>
      <!-- 备注 -->
      <i-col span="4">
        <i-input
          v-model="item.description"
          type="textarea"
          :autosize="{ minRows: 1 }"
          placeholder="备注"
        />
      </i-col>
      <!-- 操作区 -->
      <i-col span="3" class="jsonbody__remove">
        <icon
          v-if="mapShowAddBtn(item)"
          type="ios-add-circle"
          color="#2d8cf0"
          size="20"
          @click.native="onAddClick(item)"
        />
        <icon
          v-if="!mapIsRootNode(item)"
          type="md-close-circle"
          color="red"
          size="20"
          @click.native="onRemoveClick(i)"
        />
      </i-col>
      <!-- 子节点 -->
      <div v-show="item.showChildren" class="children-area">
        <json-tree
          v-show="item.children"
          :index="index + 1"
          :req-json="item.children"
          :parent-node="item"
          :name-style="computeChildrenAreaStyle"
        />
      </div>
    </row>
  </div>
</template>

<script>
import Vue from 'vue'
import { dataTpl, schemaType } from '~/utils/apiSchme.js'
import { deepCopyData } from '~/utils'
import paramsRequired from '~/contants/paramsRequired.js'
import variable from '~/contants/variable.js'

let localId = 1001

export default {
  name: 'JsonTree',
  formBodyRequired: paramsRequired.value,
  mockSource: variable.mockSource,
  schemaType,
  props: {
    reqJson: {
      type: Array,
      default: () => [],
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    nameStyle: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Object,
      default: '',
    },
    parentNode: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    computeChildrenAreaStyle() {
      const res = {
        'padding-left': `${(this.index + 2) * 20}px`,
      }
      return res
    },
  },
  methods: {
    mapShowAddBtn(item, i) {
      let res = false

      const hadChildren = item.children && item.children.length

      if (item.type === 'array' && !hadChildren) {
        res = true
      } else if (item.type === 'object') {
        res = true
      } else if (!this.isRoot && this.parentNode.type !== 'array') {
        res = true
      }

      return res
    },
    mapIsRootNode(item) {
      return !!item.$schema || this.isRoot
    },
    mapIsArrayOrObject(item) {
      return ['array', 'object'].includes(item.type)
    },
    // 映射数组类型的 参数名字能不能填
    mapNameDisabled() {
      return this.parentNode.type === 'array'
    },
    // 映射数组类型的 必须能不能填
    mapRequriedDisabled() {
      return this.parentNode.type === 'array' || this.isRoot
    },
    // 删除结点
    onRemoveClick(i) {
      this.reqJson.splice(i, 1)
    },
    // 添加结点
    onAddClick(item) {
      const isAddCurrentNodeChildren =
        item.type === 'object' || item.type === 'array'

      const hadChildren = item.children && item.children.length

      if (item.type === 'array' && hadChildren) {
        // 数组只增添一个
        return
      }

      const newParam = deepCopyData(dataTpl.reqParams)
      localId += 1
      newParam.localId = localId
      newParam.name = `field_${localId}`
      if (isAddCurrentNodeChildren) {
        if (!item.children) {
          Vue.set(item, 'children', [])
        }
        Vue.set(item, 'showChildren', true)
        item.children.push(newParam)
      } else {
        this.parentNode.children.push(newParam)
        this.parentNode.showChildren = true
      }
    },
    // 点击显示或隐藏对象
    onHideOrShowClick(item) {
      if (item.type === 'object' || item.type === 'array') {
        if (item.showChildren) {
          Vue.set(item, 'showChildren', false)
        } else {
          Vue.set(item, 'showChildren', true)
        }
      }
    },
    // mock选择器发生改变
    onMockSelectChange(v, item) {
      if (!item.mock) {
        Vue.set(item, 'mock', {
          mock: v,
        })
      } else {
        item.mock.mock = v
      }
    },
    // 类型发生改变
    onTypeChange(v, item) {
      item.type = v

      if (v !== 'array' || v !== 'object') {
        delete item.children
        if (item.mock) {
          item.mock.mock = ''
        }
        item.showChildren = false
      }
    },
  },
}
</script>
