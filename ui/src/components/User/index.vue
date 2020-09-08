<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="onNotifyCenterClick">
      <Badge>
        <Avatar size="small" :src="userInfo.userAvatar" />
      </Badge>
      <span class="user-avatar__name">{{ userInfo.realname }}</span>
      <DropdownMenu slot="list">
        <DropdownItem name="message">menu1</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { clearLoginInfo } from '~/utils/token'
export default {
  name: 'User',
  props: {
    userInfo: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    onNotifyCenterClick(name) {
      switch (name) {
        case 'logout':
          const loginUrl = window.location.href.replace(/workspace.*$/, 'login')

          clearLoginInfo()

          window.location.replace(loginUrl)
          break

        // case 'message':
        //   this.message()
        //   break

        default:
          break
      }
    },
  },
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
