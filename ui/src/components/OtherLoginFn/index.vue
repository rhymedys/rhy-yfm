<template>
  <div class="login-fn">
    <span>其它登录方式</span>
    <img
      v-for="fn of $options.otherLoginFn"
      :key="fn.key"
      :alt="fn.key"
      :src="fn.icon"
      @click="$emit('on-other-login-click', fn.key)"
    />
    <a class="login-fn__forget-pw" @click="$emit('on-forget-pw-click')">
      忘记密码
    </a>
    <a class="login-fn__register" @click="$emit('on-register-click')">
      注册账号
    </a>
  </div>
</template>
<script>
export default {
  name: 'OtherLoginFn',
  otherLoginFn: [
    {
      key: 'wechat',
      icon: require('../../assets/svg/icon_wechat.svg'),
    },
    {
      key: 'qq',
      icon: require('../../assets/svg/icon_qq.svg'),
    },
    {
      key: 'weibo',
      icon: require('../../assets/svg/icon_weibo.svg'),
    },
  ],
}
</script>
<style lang="less" scoped>
.login-fn {
  margin: 24px 0;
  text-align: left;

  span {
    font-size: 14px;
  }

  img {
    width: 24px;
    margin-left: 16px;
    cursor: pointer;
    vertical-align: middle;
    opacity: 0.7;
    transition: all 0.2s ease-in-out;
  }

  &__register,
  &__forget-pw {
    float: right;
  }

  &__register {
    margin-right: 10px;
  }
}
</style>
