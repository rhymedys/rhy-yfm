/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-11-28 14:51:30
 */
import request from '@/utils/request'

/**
 * 获取需求信息
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestStoryDetail(id) {

  return request( {
    url: `projecttask/story/detail/${id}`,
  })
}

/**
 *  查询需求的发版计划
 *
 * @export
 * @param {*} storys
 * @returns
 */
export function requestStoryGetStorysBuild(storys) {

  return request( {
    url: `projecttask/story/getStorysBuild`,
    params: {
      storys,
    },
  })
}

/**
 * 分页查询需求
 *
 * @export
 * @param {*} params
 * @returns
 */
export function requestStoryList(params) {

  return request( {
    url: `projecttask/story/list`,
    params,
  })
}

/**
 *更新需求计划与排序
 *
 * @export
 * @param {*} data
 * @returns
 */
export function requestStoryUpdateStoryPlanAndQueue(data) {


  return request( {
    url: 'projecttask/story/updateStoryPlanAndQueue',
    method: 'post',
    data,
  })
}
