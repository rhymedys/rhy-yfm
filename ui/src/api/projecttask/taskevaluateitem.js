/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-16 16:17:49
 */
import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestTaskevaluateitemList(params) {

  return request( {
    url: `projecttask/taskevaluateitem/list`,
    params,
  })
}
