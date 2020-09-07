<template>
  <footer class="footer">
    <div class="footer__link">
      <a
        v-for="link of $options.links"
        :key="link[1]"
        :href="link[1]"
        target="_blank"
      >
        {{ link[0] }}
      </a>
    </div>
    <div class="footer__copyright">Copyright © 2019 rhymedys@gmail.com</div>
  </footer>
</template>

<script>
export default {
  name: 'CopyrightFooter',
  links: [
    ['关于我们', 'https://github.com/rhymedys'],
    ['关于项目', 'https://github.com/rhymedys/rhy-dev-progress-manager.git'],
  ],
}
</script>

<style lang="less" scoped>
.footer {
  display: block;
  margin: 48px 0 24px 0;
  padding: 0 16px;
  text-align: center;

  &__link {
    margin-bottom: 8px;
    a {
      font-size: 14px;
      color: #808695;
      transition: all 0.2s ease-in-out;
    }
  }

  &__copyright {
    color: #808695;
    font-size: 14px;
  }
}
</style>
