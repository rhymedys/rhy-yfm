/*
 * swagger ui 说明文档 ：https://mp.mhealth100.com/hmgateway/swagger-ui.html?urls.primaryName=%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86#/
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-02 15:55:32
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-20 12:56:15
 */
import request from '@/utils/request'

/**
 * 添加任务评估审核内容
 *
 * @export
 * @param {*} data
 * @returns
 */
export function requestAddTaskEvaluateCheckContent(data) {


  return request( {
    url: 'projecttask/taskevaluatecheck/addTaskEvaluateCheckContent',
    method: 'post',
    data,
  })
}

/**
 *   分页查询任务审核列表
 *
 * @export
 * @param {*} params
 * @returns
 */
export function reqeustTaskevaluatecheckList(params) {


  return request( {
    url: 'projecttask/taskevaluatecheck/listInfo',
    params,
  })
}

/**
 *  查看任务审核列表详情z
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestTaskevaluatecheckDetail(id) {


  return request( {
    url: `projecttask/taskevaluatecheck/list/${id}`,
  })
}

/**
 * 更新任务审核列表
 *
 * @export
 * @param {*} data
 * @returns
 */
export function requestTaskevaluatecheckUpdate(data) {


  return request( {
    url: 'projecttask/taskevaluatecheck/update',
    method: 'post',
    data,
  })
}

/**
 * 审核任务评估时间
 *
 * @export
 * @param {*} data
 * @returns
 */
export function requestTaskevaluatecheckCheckTaskEvaluateCheck(data) {


  return request( {
    url: 'projecttask/taskevaluatecheck/checkTaskEvaluateCheck',
    method: 'post',
    data,
  })
}
