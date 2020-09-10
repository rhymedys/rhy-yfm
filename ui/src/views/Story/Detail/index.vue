<template>
  <div class="app-container">
    <div class="storydetail" v-if="hadInit">
      <div class="content">
        <Layout ref="layoutWrapper" class="story-detail-layout content-layout">
          <Layout class="story__desc">
            <h3 class="story__desc_title">
              <tag color="blue">{{ $route.params.id }}</tag>
              <div>{{ storyspec.title }}</div>
            </h3>
            <div class="story__desc_detail">
              <h2>需求描述</h2>
              <div class="story__txt" v-html="storyspec.spec || '暂无'" />
              <Divider />
            </div>
          </Layout>
          <Layout class="story__extra-info">
            <div class="story__extra-info_base">
              <h3>基本信息</h3>
              <div
                v-for="item of $options.baseInfoKeyMap"
                :key="item.k"
                class="info"
                :class="`info-${item.k}`"
              >
                <div class="info__l">{{ item.l }}：</div>
                <div v-if="!item.slot" class="info__v">
                  {{
                  item.render
                  ? item.render(storyDetail[item.k])
                  : storyDetail[item.k]
                  }}
                </div>
                <tag
                  v-if="item.slot === 'status'"
                  :color="mapStoryStatusConfig(storyDetail[item.k]).color"
                >{{ mapStoryStatusConfig(storyDetail[item.k]).key }}</tag>
                <tag
                  v-if="item.slot === 'stage'"
                  :color="mapStoryStageConfig(storyDetail[item.k]).color"
                >{{ mapStoryStageConfig(storyDetail[item.k]).key }}</tag>
              </div>
            </div>

            <div class="story__extra-info_participant">
              <Tabs :value="extraInfoTab">
                <TabPane label="参与者" name="participant">
                  <div class="info">
                    <div v-for="item of storyTaskInfo.tasks" :key="item.taskId" class="info__task">
                      <tag
                        :color="mapTaskStatusConfig(item.taskStatus).color"
                      >{{ mapTaskStatusConfig(item.taskStatus).key || '未知' }}</tag>
                      <span>{{ item.realname }}</span>
                      <div class="info__task_name">【{{ item.taskId }}】{{ item.taskName }}</div>
                      <divider dashed />
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Layout>
        </Layout>
      </div>
    </div>
  </div>
</template>
<script>

import { requestStoryDetail } from '@/api/projecttask/story'
import { reqeustStoryspecDetail } from '@/api/projecttask/storyspec'
import { requestGetTaskInfoByStoryId } from '@/api/projecttask/task'
import taskStatus from '@/contants/taskStatus.js'
import storyStatus from '@/contants/storyStatus.js'
import storyStage from '@/contants/storyStage.js'
import { mapImg } from '@/utils/img'

