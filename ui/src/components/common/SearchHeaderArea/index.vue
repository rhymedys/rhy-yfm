<template>
  <row class="wrapper" :gutter="20">
    <!-- <Col span="6">col-8</Col>
    <Col span="6">col-8</Col>
    <Col span="6">col-8</Col>
    <Col span="6">col-8</Col>
    <Col span="6">col-8</Col>
    <Col span="6">col-8</Col>
    <Col span="6">col-8</Col> -->
    <slot></slot>
  </row>
</template>

<script>
export default {
  name: 'SearchHeaderArea',
  // data() {
  //   return {
  //     slotVnode: undefined
  //   }
  // },
  // beforeCreate() {
  //   console.log(this.$slots)
  //   const res = []

  //   this.$slots.default = []

  //   const newSlots = this.$slots.default.filter((val) => {
  //     if (val.tag) {
  //       return true
  //     }

  //     if (val.elm === 'text' || !val.elm) {
  //       if (val.text) {
  //         return !!val.text.trim().length
  //       } else {
  //         return false
  //       }
  //     }
  //   })

  //   while (newSlots.length) {
  //     res.push(newSlots.splice(0, 3))
  //   }

  //   this.slotVnode = Object.freeze(res)
  // },
  // render(createElement) {
  //   return createElement('p', 'No items found.')
  // }
}
</script>

<style lang="less" scoped>
.wrapper {
  margin-bottom: 10px;
}
</style>
