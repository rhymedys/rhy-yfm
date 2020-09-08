/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-05 17:18:44
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-08-05 17:39:49
 */

import { showTitle } from '~/utils'
export default {
  methods: {
    showTitle(item) {
      return showTitle(item, this)
    },
    showChildren(item) {
      return (
        item.children &&
        (item.children.length > 1 || (item.meta && item.meta.showAlways))
      )
    },
    getNameOrHref(item, children0) {
      return item.href
        ? `isTurnByHref_${item.href}`
        : children0
        ? item.children[0].name
        : item.name
    },
  },
}