export default {
  name: 'StoryDetail',
  data() {
    return {
      // 需求详情
      storyDetail: {},
      // 需求描述
      storyspec: {},
      // 参与者信息
      storyTaskInfo: {},
      // 其他信息tab  participant：参与者
      extraInfoTab: 'participant',
      // 日志
      logList: [],
      // 请求日志？
      requestLogListPending: false,
      // 是否初始化完成
      hadInit: false,
    }
  },
  baseInfoKeyMap: [
    {
      k: 'project',
      l: '所属项目',
    },
    {
      k: 'module',
      l: '所属模块',
    },
    {
      k: 'plan',
      l: '所属计划',
    },
    {
      k: 'source',
      l: '需求来源',
    },
    {
      k: 'sourceNote',
      l: '来源备注',
    },
    {
      k: 'status',
      l: '当前状态',
      slot: 'status',
    },
    {
      k: 'stage',
      l: '所处阶段',
      slot: 'stage',
    },
    {
      k: 'pri',
      l: '优先级',
    },
    {
      k: 'estimate',
      l: '预计工时',
    },
    {
      k: 'keywords',
      l: '关键词',
    },
    {
      k: 'mailto',
      l: '抄送给',
    },
  ],

  async created() {
    const { query } = this.$route

    const storyId = query.id

    const storyDetailReq = requestStoryDetail(storyId).catch((e) => {
      return {}
    })

    const storyspecDetailReq = reqeustStoryspecDetail(storyId).catch((e) => {
      return {}
    })

    const getTaskInfosByStoryIdReq = requestGetTaskInfoByStoryId(storyId).catch(
      (e) => {
        return {}
      }
    )

    const [
      storyspecDetailRes,
      getTaskInfosByStoryIdRes,
      storyDetailRes,
    ] = await Promise.all([
      storyspecDetailReq,
      getTaskInfosByStoryIdReq,
      storyDetailReq,
    ])

    let storyDetail = {}
    let storyspec = {}
    let storyTaskInfo = {}

    if (storyDetailRes.code === 0 && storyDetailRes.data) {
      storyDetail = storyDetailRes.data
    }

    if (storyspecDetailRes.code === 0 && storyspecDetailRes.data) {
      storyspec = storyspecDetailRes.data
      if (storyspec.spec) {
        storyspec.spec = mapImg(storyspec.spec)
      }
    }

    if (
      getTaskInfosByStoryIdRes.code === 0 &&
      getTaskInfosByStoryIdRes.storyTaskInfo
    ) {
      storyTaskInfo = getTaskInfosByStoryIdRes.storyTaskInfo
    }

    this.storyspec = storyspec
    this.storyTaskInfo = storyTaskInfo
    this.storyDetail = storyDetail

    document.title = this.storyspec.title

    this.hadInit = true
  },
  computed: {
    computeUserInfo() {
      return {}
    },
  },
  methods: {
    mapTaskStatusConfig(val) {
      return taskStatus.mapObjectByValueFn(val)
    },
    mapStoryStatusConfig(val) {
      return storyStatus.mapObjectByValueFn(val)
    },
    mapStoryStageConfig(val) {
      return storyStage.mapObjectByValueFn(val)
    },
  },
}
</script>
<style lang="less" scoped>
.storydetail {
  background: #eceef1;
  height: 100%;

  .page-header-without-slider {
    width: 100%;
  }
  .content {
    background: #eceef1;
    display: flex;
    flex-direction: row;
  }

  .story-detail-layout {
    height: ~'calc(100vh - 124px)';
    display: flex;
    flex-direction: row;
    position: relative;

    .story {
      &__desc {
        background-color: white;
        box-shadow: 1px 1px 4px rgba(0, 21, 41, 0.08);
        flex: 2;
        padding: 15px;
        margin-right: 5px;
        position: relative;

        &_title {
          vertical-align: middle;
          display: flex;
          flex-direction: row;
          align-items: center;
          position: absolute;
          top: 20px;
        }

        &_detail {
          margin-top: 46px;
          overflow: auto;

          .detail {
            &__txt {
              padding: 10px;
              font-size: 14px;
            }
          }
        }
      }

      &__extra-info {
        flex: 1;
        margin-left: 5px;

        &_participant,
        &_base {
          background-color: white;
          box-shadow: 1px 1px 4px rgba(0, 21, 41, 0.08);
          padding: 15px;
          margin-bottom: 10px;
        }

        &_base {
          .info {
            margin-top: 10px;
            display: flex;
            flex-direction: row;

            &-stage,
            &-status {
              display: flex;
              flex-direction: row;
              align-items: center;
            }

            &__l {
              min-width: 60px;
              text-align: right;
            }
          }
        }

        &_participant {
          height: 100%;
          overflow: hidden;
          margin-bottom: 0;
          padding-top: 0;

          .ivu-tabs-bar {
            margin-bottom: 0px;
          }

          .ivu-tabs-content {
            height: 100%;
          }

          .ivu-tabs {
            height: 100%;
            overflow: hidden;
          }

          .log,
          .info {
            height: 100%;
            overflow: auto;

            &__task {
              margin-top: 10px;
              align-items: center;
              &:last-child {
                padding-bottom: 100px;
              }
              &__name {
                margin-top: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
