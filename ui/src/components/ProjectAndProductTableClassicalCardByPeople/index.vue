<template>
  <div class="task-table task-table-classical">
    <Card
      v-for="item of taskStatusArr"
      :key="item"
      :ref="`${item}TaskCardRef`"
      class="task"
      :class="`task-${item}`"
    >
      <div slot="title" class="title">
        <span>{{ mapClassicalTitle(item) }}</span>
        <Icon
          size="22"
          type="ios-list-box-outline"
          @mousemove.native="
            (e) => $emit('on-classical-info-mouse-move', e, item)
          "
          @mouseout.native="
            (e) => $emit('on-classical-info-mouse-out', e, item)
          "
        />
      </div>
      <ul
        v-show="mapClassilcalTask(item).length"
        class="task-list"
        :class="`tast-list-${item}`"
        :data-status="item"
      >
        <li
          v-for="(task, i) of mapClassilcalTask(item)"
          :key="task.storyId"
          draggable="true"
          :data-status="item"
          :data-index="i"
        >
          <div
            v-if="item === 'developings'"
            class="bg"
            :style="`width:${task.completeRate * 100}%`"
          />
          <div style="line-height: 26x; vertical-align: middle">
            {{ i + 1 }}.
            {{ task.title }}
          </div>
          <divider style="margin: 5px 0" dashed />
          <div class="operation">
            <span>{{ task.storyId }}</span>
            <tag
              v-if="task.pri"
              :color="mapPriColorConfig(task).color"
            >{{ mapPriColorConfig(task).key }}</tag>
            <div style="flex: 1" />

            <a
              v-if="item !== 'developings'"
              class="operation__combine-task"
              :data-status="item"
              :data-index="i"
              @mousemove="(e) => $emit('on-combine-task-mouse-move', e)"
              @mouseout="(e) => $emit('on-combine-task-mouse-out', e)"
            >关联任务情况</a>

            <span
              v-if="item === 'developings'"
              class="operation__complete-rate"
              :data-status="item"
              :data-index="i"
              @mousemove="(e) => $emit('on-complete-rate-mouse-move', e)"
              @mouseout="(e) => $emit('on-complete-rate-mouse-out', e)"
            >完成率:{{ Number(task.completeRate * 100).toFixed(2) }}%</span>
            <a class="operation__details" @click="$emit('on-story-detail-click', task.storyId)">详情</a>
          </div>
        </li>
      </ul>
      <div v-show="!mapClassilcalTask(item).length">暂无数据</div>
    </Card>
  </div>
</template>

<script>
import projectAndProductClassical from '@/contants/projectAndProductClassical'
import prior from '@/contants/prior'

export default {
  name: 'ProjectAndProductTableClassicalCardByPeople',
  projectAndProductClassical,
  props: {
    boardData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      taskStatusArr: Object.freeze(Object.keys(projectAndProductClassical)),
    }
  },
  computed: {
    // 映射BoardData数据
    computeBoardData() {
      const { boardData } = this

      const statusKs = ['developeds', 'developings', 'projecteds']

      const res = {
        storyMap: {},
        peopleStoryMap: {},
      }

      statusKs.forEach((statusK) => {
        const data = boardData[statusK]

        if ((data && data, length)) {
          data.forEach((story) => {
            const { id, storyBoardTaskInfoList } = story
            res.storyMap[id] = story

            storyBoardTaskInfoList.forEach((relativePeople) => {
              const { assignedTo } = relativePeople
              if (!res.peopleStoryMap[assignedTo]) {
                res.peopleStoryMap[assignedTo] = {}
              }

              if (!res.peopleStoryMap[assignedTo][statusK]) {
                res.peopleStoryMap[assignedTo][statusK] = []
              }

              res.peopleStoryMap[assignedTo][statusK].push(id)
            })
          })
        }
      })

      console.log(res)
      return res
    },
  },
  methods: {
    // 根据任务状态映射任务
    mapClassilcalTask(status) {
      let res = []

      if (this.boardData) {
        res = this.boardData[status] || []
      }
      return res
    },
    // 映射优先级配置
    mapPriColorConfig(row) {
      let res = {}
      if (row.pri !== undefined) {
        res = prior.mapObjectByValueFn(row.pri)
      }

      return res
    },

    // 映射分类标题文本
    mapClassicalTitle(item) {
      const { projecteds, developings, developeds } = this.boardData

      let totalLen
      let currentLen = 0
      if (projecteds && developings && developeds) {
        totalLen = projecteds.length + developings.length + developeds.length
        currentLen = this.boardData[item] && this.boardData[item].length
      }

      let res = `${this.$options.projectAndProductClassical[item].desc} `

      if (totalLen) {
        res += `${currentLen}/${totalLen}`
      }

      return res
    },
  },
}
</script>
