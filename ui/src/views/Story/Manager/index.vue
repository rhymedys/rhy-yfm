<template>
  <div class="app-container">
    <layout class="story-manager-layout content-layout">
      <div class="story-table story-table-classical">
        <spin v-show="loading" fix></spin>
        <card
          v-for="item of $options.classical"
          :key="item"
          :ref="`${item}CardRef`"
          class="story"
          :class="[
          `story-${item}`,
          storyDraging && storyDragingAim !== item ? `story-drag` : '',
          storyDragingAim === item ? 'story-shadow' : '',
        ]"
        >
          <p slot="title">{{ $options.storyProgressStatus.mapObjectByValueFn(item).key }}</p>
          <transition-group
            v-show="mapStoryUiDataByClassical(item).length"
            name="flip-list"
            tag="ul"
            class="story-list"
            :class="`story-list-${item}`"
            :data-classical="item"
            @dragenter.prevent.native="onStoryDragEnter"
            @dragover.prevent.native="onStoryDragOver"
            @drop.prevent.native="(e) => onStoryDrop(e, item)"
            @dragstart.native="onStoryDragStart"
            @dragend.prevent.native="onStoryDragEnd"
            @mousedown.native="(e) => onStoryTouchMouseDown(e, item)"
            @mouseup.native="onStoryTouchMouseUp"
          >
            <li
              v-for="(story, i) of mapStoryUiDataByClassical(item)"
              :key="story.storyId"
              :data-classical="item"
              :data-index="i"
              data-type="item"
              draggable="true"
            >
              <div>
                {{ i + 1 }}.
                {{ story.title }}
              </div>
              <divider style="margin: 5px 0" dashed />
              <div class="operation">
                <span style="margin-right: 5px">{{ story.storyId }}</span>
                <tag
                  v-if="story.pri"
                  :color="mapPriColorConfig(story).color"
                >{{ mapPriColorConfig(story).key }}</tag>
                <tooltip v-if="mapStoryIsInBuildSchdule(story, item)" content="这周发版">
                  <simple-important-icon txt="版" />
                </tooltip>
                <div style="flex: 1" />
                <a @click="onStoryDetailClick(story)">详情</a>
              </div>
            </li>
          </transition-group>
          <div
            v-show="!mapStoryUiDataByClassical(item).length"
            class="story-list-no-data"
            :data-classical="item"
            @dragover.prevent
            @drop.prevent="(e) => onStoryDrop(e, item)"
            @dragstart="onStoryDragStart"
            @dragend.prevent="onStoryDragEnd"
            @dragenter.prevent="onStoryDragEnter"
          >暂无数据</div>
        </card>
      </div>
    </layout>
  </div>
</template>
<script src="./index.js"></script>
<style lang="less">
@import './index.less';
</style>
