/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2020-09-08 11:32:00
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-10 16:37:26
 */

import {
  login,
  logout,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import requestDetailByAccount from '../../api/usergroup/user/detailByAccount'
import Cookies from "js-cookie";

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    invokeSetToken: (state, token) => {
      state.token = token
    },
    invokeSetName: (state, name) => {
      state.name = name
    },
    invokeSetAvatar: (state, avatar) => {
      state.avatar = avatar
    },
    invokeSetRoles: (state, roles) => {
      state.roles = roles
    },
    invokeSetPermissions: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    dispatchLogin({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.data.token)
          commit('invokeSetToken', res.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    dispatchGetInfo({
      commit,
      state
    }) {
      return new Promise(async (resolve, reject) => {

        const [requestDetailByAccountRes, getInfoRes] = await Promise.all([
          requestDetailByAccount(Cookies.get("yfmusername")),
          getInfo(state.token)
        ]).catch((error) => {
          reject(error)
        })


        const user = getInfoRes.user

        user.userName = requestDetailByAccountRes.data.realname
        user.avatar = requestDetailByAccountRes.data.avatar


        if (!getInfoRes.roles) {
          getInfoRes.roles = []
        }

        getInfoRes.roles.push('dev')

        if (getInfoRes.roles && getInfoRes.roles.length) { // 验证返回的roles是否是一个非空数组
          commit('invokeSetRoles', getInfoRes.roles)
          commit('invokeSetPermissions', getInfoRes.permissions)
        } else {
          commit('invokeSetRoles', ['ROLE_DEFAULT'])
        }

        commit('invokeSetName', user.userName)
        commit('invokeSetAvatar', user.avatar)
        resolve(getInfoRes)

      })
    },

    // 退出系统
    dispatchLogout({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        commit('invokeSetToken', '')
        commit('invokeSetRoles', [])
        commit('invokeSetPermissions', [])
        removeToken()

        resolve()

        // logout(state.token).then(() => {
        //   commit('invokeSetToken', '')
        //   commit('invokeSetRoles', [])
        //   commit('invokeSetPermissions', [])
        //   removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    dispatchFedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('invokeSetToken', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
