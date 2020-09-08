<template>
  <div class="apimgr-interfacecategory-list">
    <div class="header">
      <Input
        class="header__search"
        placeholder="请输入搜索的接口分类"
        search
        @keypress.enter="(e) => $emit('on-search-enter', e)"
        @on-change="(e) => $emit('on-search-change', e)"
      />
      <Button
        class="header__add"
        type="primary"
        @click="$emit('on-add-classical-click')"
        >添加分类</Button
      >
    </div>
    <Tree
      class="tree"
      :data="cmopputeList"
      @on-select-change="(e) => $emit('on-select-change', e)"
      @on-toggle-expand="(e) => $emit('on-toggle-expand', e)"
    />
  </div>
</template>

<script>
import { deepCopyData } from '~/utils'
export default {
  name: 'ApimgrInterfacecategoryList',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  serverCacheKey: (props) => props.list,
  computed: {
    cmopputeList() {
      return this.list.map((val) => {
        val = deepCopyData(val)
        val.title = val.name
        val.label = val.name

        if (val.apis) {
          val.children = val.apis.map((api) => {
            api = deepCopyData(api)
            api.label = api.name
            api.title = api.name
            return api
          })
        }

        return val
      })
    },
  },
}
</script>

<style lang="less" scoped>
.apimgr-interfacecategory-list {
  padding: 10px;
  width: 300px;
  min-width: 300px;
  background: white;
  height: 100%;
  overflow: hidden;
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    &__search {
      margin-right: 10px;
    }
  }

  .tree {
    height: ~'calc(100% - 42px)';
    overflow: auto;
  }
}
</style>
