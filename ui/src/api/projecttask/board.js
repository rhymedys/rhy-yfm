/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-09-12 14:28:47
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-08 15:50:27
 */
import request from '@/utils/request'

/**
 *   分页查询任务审核列表
 *
 * @export
 * @param {*} params
 * @returns
 */
export function reqeustBoardStoryBoardInfoByProduct(params) {


  return request( {
    url: 'projecttask/board/storyBoardInfoByProduct',
    params,
  })
}

/**
 *  根据项目查看最新计划需求进度看版
 *
 * @export
 * @param {*} params
 * @returns
 */
export function reqeustBoardStoryBoardInfoByProjectId(params) {


  return request( {
    url: 'projecttask/board/storyBoardInfoByProjectId',
    params,
  })
}

/**
 *获取前两周，后两周需求甘特图
 *
 * @export
 * @param {*} params
 * @returns
 */
export function requestBoardRecentWeeksStoryGanttChart(params) {


  return request( {
    url: 'projecttask/board/recentWeeksStoryGanttChart',
    params,
  })
}

/**
 *根据产品计划查看需求进度看版
 *
 * @export
 * @param {*} params
 * @returns
 */
export function requestBoardStoryBoardInfoByProductPlan(params) {


  return request( {
    url: 'projecttask/board/storyBoardInfoByProductPlan',
    params,
  })
}

/**
 *根据项目计划查看需求进度看版
 *
 * @export
 * @param {*} params
 * @returns
 */
export function requestBoardStoryBoardInfoByProjectBuild(params) {


  return request( {
    url: 'projecttask/board/storyBoardInfoByProjectBuild',
    params,
  })
}
