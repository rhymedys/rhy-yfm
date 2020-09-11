<template>
  <div class="project-and-product-type">
    <ButtonGroup style="margin-right: 10px; margin-left: 10px">
      <Button
        v-for="item of productOrProjectClassical"
        :key="item.k"
        :type="item.type || 'default'"
        @click="onProductOrProjectClassicalButtonClick(item)"
      >{{ item.l }}</Button>
    </ButtonGroup>

    <ButtonGroup v-if="taskShowType === 'list'" style="margin-right: 10px">
      <Button
        v-for="item of taskType"
        :key="item.k"
        :type="item.type || 'default'"
        @click="onButtonClick(item)"
      >{{ item.l }}</Button>
    </ButtonGroup>

    <template v-if="computeSubTypeVisiable">
      <span class="subclassical"></span>
      <ButtonGroup style="margin-right: 10px">
        <Button
          v-for="item of conputeProductOrProjectSubClassical"
          :key="item.k"
          :type="item.type || 'default'"
          @click="onProductOrProjectSubClassicalButtonClick(item)"
        >{{ item.l }}</Button>
      </ButtonGroup>
    </template>

    <a v-show="taskShowType !== 'grantt'" @click="$emit('on-show-type-change')">
      <Icon size="30" :type="computeShowType" />切换视图
    </a>
    <span class="schdule" @click="$emit('on-plan-click')">{{ computeDesc }}</span>
  </div>
</template>

<script>
export default {
  name: 'ProjectAndProductTypeSelector',
  props: {
    taskShowType: {
      type: String,
      default: 'list',
    },
    productOrProjectClassicalShowType: {
      type: String,
      default: 'storyBoardInfoByProjectId',
    },
    boardType: {
      type: String,
      default: 'storyBoardInfoByProjectId',
    },
    boardData: {
      type: Object,
      default: () => {},
    },
    productOrProjectSubClassicalType: {
      type: String,
      default: 'progress',
    },
  },
  data() {
    return {
      taskType: [
        {
          k: 'projecteds',
          l: '已立项',
          type: 'primary',
        },
        {
          k: 'developings',
          l: '开发中',
        },
        {
          k: 'developeds',
          l: '已完成',
        },
      ],
      productOrProjectClassical: [
        {
          k: 'storyBoardInfoByProjectId',
          l: '项目发版',
          type: this.boardType === 'storyBoardInfoByProjectId' && 'primary',
        },
        {
          k: 'storyBoardInfoByProduct',
          l: '产品研发',
          type: this.boardType === 'storyBoardInfoByProduct' && 'primary',
        },
        {
          k: 'grantt',
          l: '甘特图',
          type: this.boardType === 'grantt' && 'primary',
        },
      ],
    }
  },
  computed: {
    conputeProductOrProjectSubClassical() {
      return [
        {
          k: 'progress',
          l: '进度',
          type:
            this.productOrProjectSubClassicalType === 'progress' && 'primary',
        },
        {
          k: 'people',
          l: '人员',
          type: this.productOrProjectSubClassicalType === 'people' && 'primary',
        },
      ]
    },
    // 显示子分类
    computeSubTypeVisiable() {
      return (
        ['storyBoardInfoByProjectId', 'storyBoardInfoByProduct'].includes(
          this.boardType
        ) && this.taskShowType !== 'list'
      )
    },
    computeShowType() {
      return (
        (this.taskShowType === 'list' && 'ios-apps-outline') ||
        'ios-list-box-outline'
      )
    },
    computeDesc() {
      const { title, beginTime, endTime } = this.boardData || {}

      let res = ''

      if (title) {
        res += title
      }

      if (beginTime || endTime) {
        res += `  周期:${beginTime} `

        if (endTime) {
          res += `至 ${endTime}`
        }
      }

      return res
    },
  },
  methods: {
    invokeChangeClassical(key, item) {
      this[key] = this[key].map((val) => {
        if (val.k === item.k) {
          val.type = 'primary'
        } else {
          val.type = 'default'
        }

        return val
      })
    },

    onButtonClick(item) {
      this.invokeChangeClassical('taskType', item)

      this.$emit('on-button-click', item.k)
    },
    onProductOrProjectClassicalButtonClick(item) {
      this.invokeChangeClassical('productOrProjectClassical', item)

      this.$emit('on-product-or-project-classical-click', item.k)
    },

    onProductOrProjectSubClassicalButtonClick(item) {
      // this.invokeChangeClassical('productOrProjectSubClassical', item)

      this.$emit('on-product-or-project-sub-classical-button-click', item.k)

      // this.productOrProjectSubClassical = this.productOrProjectSubClassical.map(
      //   (val) => {
      //     if (val.k === item.k) {
      //       val.type = 'primary'
      //     } else {
      //       val.type = 'default'
      //     }

      //     return val
      //   }
      // )
    },
  },
}
</script>

<style lang="less" scoped>
.project-and-product-type {
  padding: 14px 16px;

  // .subclassical {
  //   height: 32px;
  //   line-height: 32px;
  //   vertical-align: middle;
  //   margin-left: 10px;
  // }

  .schdule {
    margin-right: 10px;
    font-weight: bold;
    font-style: italic;
  }
  .schdule,
  a {
    float: right;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;

    font-size: 14px;
  }
}
</style>
