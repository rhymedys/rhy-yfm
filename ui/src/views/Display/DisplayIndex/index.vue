<template>
  <div class="app-container">
    <Layout ref="layoutWrapper" class="diplay-project-layout content-layout">
      <spin v-show="tableConfig.loading" fix></spin>
      <project-and-product-type-selector
        :task-show-type="taskShowType"
        :board-type="boardType"
        :board-data="boardData"
        :product-or-project-sub-classical-type="productOrProjectSubClassicalType"
        @on-button-click="onTaskTypeClick"
        @on-show-type-change="onTaskShowTypeChange"
        @on-product-or-project-classical-click="onProductOrProjectClassicalClick"
        @on-product-or-project-sub-classical-button-click="onProductOrProjectSubClassicalButtonClick"
        @on-plan-click="onPlanSelectClick"
      />

      <project-and-product-table
        v-if="taskShowType === 'list'"
        :table-config="tableConfig"
        :board-data="boardData"
      />

      <project-and-product-table-classical-card
        v-else-if="taskShowType === 'classicalList'"
        :board-data="boardData"
        @on-classical-info-mouse-move="onClassicalInfoMouseMove"
        @on-classical-info-mouse-out="onClassicalInfoMouseOut"
        @on-complete-rate-mouse-move="onCompleteRateMouseMove"
        @on-complete-rate-mouse-out="onCompleteRateMouseOut"
        @on-combine-task-mouse-out="onCombineTaskMouseOut"
        @on-combine-task-mouse-move="onCombineTaskMouseMove"
        @on-story-detail-click="onStoryDetailClick"
      />

      <task-grantter
        v-else-if="taskShowType === 'grantt'"
        :project-gantt-story-info-list="projectGanttStoryInfoList"
        :start-time="startTime"
        :end-time="endTime"
      />
    </Layout>
  </div>
</template>

<style lang="less">
@import './index.less';
</style>

<script src="./index.js"></script>
