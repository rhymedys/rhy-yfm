<template>
  <div
    class="apimgr-service-edit-or-build"
    data-component-apimgr-service-edit-or-build
  >
    <Form
      ref="infoRef"
      :model="info"
      :label-width="80"
      :rules="infoRuleValidate"
    >
      <FormItem label="项目名称" prop="name">
        <Input v-model="info.name" placeholder="项目名称" />
      </FormItem>
      <FormItem label="基本路径" prop="basePath">
        <Input v-model="info.basePath" placeholder="基本路径" />
      </FormItem>
      <FormItem label="swaggerUrl">
        <Input v-model="info.swaggerUrl" placeholder="swaggerUrl" />
      </FormItem>
      <FormItem label="应用url">
        <Input v-model="info.url" placeholder="应用url" />
      </FormItem>
      <FormItem label="描述">
        <Input
          v-model="info.remark"
          type="textarea"
          :rows="4"
          placeholder="描述"
        />
      </FormItem>
    </Form>
    <span class="add">
      <Button @click.native="$emit('on-back-click')">返回</Button>
      <Button type="primary" @click.native="onOkProxy">保存</Button>
    </span>
  </div>
</template>

<script>
import { tagColor } from '~/contants/color'
import appConfig from '~/config'

import {
  requestServiceSave,
  requestServiceUpdate,
} from '~/services/apimgr/service'

function invokeSaveOrUpdateService() {
  const { contentType } = this

  let res

  if (contentType === 'build') {
    res = requestServiceSave.call(this, {
      ...this.info,
      icon: '',
      tpProjectId: String(appConfig.projectId),
    })
  } else if (contentType === 'edit') {
    res = requestServiceUpdate.call(this, {
      ...this.info,
      icon: '',
    })
  }

  return res
}

export default {
  name: 'ApimgrServiceEditOrBuild',
  props: {
    contentType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      info: {},
      infoRuleValidate: {
        name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
        ],
        basePath: [
          { required: true, message: '基本路径不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  beforeMount() {
    if (this.contentType === 'edit') {
      this.info = this.$parent.$parent.$data.editInfo
    }
  },
  methods: {
    mapAvatarStyle(item, i) {
      const res = {}

      const index = i % tagColor.length

      res.background = tagColor[index]

      return res
    },
    onOkProxy() {
      this.$refs.infoRef.validate(async (valid) => {
        if (valid) {
          const res = await invokeSaveOrUpdateService.call(this)
          if (res.data.code === 0) {
            this.$emit('on-save-click')
          } else {
            this.$Message.error(res.data.msg)
          }
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.apimgr-service-edit-or-build {
  display: flex;
  flex-direction: column;

  .add {
    margin-bottom: 10px;
  }
}
</style>
