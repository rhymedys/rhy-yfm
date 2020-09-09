<template>
  <Card
    v-show="computeVisiable"
    class="classical-info-previewer"
    :style="computeStyle"
    shadow
    @mousemove.native="(e) => $emit('mousemove', e)"
    @mouseout.native="(e) => $emit('mouseout', e)"
  >
    <p slot="title">概览信息</p>
    <template v-if="computeBoardData">
      <div class="item">
        <div class="item__left">
          参与人员:
          <br />
          (共{{ computeParticipant.length }}人)
        </div>
        <div class="item__right">
          <div v-for="people of computeParticipant" :key="people">
            {{ people }}
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  name: 'ProjectAndProductTableClassicalCardClassicalInfoPreviewer',
  data() {
    return {
      top: undefined,
      left: undefined,
      visible: false,
      boardData: {},
      classical: undefined,
    }
  },
  computed: {
    computeVisiable() {
      const { top, left, visible } = this
      return visible && top && left
    },
    computeStyle() {
      let res
      const { top, left } = this
      if (top && left) {
        res = {
          top: `${top}px`,
          left: `${left}px`,
        }
      }

      return res
    },
    // 计算当前数据
    computeBoardData() {
      let res

      const { classical, boardData } = this

      return boardData[classical]
    },
    // 计算参与者
    computeParticipant() {
      const { computeBoardData } = this

      const mapRes = {}

      if (computeBoardData) {
        computeBoardData.forEach((story) => {
          story.storyBoardTaskInfoList.forEach((peopleTask) => {
            mapRes[peopleTask.realname] = peopleTask
          })
        })
      }

      return Object.keys(mapRes) || []
    },
  },
  methods: {},
}
</script>

<style lang="less">
.classical-info-previewer {
  .ivu-card-body {
    height: calc(100% - 51px);
    overflow: scroll;
  }
}
</style>

<style lang="less" scoped>
.classical-info-previewer {
  width: 300px;
  height: 500px;
  position: fixed;
  z-index: 10;
  box-shadow: 2px 2px 4px 2px rgba(0, 21, 41, 0.08);

  .item {
    display: flex;
    flex-direction: row;
    &__left {
      font-weight: bold;
      margin-right: 6px;
      text-align: right;
    }
  }
}
</style>
