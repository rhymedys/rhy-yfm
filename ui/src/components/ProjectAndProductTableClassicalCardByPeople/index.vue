<template>
  <div class="task-table task-table-classical">
    12312
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
  },
}
</script>
