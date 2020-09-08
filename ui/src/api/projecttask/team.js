/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-10-15 14:41:30
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-10-15 15:39:32
 */

import request from '@/utils/request'

/**
 *  获取项目团队研发人员
 *
 * @export getTeamDevelopsRes
 * @param {*} params
 * @returns
 */
export function requestGetTeamDevelops(params) {

  return request( {
    url: `projecttask/team/getTeamDevelops`,
    params,
  })
}
