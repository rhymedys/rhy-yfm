/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-08 15:52:39
 */
import request from '@/utils/request'

/**
 * 通用查询应用接口
 *
 * @export
 * @param {*} id
 * @returns
 */
export function requestInterfacecategoryQueryAll(params) {

  return request( {
    url: `apimgr/interfacecategory/queryAll`,
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
export function requestInterfacecategoryDetail(id) {

  return request( {
    url: `apimgr/interfacecategory/queryAll/${id}`,
  })
}

/**
 *  添加应用接口
 *
 * @export
 * @param {*} data
 * @returns
 */
export function requestInterfacecategorySave(data) {

  return request( {
    url: 'apimgr/interfacecategory/save',
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
export function requestInterfacecategoryUpdate(data) {

  return request( {
    url: 'apimgr/interfacecategory/update',
    method: 'post',
    data,
  })
}

/**
 *  查询所有分类下的api
 *
 * @export
 * @param {*} data
 * @returns
 */
export function requestInterfacecategoryQueryAllCategoryApis(params) {

  return request( {
    url: 'apimgr/interfacecategory/queryAllCategoryApis',
    params,
  })
}
