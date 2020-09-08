/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-16 09:41:30
 */
import request from '@/utils/request'

/**
 *   分页查询任务审核列表
 *
 * @export
 * @param {*} params
 * @returns
 */
export function reqeustTaskestimateQueryAll(params) {


  return request( {
    url: `projecttask/taskestimate/queryAll`,
    params,
  })
}
