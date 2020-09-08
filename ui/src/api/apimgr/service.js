/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-23 10:30:48
 */
import request from '@/utils/request'

/**
 * 通用查询应用接口
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestServiceQueryAll(params) {

  return request( {
    url: `apimgr/service/queryAll`,
    params,
  })
}

/**
 * 查看应用详情接口
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestServiceDetail(id) {

  return request( {
    url: `apimgr/service/queryAll/${id}`,
  })
}

/**
 *  添加应用接口
 *
 * @export
 * @param {*} data
 * @returns
 */
export function requestServiceSave(data) {

  return request( {
    url: 'apimgr/service/save',
    method: 'post',
    data,
  })
}

/**
 *  更新应用接口
 *
 * @export
 * @param {*} data
 * @returns
 */
export function requestServiceUpdate(data) {

  return request( {
    url: 'apimgr/service/update',
    method: 'post',
    data,
  })
}
