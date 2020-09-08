<template>
  <Drawer
    class-name="people-layout"
    placement="right"
    :inner="true"
    :transfer="false"
    :closable="false"
    :scrollable="true"
    :title="computeTitle"
    :value="value"
    @on-close="$emit('change', false)"
  >
    <template v-if="info">
      <div
        v-for="obj of $options.infoKLMap"
        :key="obj.k"
        class="info-item"
        :class="`info-item-${obj.k}`"
      >
        <div class="info-item__lable">{{ obj.l }}</div>
        <span>：</span>
        <span
          v-if="!$options.notUseCommonComponent.includes(obj.k)"
          class="info-item__value"
          >{{ mapVal(obj) || '未知' }}
        </span>
        <span v-if="obj.k === 'avatar'">
          <Avatar
            icon="ios-person"
            :src="!avatarError[info.id] ? mapVal(obj) : undefined"
            @on-error="onAvatarError(info.id)"
          />
        </span>
      </div>
    </template>
  </Drawer>
</template>

<script>
export default {
  name: 'UserDetailDrawer',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: Boolean,
    info: {
      type: Object,
      default: () => {},
    },
    getGroupInfoResList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      avatarError: {},
    }
  },
  notUseCommonComponent: ['avatar'],
  infoKLMap: [
    {
      k: 'avatar',
      l: '头像',
    },
    {
      k: 'account',
      l: '账号',
    },
    {
      k: 'realname',
      l: '姓名',
    },
    {
      k: 'role',
      l: '角色',
    },
    {
      k: 'dept',
      l: '单位',
      render(k, info, getGroupInfoResList) {
        const deptId = info[k]

        const mapVal = (id, list) => {
          let returnVal
          for (const group of list) {
            if (Array.isArray(group.children) && group.children.length) {
              returnVal = mapVal(id, group.children)
            } else if (id === group.groupId) {
              returnVal = group.title
            }

            if (returnVal) {
              break
            }
          }

          return returnVal
        }

        const res = mapVal(deptId, getGroupInfoResList)

        return res
      },
    },
    {
      k: 'phone',
      l: '手机',
    },
    {
      k: 'qq',
      l: 'q q',
    },
    {
      k: 'email',
      l: '邮件',
    },
  ],
  computed: {
    computeTitle() {
      const { realname } = this.info || {}

      let res = '用户信息'
      if (realname) {
        res += `_${realname}`
      }

      return res
    },
  },
  methods: {
    mapVal(obj) {
      const { k, render } = obj
      const { info, getGroupInfoResList } = this

      let res
      if (render) {
        res = render.call(this, k, info, getGroupInfoResList)
      } else {
        res = info[k]
      }

      return res
    },
    onAvatarError(id) {
      this.avatarError[id] = true
    },
  },
}
</script>

<style lang="less" scoped>
.info-item {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  font-size: 14px;

  &-avatar {
    align-items: center;
  }
  &__lable {
    min-width: 35px;
    width: 35px;
    text-align: justify;
    text-align-last: justify;
  }
}
</style>
