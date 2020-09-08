import request from '@/utils/request'

// 登录方法
export function login(account, password, code, uuid) {
  const params = {
    account,
    password,
    code,
    uuid
  }
  return request({
    url: '/usergroup/auth/login',
    method: 'get',
    params
  })
}

// 获取用户详细信息
export function getInfo() {
  // return request({
  //   url: '/getInfo',
  //   method: 'get'
  // })

  return Promise.resolve({
    "msg": "操作成功",
    "code": 0,
    "permissions": ["*:*:*"],
    "roles": ["admin"],
    "user": {
      "searchValue": null,
      "createBy": "admin",
      "createTime": "2018-03-16 11:33:00",
      "updateBy": null,
      "updateTime": null,
      "remark": "管理员",
      "params": {},
      "userId": 1,
      "deptId": 103,
      "userName": "admin",
      "nickName": "若依",
      "email": "ry@163.com",
      "phonenumber": "15888888888",
      "sex": "1",
      "avatar": "",
      "salt": null,
      "status": "0",
      "delFlag": "0",
      "loginIp": "127.0.0.1",
      "loginDate": "2018-03-16T11:33:00.000+0800",
      "dept": {
        "searchValue": null,
        "createBy": null,
        "createTime": null,
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "params": {},
        "deptId": 103,
        "parentId": 101,
        "ancestors": null,
        "deptName": "研发部门",
        "orderNum": "1",
        "leader": "若依",
        "phone": null,
        "email": null,
        "status": "0",
        "delFlag": null,
        "parentName": null,
        "children": []
      },
      "roles": [{
        "searchValue": null,
        "createBy": null,
        "createTime": null,
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "params": {},
        "roleId": 1,
        "roleName": "超级管理员",
        "roleKey": "admin",
        "roleSort": "1",
        "dataScope": "1",
        "status": "0",
        "delFlag": null,
        "flag": false,
        "menuIds": null,
        "deptIds": null,
        "admin": true
      }],
      "roleIds": null,
      "postIds": null,
      "admin": true
    }

  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}
