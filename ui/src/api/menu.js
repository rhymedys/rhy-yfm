import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  // return request({
  //   url: '/getRouters',
  //   method: 'get'
  // })

  return Promise.resolve({
    "msg": "操作成功",
    "code": 0,
    "data": [

    {
        // "name": "Display",
        // "path": "/Display",
        // "hidden": false,
        // "component": "Layout",
        // "meta": {
        //   "title": "看板",
        //   "icon": "system"
        // },

        "name": "Display",
        "path": "/display",
        "hidden": false,
        "redirect": "noRedirect",
        "component": "Layout",
        "alwaysShow": false,
        "meta": {
          "title": "看板",
          "icon": "system"
        },
        "children": [{
          "name": "DisplayIndex",
          "path": "displayindex",
          "hidden": false,
          "component": "Display/DisplayIndex/index",
          "meta": {
            "title": "看板",
            "icon": "user"
          },
        },]
    },
    {
        "name": "Auditing",
        "path": "/auditing",
        "hidden": false,
        "redirect": "noRedirect",
        "component": "Layout",
        "alwaysShow": true,
        "meta": {
          "title": "审核",
          "icon": "system"
        },
        "children": [{
          "name": "AuditingList",
          "path": "list",
          "hidden": false,
          "component": "Auditing/List/index",
          "meta": {
            "title": "审核列表",
            "icon": "user"
          },
        }, {
          "name": "AuditingOverview",
          "path": "overview",
          "hidden": false,
          "component": "Auditing/Overview/index",
          "meta": {
            "title": "任务情况",
            "icon": "user"
          }
        }]
      },
          {
        "name": "Story",
        "path": "/story",
        "hidden": false,
        "redirect": "noRedirect",
        "component": "Layout",
        "alwaysShow": true,
        "meta": {
          "title": "需求",
          "icon": "system"
        },
        "children": [{
          "name": "List",
          "path": "list",
          "hidden": false,
          "component": "Story/List/index",
          "meta": {
            "title": "需求列表",
            "icon": "user"
          },
        }, {
          "name": "Manager",
          "path": "manager",
          "hidden": false,
          "component": "Story/Manager/index",
          "meta": {
            "title": "需求管理",
            "icon": "user"
          }
        },
{
          "name": "Plan",
          "path": "plan",
          "hidden": false,
          "component": "Story/Plan/index",
          "meta": {
            "title": "需求计划",
            "icon": "user"
          }
        },
        ]
      },
                
      // {
      //   "name": "System",
      //   "path": "/system",
      //   "hidden": false,
      //   "redirect": "noRedirect",
      //   "component": "Layout",
      //   "alwaysShow": true,
      //   "meta": {
      //     "title": "系统管理",
      //     "icon": "system"
      //   },
      //   "children": [{
      //     "name": "User",
      //     "path": "user",
      //     "hidden": false,
      //     "component": "system/user/index",
      //     "meta": {
      //       "title": "用户管理",
      //       "icon": "user"
      //     }
      //   }, {
      //     "name": "Role",
      //     "path": "role",
      //     "hidden": false,
      //     "component": "system/role/index",
      //     "meta": {
      //       "title": "角色管理",
      //       "icon": "peoples"
      //     }
      //   }, {
      //     "name": "Menu",
      //     "path": "menu",
      //     "hidden": false,
      //     "component": "system/menu/index",
      //     "meta": {
      //       "title": "菜单管理",
      //       "icon": "tree-table"
      //     }
      //   }, {
      //     "name": "Dept",
      //     "path": "dept",
      //     "hidden": false,
      //     "component": "system/dept/index",
      //     "meta": {
      //       "title": "部门管理",
      //       "icon": "tree"
      //     }
      //   }, {
      //     "name": "Post",
      //     "path": "post",
      //     "hidden": false,
      //     "component": "system/post/index",
      //     "meta": {
      //       "title": "岗位管理",
      //       "icon": "post"
      //     }
      //   }, {
      //     "name": "Dict",
      //     "path": "dict",
      //     "hidden": false,
      //     "component": "system/dict/index",
      //     "meta": {
      //       "title": "字典管理",
      //       "icon": "dict"
      //     }
      //   }, {
      //     "name": "Config",
      //     "path": "config",
      //     "hidden": false,
      //     "component": "system/config/index",
      //     "meta": {
      //       "title": "参数设置",
      //       "icon": "edit"
      //     }
      //   }, {
      //     "name": "Notice",
      //     "path": "notice",
      //     "hidden": false,
      //     "component": "system/notice/index",
      //     "meta": {
      //       "title": "通知公告",
      //       "icon": "message"
      //     }
      //   }, {
      //     "name": "Log",
      //     "path": "log",
      //     "hidden": false,
      //     "redirect": "noRedirect",
      //     "component": "system/log/index",
      //     "alwaysShow": true,
      //     "meta": {
      //       "title": "日志管理",
      //       "icon": "log"
      //     },
      //     "children": [{
      //       "name": "Operlog",
      //       "path": "operlog",
      //       "hidden": false,
      //       "component": "monitor/operlog/index",
      //       "meta": {
      //         "title": "操作日志",
      //         "icon": "form"
      //       }
      //     }, {
      //       "name": "Logininfor",
      //       "path": "logininfor",
      //       "hidden": false,
      //       "component": "monitor/logininfor/index",
      //       "meta": {
      //         "title": "登录日志",
      //         "icon": "logininfor"
      //       }
      //     }]
      //   }]
      // },
      // {
      //   "name": "Monitor",
      //   "path": "/monitor",
      //   "hidden": false,
      //   "redirect": "noRedirect",
      //   "component": "Layout",
      //   "alwaysShow": true,
      //   "meta": {
      //     "title": "系统监控",
      //     "icon": "monitor"
      //   },
      //   "children": [{
      //     "name": "Online",
      //     "path": "online",
      //     "hidden": false,
      //     "component": "monitor/online/index",
      //     "meta": {
      //       "title": "在线用户",
      //       "icon": "online"
      //     }
      //   }, {
      //     "name": "Job",
      //     "path": "job",
      //     "hidden": false,
      //     "component": "monitor/job/index",
      //     "meta": {
      //       "title": "定时任务",
      //       "icon": "job"
      //     }
      //   }, {
      //     "name": "Druid",
      //     "path": "druid",
      //     "hidden": false,
      //     "component": "monitor/druid/index",
      //     "meta": {
      //       "title": "数据监控",
      //       "icon": "druid"
      //     }
      //   }, {
      //     "name": "Server",
      //     "path": "server",
      //     "hidden": false,
      //     "component": "monitor/server/index",
      //     "meta": {
      //       "title": "服务监控",
      //       "icon": "server"
      //     }
      //   }]
      // },
      // {
      //   "name": "Tool",
      //   "path": "/tool",
      //   "hidden": false,
      //   "redirect": "noRedirect",
      //   "component": "Layout",
      //   "alwaysShow": true,
      //   "meta": {
      //     "title": "系统工具",
      //     "icon": "tool"
      //   },
      //   "children": [{
      //     "name": "Build",
      //     "path": "build",
      //     "hidden": false,
      //     "component": "tool/build/index",
      //     "meta": {
      //       "title": "表单构建",
      //       "icon": "build"
      //     }
      //   }, {
      //     "name": "Gen",
      //     "path": "gen",
      //     "hidden": false,
      //     "component": "tool/gen/index",
      //     "meta": {
      //       "title": "代码生成",
      //       "icon": "code"
      //     }
      //   }, {
      //     "name": "Swagger",
      //     "path": "swagger",
      //     "hidden": false,
      //     "component": "tool/swagger/index",
      //     "meta": {
      //       "title": "系统接口",
      //       "icon": "swagger"
      //     }
      //   }]
      // },
      {
        "name": "https://github.com/rhymedys",
        "path": "https://github.com/rhymedys",
        "hidden": false,
        "component": "Layout",
        "meta": {
          "title": "关于作者",
          "icon": "guide"
        }
      }
    ]
  })
}
