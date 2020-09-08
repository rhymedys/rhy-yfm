/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-05 17:21:37
 * @Last Modified by:   Rhymedys
 * @Last Modified time: 2019-08-05 17:21:37
 */

export default {
  props: {
    parentItem: {
      type: Object,
      default: () => {},
    },
    theme: String,
    iconSize: Number,
  },
  computed: {
    parentName() {
      return this.parentItem.name
    },
    children() {
      return this.parentItem.children
    },
    textColor() {
      return this.theme === 'dark' ? '#fff' : '#495060'
    },
  },
}
