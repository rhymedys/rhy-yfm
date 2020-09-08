<template>
  <div>
    <svg-icon icon-class="github" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'RhyGit',
  data() {
    return {
      url: 'https://github.com/rhymedys/rhy-yfm.git'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
