/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-11-28 16:12:49
 */
import request from '@/utils/request'

/**
 * 获取需求信息
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestProductplanQueryAll(params) {

  return request( {
    url: `projecttask/productplan/queryAll`,
    params,
  })
}

/**
 * 分页查询产品计划
 *
 * @export
 * @param {*} params
 * @returns
 */
export function requestProductplanList(params) {

  return request( {
    url: `projecttask/productplan/list`,
    params,
  })
}

/**
 * 查看产品计划详情
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestPlanDetail(id) {

  return request( {
    url: `projecttask/productplan/detail/${id}`,
  })
}
