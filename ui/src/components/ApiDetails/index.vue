<template>
  <div class="api-details">
    <Tabs :value="selectedTabValue" @on-click="onTabClick">
      <TabPane label="预览" name="preview" />
      <TabPane label="编辑" name="edit" />
      <TabPane label="运行" name="run" />
      <TabPane label="期望" name="mock" />
    </Tabs>

    <preview v-show="selectedTabValue === 'preview'" :info="info" />
    <edit
      v-show="selectedTabValue === 'edit'"
      :info="info"
      :classical="classical"
    />
  </div>
</template>

<script>
import Preview from './Preview'
import Edit from './Edit'
export default {
  name: 'ApiDetails',
  components: {
    Preview,
    Edit,
  },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
    classical: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedTabValue: 'preview',
    }
  },
  watch: {
    info(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedTabValue = 'preview'
      }
    },
  },
  methods: {
    // 点击选项卡
    onTabClick(selectedTabValue) {
      this.selectedTabValue = selectedTabValue
    },
  },
}
</script>

<style lang="less" scoped>
.api-details {
  margin-left: 10px;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background: white;
  padding: 10px;
}
</style>
