<template>
  <div class="apimgr-list" data-component-apimgr-list>
    <span class="add">
      <Button type="primary" @click.native="$emit('on-add-project-click')">
        添加应用
      </Button>
    </span>
    <Spin v-if="tableConfig.loading" class="apimgr-loading" />
    <div v-show="!tableConfig.loading" class="apimgr-content">
      <div
        v-for="(item, i) of tableConfig.data"
        :key="item.id"
        class="api__item"
        @click="$emit('on-item-click', item)"
        @mousemove="onItemMousEnter(i)"
        @mouseout="onItemMouseOut(i)"
      >
        <Card>
          <div style="api__item_content">
            <Avatar
              class="mavatar"
              style="
                width: 100px;
                height: 100px;
                line-height: 100px;
                border-radius: 50px;
                margin-bottom: 10px;
              "
              :style="mapAvatarStyle(item, i)"
              icon="ios-settings-outline"
            />
            <h3>{{ item.name }}</h3>
            <span
              class="operation"
              :style="{ visibility: showOperationIndex === i ? '' : 'hidden' }"
            >
              <a @click.prevent.stop="$emit('on-edit-project-click', item)">
                编辑
              </a>
            </span>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
const tagColor = [
  '#722ed1',
  '#eb2f96',
  '#f5222d',
  '#fa541c',
  '#13c2c2',
  '#1890ff',
  '#2f54eb',
  '#722ed1',
]

export default {
  name: 'ApimgrApplicationList',
  props: {
    tableConfig: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showOperationIndex: -1,
    }
  },
  methods: {
    mapAvatarStyle(item, i) {
      const res = {}

      const index = i % tagColor.length

      res.background = tagColor[index]

      return res
    },
    onItemMousEnter(i) {
      this.showOperationIndex = i
    },
    onItemMouseOut() {
      this.showOperationIndex = -1
    },
  },
}
</script>
<style lang="less" scoped>
.apimgr-list {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100%;
  .add {
    margin-bottom: 10px;
  }

  .apimgr-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
  }
  .apimgr-content {
    box-sizing: border-box;
    overflow: auto;
    .api__item {
      box-sizing: border-box;
      width: 16.66666667%;
      text-align: center;
      margin-bottom: 10px;
      padding-right: 10px;
      padding-left: 10px;
      padding-bottom: 10px;
      float: left;
      &_content {
        text-align: center;
      }

      .operation {
        margin-top: 5px;
        margin-bottom: 5px;
        display: block;
      }
    }
  }
}
</style>
<style lang="less">
.apimgr-list[data-component-apimgr-list] {
  .apimgr-content {
    .ivu-avatar-string {
      line-height: 100px;
    }

    .ivu-card-body {
      padding-bottom: 0;
    }

    .ivu-icon-ios-settings-outline {
      font-size: 70px;
    }
  }
}
</style>
