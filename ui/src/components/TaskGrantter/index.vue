<template>
  <div ref="wrapperEl" class="task-grantt">
    <div ref="taskMenuRef" class="task-menu" @scroll="onTaskMenuScroll">
      <div ref="taskMenuHeaderRef" class="menu__header">项目/任务</div>

      <div class="menu__content">
        <div
          v-for="(granttItem, index) of projectGanttStoryInfoList"
          :key="
            (granttItem.storyId && `s${granttItem.storyId}`) ||
            (granttItem.taskId && `t${granttItem.taskId}`) ||
            index
          "
          :data-storyId="granttItem.storyId"
          :data-taskId="granttItem.taskId"
          :data-start="granttItem.startDate"
          :data-end="granttItem.endDate"
          class="content__row"
        >
          <div
            v-show="!granttItem.isTask"
            class="content__row_section"
            @mousemove="(e) => onTaskMenuItemMouseMove(e, granttItem.label)"
            @mouseout="onTaskMenuItemMouseOut"
          >
            {{ granttItem.label || '' }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="projectGanttStoryInfoList.length"
      ref="granntRef"
      class="task-grantt__grantt"
      @scroll="onGranntScroll"
    >
      <div
        v-show="tableItemWidth"
        ref="granntHeaderRef"
        class="grantt__header"
        :style="[computeWidth]"
      >
        <div class="grantt__header_date">
          <span class="date-start">{{ computeStartDate.startDate }}</span>

          <span class="date-end">{{ computeEndDate.endDate }}</span>
        </div>

        <div class="grantt__header_day">
          <div
            v-for="item of diffDay"
            :key="item"
            class="day"
            :style="`width:${tableItemWidth}px;`"
          >
            {{ mapTableDay(item) }}
          </div>
        </div>
      </div>

      <div
        ref="granttContentRef"
        class="grantt__content"
        :style="[computeWidth, !tableItemWidth && { visibility: 'hidden' }]"
        @mousemove="onGranntMouseMove"
        @mouseout="onGranntMouseOut"
      >
        <template v-show="tableItemWidth">
          <div ref="lineTriggerRef" class="line" />
          <div
            v-for="(granttItem, index) of projectGanttStoryInfoList"
            :key="
              (granttItem.storyId && `s${granttItem.storyId}`) ||
              (granttItem.taskId && `t${granttItem.taskId}`) ||
              index
            "
            :data-storyId="granttItem.storyId"
            :data-taskId="granttItem.taskId"
            :data-start="granttItem.startDate"
            :data-end="granttItem.endDate"
            class="content__row"
            :style="computeWidth"
          >
            <div
              class="content__row_section"
              :class="mapRowSectionClass(granttItem)"
              :style="mapRowSectionStyle(granttItem)"
              data-iscontent="1"
              @mousemove.prevent="(e) => onGranntResultMouseMove(e, granttItem)"
              @mouseout.prevent="onGranntResultMouseOut"
            >
              {{ granttItem.label || '' }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import BlackTipApi from '~/components/BlackTip/api'
import GranttStoryOrTaskPriviewerApi from '~/components/GranttStoryOrTaskPriviewer/api'

export default {
  name: 'TaskGrantter',
  props: {
    projectGanttStoryInfoList: {
      type: Array,

      default: () => [],
    },
    endTime: {
      type: String,
      default: '',
    },
    startTime: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      tableItemWidth: 0,
      diffDay: undefined,
      fixWidth: 0,
      headerScrollTop: 0,
    }
  },
  computed: {
    computeHeaderTop() {
      return {
        top: `${this.headerScrollTop}px`,
      }
    },
    computeWidth() {
      return {
        width: `${this.diffDay * this.tableItemWidth}px`,
      }
    },

    computeStartDate() {
      const startDate = moment(this.startTime)

      return {
        startDate: (startDate && startDate.format('YYYY-MM-DD')) || '',

        startDateMomentObj: startDate,
      }
    },

    computeEndDate() {
      const endDate = moment(this.endTime)

      return {
        endDate: (endDate && endDate.format('YYYY-MM-DD')) || '',
        endDateMomentObj: endDate,
      }
    },
  },

  watch: {
    projectGanttStoryInfoList() {
      this.$nextTick(() => {
        this.invokeSetFixWidth()
        this.invokeSetDiffDay()
        this.invokeSetItemWidth()
      })
    },
  },

  mounted() {
    // this.$nextTick(() => {

    if (this.projectGanttStoryInfoList.length) {
      // this.$forceUpdate()
      this.invokeSetDiffDay()
      this.invokeSetFixWidth()
      this.invokeSetItemWidth()
    }
    // })
  },

  methods: {
    onGranntMouseMove(e) {
      const wrapperPos = this.$refs.granttContentRef.getBoundingClientRect()
      const diffX = e.x - wrapperPos.x
      const height = this.$refs.granttContentRef.scrollHeight
      console.log('onGranntMouseMove', height)
      this.$refs.lineTriggerRef.style = `left:${diffX}px;display:initial;height:${height}px`
      // this.currentPointTime = diffX / this.diffDay * this.tableItemWidth
    },
    onGranntMouseOut(e) {
      // console.log('onGranntMouseOut')
      const {
        x,
        y,
        height,
        width,
      } = this.$refs.granttContentRef.getBoundingClientRect()
      const scrollTop = this.$refs.granntRef.scrollTop
      // console.log(this.$refs.granttContentRef.getBoundingClientRect())
      // console.log(scrollTop)
      // console.log('e.x,e,y', e.x, e.y)
      // console.log('x,y,height,width', x, y, height, width)
      // console.log('e.x < x', e.x < x)
      // console.log('e.x > x + width', e.x > x + width)
      // console.log('e.y < y', e.y < y)
      // console.log(' e.y > y + height', e.y > y + scrollTop + height)
      // // const realY = scrollTop + y

      if (e.x <= x || e.x >= x + width || e.y >= scrollTop + height) {
        this.$refs.lineTriggerRef.style = ''
      } else if (y > 0) {
        if (e.y <= y || e.y >= y + height) {
          this.$refs.lineTriggerRef.style = ''
        }
      } else if (e.y <= scrollTop + y || e.y >= scrollTop + y + height) {
        this.$refs.lineTriggerRef.style = ''
      }
    },
    // 鼠标移出甘特图结果区域
    onGranntResultMouseOut() {
      GranttStoryOrTaskPriviewerApi.hide()
    },
    // 鼠标移进甘特图结果区域
    onGranntResultMouseMove(e, granttItem) {
      const { x, y } = e.srcElement.getBoundingClientRect()
      GranttStoryOrTaskPriviewerApi.show({
        data: granttItem,
        x,
        y,
      })
    },
    // 鼠标移近项目名
    onTaskMenuItemMouseMove(e, title) {
      const { x, y } = e.srcElement.getBoundingClientRect()
      BlackTipApi.show({
        x,
        y,
        title,
      })
    },
    // 鼠标移出项目名
    onTaskMenuItemMouseOut() {
      BlackTipApi.hide()
    },
    onGranntScroll(e) {
      if (e.target.scrollTop !== this.headerScrollTop) {
        this.headerScrollTop = e.target.scrollTop
        this.$refs.taskMenuHeaderRef.style.top = `${this.headerScrollTop}px`
      }

      if (this.$refs.taskMenuRef.scrollTop !== this.headerScrollTop) {
        this.$refs.taskMenuRef.scrollTop = this.headerScrollTop
        this.$refs.granntHeaderRef.style.top = `${this.headerScrollTop}px`
      }
    },
    onTaskMenuScroll(e) {
      if (e.target.scrollTop !== this.headerScrollTop) {
        this.headerScrollTop = e.target.scrollTop
        this.$refs.granntHeaderRef.style.top = `${this.headerScrollTop}px`
      }

      if (this.$refs.granntRef.scrollTop !== this.headerScrollTop) {
        this.$refs.granntRef.scrollTop = this.headerScrollTop
        this.$refs.taskMenuHeaderRef.style.top = `${this.headerScrollTop}px`
      }
    },
    invokeSetFixWidth() {
      if (!this.$refs.granntRef) {
        return
      }

      const { scrollHeight, clientHeight } = this.$refs.granntRef

      if (scrollHeight > clientHeight && !this.fixWidth) {
        this.fixWidth = 7
      } else {
        this.fixWidth = 0
      }
    },

    invokeSetDiffDay() {
      if (this.computeEndDate.endDateMomentObj) {
        const endDate = this.computeEndDate.endDateMomentObj
          .clone()
          .endOf('days')

        const startDate = this.computeStartDate.startDateMomentObj
          .clone()
          .startOf('days')

        const diffDay = endDate.diff(startDate, 'days') + 1

        this.diffDay = diffDay
      }
    },

    invokeSetItemWidth() {
      if (!this.$refs.granttContentRef) {
        return this.$nextTick(() => {
          this.invokeSetItemWidth()
        })
      }

      this.invokeSetFixWidth()

      const posInfo = this.$refs.granttContentRef.getBoundingClientRect()

      console.log('invokeSetItemWidth', posInfo)

      const { width } = posInfo

      this.tableItemWidth = width / this.diffDay

      // this.tableItemWidth = tableItemWidth.fixWidth(3)

      console.log(this.tableItemWidth)
    },

    mapTableDay(dis) {
      if (this.computeStartDate.startDateMomentObj) {
        const dateMoment = this.computeStartDate.startDateMomentObj

          .clone()

          .add(dis - 1, 'days')

        return dateMoment.format('DD')
      }
    },
    // 映射区间class样式
    mapRowSectionStyle(item) {
      const { endDate, startDate } = item

      let startDateMomentObj
      let left
      let width
      let padding
      if (startDate) {
        startDateMomentObj = moment(startDate).clone().startOf('seconds')

        left = startDateMomentObj.diff(
          this.computeStartDate.startDateMomentObj.clone().startOf('seconds'),
          'seconds'
        )

        left = left / 60 / 60 / 24

        console.log(left)

        left = `${this.tableItemWidth * left}px`
      }

      if (endDate) {
        const endDateMomentObj = moment(endDate).clone().endOf('seconds')
        let diff = endDateMomentObj.diff(startDateMomentObj, 'seconds')

        diff = diff / 60 / 60 / 24
        // console.log(
        //   'tableItemWidth',
        //   this.tableItemWidth,
        //   'orginXDiff',
        //   orginXDiff,
        //   'diff',
        //   diff,
        //   'fixWidth',
        //   this.fixWidth
        // )
        width = `${this.tableItemWidth * diff}px !important`
      }

      if (!endDate || !startDate || endDate === startDate) {
        width = `1px !important`
        padding = `10px 0 !important`
      }

      return {
        width,
        left,
        padding,
      }
    },
    // 映射区间class值
    mapRowSectionClass(item) {
      const res = []

      if (item.isTask) {
        res.push('content__row_section-task')
      }

      return res
    },
  },
}
</script>

<style lang="less" scoped>
.task-grantt {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  padding: 0 16px 14px 16px;

  .task-menu {
    position: relative;
    min-width: 100px;
    line-height: 46px;
    width: 100px;
    height: 100%;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    .menu {
      &__header {
        height: 46px;
        line-height: 46px;
        border-bottom: 1px #dcdee2 solid;
        min-width: 100px;
        text-align: center;
        position: absolute;
        top: 0;
        z-index: 2;
        background: white;
      }

      &__content {
        margin-top: 46px;

        .content {
          &__row {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            word-break: break-all;
            line-height: 30px;
            height: 30px;
            border-bottom: 0.5px rgb(236, 236, 236) solid;

            &:hover {
              background-color: #e6f7ff;
            }
          }
        }
      }
    }
  }

  &__grantt {
    height: 100%;
    overflow: auto;
    position: relative;
    flex: 1;
    .grantt {
      font-size: 15px;
      &__header {
        position: absolute;
        background: white;
        z-index: 4;
        &_date {
          background: #fdf8f4;

          font-weight: bold;

          padding: 4px 0;

          height: 26px;

          position: relative;

          .date {
            &-end {
              float: right;

              right: 0;
            }

            &-end,
            &-start {
              position: absolute;
            }
          }
        }

        &_day {
          .day {
            display: inline-block;

            border: 1px #dcdee2 solid;

            border-left: none;

            font-weight: bold;

            text-align: center;

            &:last-child {
              border-right: none;
            }
          }
        }
      }

      &__content {
        height: calc(100% - 46px);
        margin-top: 46px;
        width: 100%;
        position: relative;

        .line {
          position: absolute;
          height: 100%;
          width: 1px;
          background: #dcdee2;
          left: 0;
          display: none;
          z-index: 2;
        }

        .content {
          &__row {
            width: 100%;
            position: relative;
            height: 30px;
            border-bottom: 0.5px rgb(236, 236, 236) solid;
            left: 0px;

            &:hover {
              background-color: #e6f7ff;
              z-index: 3;
            }

            &_section {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              background: #adc6ff;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 1;
              word-break: break-all;
              line-height: 30px;
              z-index: 3;

              &-task {
                background: #ff9900;
              }
            }
          }
        }
      }
    }
  }
}
</style>
