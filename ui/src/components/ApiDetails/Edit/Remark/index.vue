<template>
  <div>
    <h2 class="edit__title">备注</h2>
    <editor :value="info.markdown" />
  </div>
</template>

<script>
const opts = {
  name: 'Remark',
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
}

if (!process.server) {
  const toastui = require('@toast-ui/vue-editor')
  if (!opts.components) {
    opts.components = {}
  }
  opts.components.Editor = toastui.Editor
}

export default opts
</script>
