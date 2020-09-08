/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-10-18 15:19:56
 */
import request from '@/utils/request'

/**
 *   分页查询Bug
 *
 * @export
 * @param {*} params
 * @returns
 */
export function reqeustBugList(params) {


  return request( {
    url: 'projecttask/bug/list',
    params,
  })
}

/**
 *  查看Bug详情
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestBugDetail(id) {


  return request( {
    url: `projecttask/bug/detail/${id}`,
  })
}
