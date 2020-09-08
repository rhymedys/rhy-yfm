<template>
  <div class="app-container">
    <Layout ref="layoutWrapper" class="task-layout content-layout">
      <auditing-task-type-selector
        :task-show-type="taskShowType"
        :selected-item-list="requestGetTeamDevelopsData"
        :selected-item-account="selectedTeamAccount"
        @on-button-click="onTaskTypeClick"
        @on-task-show-type-change="onTaskShowTypeChange"
      />
      <div v-if="taskShowType === 'classicalList'" class="task-table task-table-classical">
        <Spin v-show="tableConfig.loading" fix></Spin>
        <Card
          v-for="item of taskStatusArr"
          :key="item"
          :ref="`${item}TaskCardRef`"
          class="task"
          :class="[`task-${item}`]"
        >
          <p slot="title">{{ $options.taskStatus.mapObjectByValueFn(item).key }}</p>
          <ul
            v-show="mapClassilcalTask(item).length"
            class="task-list"
            :class="`tast-list-${item}`"
            :data-status="item"
          >
            <li
              v-for="(task, i) of mapClassilcalTask(item)"
              :key="task.id"
              draggable="true"
              :data-status="item"
              :data-index="i"
            >
              <div>
                {{ i + 1 }}.
                {{ task.name }}
              </div>
              <divider style="margin: 5px 0" dashed />
              <div class="operation">
                <span style="margin-right: 5px">{{ task.id }}</span>
                <tooltip v-if="task.pri" content="优先级">
                  <tag :color="mapPriColorConfig(task).color">{{ mapPriColorConfig(task).key }}</tag>
                </tooltip>
                <tooltip v-if="mapStoryIsInBuildSchdule(task)" content="这周发版">
                  <simple-important-icon txt="版" />
                </tooltip>

                <div style="flex: 1" />
                <a @click="onTaskClick(task)">详情</a>
              </div>
            </li>
          </ul>
          <div
            v-show="!mapClassilcalTask(item).length"
            class="task-list-no-data"
            :data-status="item"
          >暂无数据</div>
        </Card>
      </div>
    </Layout>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
@import './index.less';
</style>

