/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-09-25 22:33:59
 */
import request from '@/utils/request'

/**
 * 通用查询应用接口
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestServiceinterfaceQueryAll(params) {

  return request( {
    url: `apimgr/serviceinterface/queryAll`,
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
export function requestServiceinterfaceDetail(id) {

  return request( {
    url: `apimgr/serviceinterface/detail/${id}`,
  })
}

/**
 *  添加应用接口
 *
 * @export
 * @param {*} data
 * @returns
 */
export function requestServiceinterfaceSave(data) {

  return request( {
    url: 'apimgr/serviceinterface/save',
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
export function requestServiceinterfaceUpdate(data) {

  return request( {
    url: 'apimgr/serviceinterface/update',
    method: 'post',
    data,
  })
}
