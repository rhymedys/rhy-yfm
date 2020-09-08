<template>
  <div class="edit" data-component-api-details-edit>
    <base-set
      ref="baseConfigRef"
      class="edit-section"
      :info="cloneInfo"
      :classical="classical"
    />
    <req-config
      ref="reqConfigRef"
      class="edit-section"
      :info="cloneInfo"
      @on-req-body-other-change="onReqBodyOtherChange"
      @on-add-form-param-click="onAddFormParamClick"
      @on-add-query-param-click="onAddQueryParamClick"
      @on-add-header-param-click="onAddHeaderParamClick"
      @on-add-jsom-param-click="onAddJsonParamClick"
      @on-remove-json-param-click="onRemoveJsonParamClick"
      @on-remove-header-param-click="onRemoveHeaderParamClick"
      @on-remove-form-param-click="onRemoveFormParamClick"
      @on-remove-query-param-click="onRemoveQueryParamClick"
    />
    <res-config ref="resConfigRef" class="edit-section" :info="cloneInfo" />
    <remark ref="remarkRef" class="edit-section" :info="cloneInfo" />
    <div class="edit-save">
      <i-button type="primary" @click.native="onSaveClick">保存</i-button>
    </div>
  </div>
</template>

<script>
import json5 from 'json5'
import moment from 'moment'
import BaseSet from './BaseSet'
import ReqConfig from './ReqConfig'
import ResConfig from './ResConfig'
import Remark from './Remark'
import { requestServiceinterfaceUpdate } from '~/services/apimgr/serviceinterface'
import { deepCopyData } from '~/utils'
import {
  normalizeApiToTable,
  nomalizeResData,
} from '~/utils/normalizeApiToTable'
import messageMap from '~/contants/apiMessageMap'
import { dataTpl } from '~/utils/apiSchme.js'

export default {
  name: 'Edit',
  components: {
    BaseSet,
    ReqConfig,
    ResConfig,
    Remark,
  },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
    classical: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      cloneInfo: {},
    }
  },
  created() {
    this.cloneInfo = deepCopyData(this.info)
  },
  methods: {
    onReqBodyOtherChange(e) {
      this.cloneInfo.reqBodyOther = e.target.value
    },
    // 添加form表单参数
    onAddFormParamClick() {
      if (!this.cloneInfo.reqBodyForm) {
        this.cloneInfo.reqBodyForm = []
      }

      this.cloneInfo.reqBodyForm.push({
        ...deepCopyData(dataTpl.reqBodyForm),
        localId: dataTpl.reqBodyForm.localId++,
      })
    },
    // 移除form表单参数
    onRemoveFormParamClick(item, i) {
      this.cloneInfo.reqBodyForm.splice(i, 1)
    },
    // 添加query参数
    onAddQueryParamClick() {
      if (!this.cloneInfo.reqQuery) {
        this.cloneInfo.reqQuery = []
      }

      this.cloneInfo.reqQuery.push({
        ...deepCopyData(dataTpl.reqQuery),
        localId: dataTpl.reqQuery.localId++,
      })
    },
    // 移除query表单参数
    onRemoveQueryParamClick(item, i) {
      this.cloneInfo.reqQuery.splice(i, 1)
    },
    // 添加header参数
    onAddHeaderParamClick() {
      if (!this.cloneInfo.reqHeaders) {
        this.cloneInfo.reqHeaders = []
      }

      this.cloneInfo.reqHeaders.push({
        ...deepCopyData(dataTpl.reqHeaders),
        localId: dataTpl.reqHeaders.localId++,
      })
    },
    // 移除header表单参数
    onRemoveHeaderParamClick(item, i) {
      this.cloneInfo.reqHeaders.splice(i, 1)
    },
    // 添加query参数
    onAddJsonParamClick() {
      if (!this.cloneInfo.reqHeaders) {
        this.cloneInfo.reqHeaders = []
      }

      this.cloneInfo.reqHeaders.push({
        ...deepCopyData(dataTpl.reqHeaders),
        localId: dataTpl.reqHeaders.localId++,
      })
    },
    // 移除query表单参数
    onRemoveJsonParamClick(item, i) {
      this.cloneInfo.reqHeaders.splice(i, 1)
    },
    // 点击保存
    async onSaveClick() {
      // 请求表单
      const reqFormData = this.$refs.reqConfigRef.getWholeFormValue()
      // 响应表单
      const resFormData = this.$refs.resConfigRef.getWholeFormValue()
      // 备注
      const remarkData = this.info.markdown
      // 基础信息
      const {
        interfaceCategoryId,
        createTime,
        createUserId,
        desc,
        id,
        method,
        name,
        path,
        queryPath,
        status,
        updateTime,
        version,
        serviceId,
        sort,
      } = this.info

      queryPath.path = path

      const baseData = {
        name,
        interfaceCategoryId,
        id,
        method,
        status,
        desc,
        createTime,
        createUserId,
        path,
        queryPath,
        version,
        sort,
        serviceId,
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      }

      const res = await requestServiceinterfaceUpdate.call(this, {
        ...baseData,
        ...reqFormData,
        ...resFormData,
        markdown: remarkData,
      })

      if (res.data.code === 0) {
        window.location.reload()
      }
    },
  },
}
</script>

<style lang="less">
.edit[data-component-api-details-edit] {
  padding-left: 20px;

  .edit {
    &-save {
      width: 100%;
      text-align: center;
    }

    &-section {
      margin-bottom: 20px;
    }

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
      background-color: rgba(236, 238, 241, 0.67);

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

    &__res {
      &-set {
        .tabs {
          margin-bottom: 10px;
        }
      }
    }

    &__res,
    &__req {
      margin: 8px 0;
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
      float: left;

      .col-title {
        margin-bottom: 5px;
      }

      &-set {
        margin: 8px 0;
        padding: 16px;
        width: 100%;
        box-sizing: border-box;
        font-size: 13px;
        background-color: rgba(236, 238, 241, 0.67);
        text-align: center;

        .body-type {
          display: block;
          text-align: left;
          margin-bottom: 10px;
        }

        .import-form-btn,
        .import-json-btn {
          display: block;
        }

        .jsonbody,
        .headerbody,
        .querybody,
        .formbody {
          margin-top: 10px;

          &__mock,
          &__schemaType,
          &__require,
          &__type {
            text-align: initial;
          }

          &__remove {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
        }

        .jsonbody {
          &__name {
            display: flex;
            flex-direction: row;
            align-items: center;
            > div {
              position: relative;
              width: 100%;
              .expand {
                position: absolute;
                left: -25px;
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }
          .children-area {
            width: 100%;
          }
        }
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
.edit[data-component-api-details-edit] {
  .edit__markdown {
    p {
      margin: 10px 0;
      color: #555;
    }
  }

  .headerbody {
    .ivu-select-dropdown-list {
      height: 250px;
      text-align: initial;
    }
  }
}
</style>
