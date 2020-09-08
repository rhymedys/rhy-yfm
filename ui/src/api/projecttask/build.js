/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-20 17:03:00
 */
import request from '@/utils/request'

/**
 * 获取需求信息
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestBuildQueryAll(params) {

  return request( {
    url: `projecttask/build/queryAll`,
    params,
  })
}
