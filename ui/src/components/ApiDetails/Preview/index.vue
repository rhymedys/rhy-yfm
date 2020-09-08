<template>
  <div class="preview" data-component-api-details-preview>
    <h2 class="preview__title" style="margin-top: 0px">基本信息</h2>
    <div class="preview__base-info">
      <Row class="info-row" :gutter="16">
        <Col class="col-key" span="4">接口名称：</Col>
        <Col class="col-name" span="8">{{ info.name }}</Col>
        <Col class="col-key" span="4">创&ensp;建&ensp;人:</Col>
        <Col span="8">col-12</Col>
      </Row>
      <Row class="info-row" :gutter="16">
        <Col class="col-key" span="4">状&emsp;&emsp;态：</Col>
        <Col class="col-name" span="8">
          <Tag :color="computeApiStatusConfig.color">
            {{ computeApiStatusConfig.key }}
          </Tag>
        </Col>
        <Col class="col-key" span="4">更新时间:</Col>
        <Col span="8">{{ info.updateTime }}</Col>
      </Row>
      <Row class="info-row" :gutter="16">
        <Col class="col-key" span="4">Tag：</Col>
        <Col class="col-value" span="18"></Col>
      </Row>
      <Row class="info-row" :gutter="16">
        <Col class="col-key" span="4">接口路径：</Col>
        <Col class="col-value" span="18">
          <Tag :color="computeApiMethodConfig.color">{{
            computeApiMethodConfig.key
          }}</Tag>
          {{ info.path }}
        </Col>
      </Row>
      <Row class="info-row" :gutter="16">
        <Col class="col-key" span="4">Mock地址：</Col>
        <Col class="col-value" span="18">
          <a @click="onMockUrlClick">{{ computeMockUrl }}</a>
        </Col>
      </Row>
    </div>
    <h2 v-if="info.markdown" class="preview__title">备注</h2>
    <div v-if="!computeIsServer && info.markdown" class="preview__markdown">
      <viewer :value="info.markdown" />
    </div>
    <req-table :info="info" />
    <res-table :info="info" />
  </div>
</template>

<script>
import ResTable from './ResTable'
import ReqTable from './ReqTable'
import apiStatus from '~/contants/apiStatus'
import apiMethod from '~/contants/apiMethod'
import { getLocalProxyDomainAndProject } from '~/config'

const opts = {
  name: 'ApiDetailsPreview',
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },

  components: {
    ResTable,
    ReqTable,
  },
  computed: {
    computeApiStatusConfig() {
      return apiStatus.mapObjectByValueFn(this.info.status)
    },
    computeApiMethodConfig() {
      return apiMethod.mapObjectByValueFn(this.info.method)
    },
    computeIsServer() {
      return process.server
    },
    computeMockUrl() {
      const { serviceId, id, path } = this.info

      return `${getLocalProxyDomainAndProject()}/mock/${serviceId}-${id}${path}`
    },
  },
  methods: {
    onMockUrlClick() {
      window.open(this.computeMockUrl)
    },
  },
}

if (!process.server) {
  const toastui = require('@toast-ui/vue-editor')
  if (!opts.components) {
    opts.components = {}
  }
  opts.components.Viewer = toastui.Viewer
}

export default opts
</script>

<style lang="less">
.preview[data-component-api-details-preview] {
  padding-left: 20px;

  .preview {
    &__title {
      clear: both;
      font-weight: 400;
      margin-top: 0.48rem;
      margin-bottom: 0.16rem;
      border-left: 3px solid #2395f1;
      padding-left: 8px;
    }

    &__base-info {
      margin: 8px 0;
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
      float: left;
      font-size: 13px;

      .info-row {
        margin-bottom: 15px;
        line-height: 36px;
      }

      .col-key {
        font-weight: 700;
        text-align: left;
        width: 100px;
        padding-left: 10px;
      }

      .col-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .col-value {
      }
    }

    &__req {
      margin: 8px 0;
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
      float: left;

      .col-title {
        margin-bottom: 5px;
      }
    }

    &__res {
      margin: 8px 0;
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
      float: left;

      .col-title {
        margin-bottom: 5px;
      }
    }

    &__markdown {
      margin: 0px;
      padding: 0px 20px;
      float: none;
    }
  }
}
</style>

<style lang="less">
.preview[data-component-api-details-preview] {
  .preview__markdown {
    p {
      margin: 10px 0;
      color: #555;
    }
  }
}
</style>
