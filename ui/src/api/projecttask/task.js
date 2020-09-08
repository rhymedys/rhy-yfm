/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-08 15:48:54
 */
import request from '@/utils/request'


/**
 *   分页查询任务审核列表
 *
 * @export
 * @param {*} params
 * @returns
 */
export function reqeustTaskList(params) {





  return request({
    url: 'projecttask/task/list',
    params,
  })
}

/**
 * 请求任务开始
 *
 * @export
 * @param {*} id
 */
export function requestTaskStart(params) {


  return request({
    url: 'projecttask/task/start',
    params,
  })
}

/**
 * 请求任务完成
 *
 * @export
 * @param {*} params
 * @returns
 */
export function requestTaskDone(params) {


  return request({
    url: 'projecttask/task/done',
    params,
  })
}

/**
 * 请求订单详情
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestTaskDetail(id) {

  return request({
    url: `projecttask/task/detail/${id}`,
  })
}

/**
 * q
 *
 * @export
 * @param {*} data
 * @returns
 */
export function requestTaskSignTaskWork(data) {

  return request({
    url: 'projecttask/task/signTaskWork',
    method: 'post',
    data,
  })
}

/**
 * 获取需求信息
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestGetTaskInfoByStoryId(id) {

  return request({
    url: `projecttask/task/getTaskInfosByStoryId/${id}`,
  })
}
