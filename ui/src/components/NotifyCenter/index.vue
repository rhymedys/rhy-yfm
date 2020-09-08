<template>
  <div class="notify-center-dropdown">
    <Dropdown @on-click="onAvatarDrownDownClick">
      <Badge :dot="!!messageUnreadCount">
        <Icon type="ios-notifications-outline" size="18" />
      </Badge>
      <DropdownMenu slot="list"> onAvatarDrownDownClick </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: 'User',
  props: {
    userInfo: {
      type: Object,
      default: () => {},
    },
    messageUnreadCount: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onAvatarDrownDownClick(name) {},
  },
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
