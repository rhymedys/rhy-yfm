<template>
  <div class="app-container">
    <Layout ref="layoutWrapper" class="task-detail-layout content-layout" v-if="hadInit">
      <Layout class="task__desc">
        <h3 class="task__desc_title">
          <tag color="blue">{{ taskId}}</tag>
          <div>{{ task.name }}</div>
        </h3>
        <div class="task__desc_detail">
          <h2>1.任务描述</h2>
          <div class="detail__txt" v-html="task.desc || '暂无'" />
          <Divider />
          <h2>2.需求描述</h2>
          <div class="detail__txt" v-html="storyspec.spec || '暂无'" />
          <Divider />
          <h2>3.验收标准</h2>
          <div class="detail__txt" v-html="storyspec.verify || '暂无'" />
          <Divider />
          <h2>4.附件</h2>
          <div class="detail__txt" v-html="storyspec.verify || '暂无'" />
        </div>
      </Layout>
      <Layout class="task__extra-info">
        <div class="task__extra-info_base">
          <h3>基本信息</h3>
          <div
            v-for="item of $options.baseInfoKeyMap"
            :key="item.k"
            class="info"
            :class="`info-${item.k}`"
          >
            <div class="info__l">{{ item.l }}：</div>
            <div
              v-if="!item.slot"
              class="info__v"
            >{{ item.render ? item.render(task[item.k]) : task[item.k] }}</div>
            <tag
              v-if="item.slot === 'status'"
              :color="mapTaskStatusConfig(task[item.k]).color"
            >{{ mapTaskStatusConfig(task[item.k]).key }}</tag>
          </div>
        </div>

        <div class="task__extra-info_participant">
          <Tabs :value="extraInfoTab" @on-click="onExtraInfoTabClick">
            <TabPane label="参与者" name="participant">
              <div class="info">
                <div v-for="item of storyTaskInfo.tasks" :key="item.taskId" class="info__task">
                  <tag
                    :color="mapTaskStatusConfig(item.taskStatus).color"
                  >{{ mapTaskStatusConfig(item.taskStatus).key }}</tag>
                  <span>{{ item.realname }}</span>
                  <div class="info__task_name">【{{ task.id }}】{{ item.taskName }}</div>
                  <divider dashed />
                </div>
              </div>
            </TabPane>
            <TabPane label="日志" name="log">
              <div class="log">
                <spin v-if="requestLogListPending"></spin>

                <div v-for="item of logList" :key="item.id" class="info__task">
                  <span>{{ item.date }} {{ item.account }}</span>
                  <div class="info__task_name">【{{ task.id }}】{{ item.work || '无日志' }}</div>
                  <divider dashed />
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Layout>
    </Layout>
  </div>
</template>

<script src="./index.js"></script>
<style lang="less">
@import './index.less';
</style>
