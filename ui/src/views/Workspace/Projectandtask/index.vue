<template>
  <div class="app-container">
    <Layout ref="layoutWrapper" class="task-layout content-layout">
      <task-type-selector
        :task-show-type="taskShowType"
        :table-config-type="tableConfig.type"
        @on-button-click="onTaskTypeClick"
      />
      <template v-if="taskShowType === 'list'">
        <div class="task-table">
          <Table
            ref="taskTableRef"
            width="100%"
            :height="tableConfig.tableHeight"
            :columns="tableConfig.coloum"
            :data="tableConfig.data"
            :loading="tableConfig.loading"
            :draggable="true"
            @on-row-click="onTaskClick"
          >
            <template slot="pri" slot-scope="{ row }">
              <tag v-if="row.pri" :color="mapPriColorConfig(row).color">
                {{
                mapPriColorConfig(row).key
                }}
              </tag>
            </template>
            <template slot="name" slot-scope="{ row }">
              <tag :color="mapTaskStatusConfig(row).color">
                {{
                mapTaskStatusConfig(row).key
                }}
              </tag>
              <span>{{ row.name }}</span>
            </template>
            <template slot="operation" slot-scope="{ row }">
              <div>
                <a @click="onTaskClick(row)">详情</a>
                <a v-if="row.status === 'doing'">完成</a>
                <a v-if="row.status === 'doing'">编辑</a>
              </div>
            </template>
          </Table>
        </div>
        <div style="margin: 10px; overflow: hidden; padding: 0 16px">
          <div style="width: 100%; text-align: right">
            <page
              :total="tableConfig.totalCount"
              show-elevator
              show-sizer
              @on-change="onPagnationPageChange"
              @on-page-size-change="onPagnationPageSizeChange"
            />
          </div>
        </div>
      </template>

      <div v-if="taskShowType === 'classicalList'" class="task-table task-table-classical">
        <spin v-show="tableConfig.loading" fix></spin>
        <card
          v-for="item of taskStatusArr"
          :key="item"
          :ref="`${item}TaskCardRef`"
          class="task"
          :class="[
          `task-${item}`,
          taskDraging && taskDragingAim !== item ? `task-drag` : '',
          taskDragingAim === item ? 'task-shadow' : '',
          taskDragingSource === item ? 'task-vague' : '',
        ]"
        >
          <p slot="title">{{ $options.taskStatus.mapObjectByValueFn(item).key }}</p>
          <ul
            v-show="mapClassilcalTask(item).length"
            class="task-list"
            :class="`tast-list-${item}`"
            :data-status="item"
            @dragenter.prevent="onTaskDragEnter"
            @dragover.prevent
            @drop.prevent="(e) => onTaskDrop(e, item)"
            @dragstart="onTaskDragStart"
            @dragend.prevent="onTaskDragEnd"
            @mousedown="(e) => onTaskTouchMouseDown(e, item)"
            @mouseup="onTaskTouchMouseUp"
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
                <a v-if="item === 'doing'" @click="onEditDoingTaskClick(task)">写日志</a>
                <a v-if="item === 'wait'" @click="onEstimeatedTimeClick(task)">预估时间</a>
                <a v-if="item === 'done'">指派</a>
              </div>
            </li>
          </ul>
          <div
            v-show="!mapClassilcalTask(item).length"
            class="task-list-no-data"
            :data-status="item"
            @dragover.prevent
            @drop.prevent="(e) => onTaskDrop(e, item)"
            @dragstart="onTaskDragStart"
            @dragend.prevent="onTaskDragEnd"
            @dragenter.prevent="onTaskDragEnter"
          >暂无数据</div>
        </card>
      </div>
    </Layout>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
@import './index.less';
</style>
