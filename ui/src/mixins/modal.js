/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-11-18 21:44:21
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-11-18 21:45:23
 */

export default {
  mounted() {
    // 看源码,代理其方法
    // eslint-disable-next-line no-new-func
    const orginOk = this.$refs.modalRef.ok
    const refFn = function () {
      orginOk()
      // 此this非彼this
      if (!this.loading) {
        this.visible = true
        this.$emit('input', true)
      }
    }

    this.$refs.modalRef.ok = refFn.bind(this.$refs.modalRef)
  },
}
