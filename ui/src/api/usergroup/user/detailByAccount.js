/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2020-09-08 11:29:32
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-08 11:31:24
 */


import request from '@/utils/request'


export default function (detailByAccount) {
  return request({
    url: `/usergroup/user/detailByAccount/${detailByAccount}`,
    method: 'get'
  })
}
