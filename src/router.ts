import Vue from "vue";
import Router from "vue-router";
// 路由懒加载
const _import_ = (file: string) => () => import(`@/views/${file}.vue`);
import Layout from "@/views/layout/index.vue";
import homePage from './views/homePage/homePage.vue';
import errorPage404 from "@/views/errorPage/404.vue";

Vue.use(Router);

export const constantRouterMap = [
  {
    path: "/login",
    name: "login",
    component: _import_("login/index"),
    hidden: true
  },
  {
    path: "/about",
    name: "about",
    component: _import_("about/index"),
    hidden: true,
    meta: {
      title: '关于我们'
    }
  },
  {
    path: "/screen",
    name: "screen",
    component: _import_("screen/index"),
    hidden: true,
    meta: {
      title: '可视化大屏'
    }
  },
];

export const asyncRoute = [
  
  {
    path: "",
    name: 'home',
    component: Layout,
    redirect: "/page",
    alwaysShow: true,
    meta: {
      title: "首页",
      icon: "icon-home",
    },
    children: [
      {
        path: 'page',
        name: 'page',
        component: _import_("homePage/homePage"),
        meta: {
          title: "首页",
          icon: "icon-home",

        }
      }
    ]
  },
  {
    path: "/",
    name: 'screen',
    component: Layout,
    redirect: "/screen",
    alwaysShow: true,
    meta: {
      title: "可视化大屏",
      icon: "icon-Frame5",
    },
    children: [
      {
        path: 'screen',
        name: 'screen',
        component: _import_("screen/index"),
        meta: {
          title: "可视化大屏",
          icon: "icon-Frame5",

        }
      }
    ]
  },
  {
    path: "/security",
    name: "security",
    component: Layout,
    redirect: "/security/importantPerson",
    alwaysShow: false,
    meta: {
      title: "智能应用",
      icon: "icon-video",
    },
    children: [
      {
        name: "importantPerson",
        path: "importantPerson",
        component: _import_("security/importantPerson/index"),
        meta: {
          title: "关注人员",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "importantArea",
        path: "importantArea",
        component: _import_("security/importantArea/index"),
        meta: {
          title: "区域管理",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "onePerson",
        path: "onePerson",
        component: _import_("technology/onePerson/index"),
        meta: {
          title: "身份搜索",
          icon: "icon-xiaoqu"
        }
      },

      {
        name: "alarm",
        path: "alarm",
        component: _import_("security/alarm/index"),
        meta: {
          title: "预警中心",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "caller ",
        path: "caller",
        component: _import_("personManage/vistorManage/index"),
        meta: {
          title: "访客登记",
          icon: "icon-fangkeguanli",
        }
      },

    ]

  },
  {
    path: "/personPass",
    name: "personPass",
    component: Layout,
    redirect: "/personPass/list",
    alwaysShow: false,
    meta: {
      title: "智能通行",
      icon: "icon-personlog",
    },
    children: [
      {
        name: "list",
        path: "list",
        component: _import_("personPass/index"),
        meta: {
          title: "门禁通行",
          icon: "icon-personlog",
        }
      },
      {
        name: "capture",
        path: "capture",
        component: _import_("security/capture/index"),
        meta: {
          title: "人像抓拍",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "carCapture",
        path: "carCapture",
        component: _import_("security/carCapture/index"),
        meta: {
          title: "机动车抓拍",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "motoCapture",
        path: "motoCapture",
        component: _import_("security/uncarCapture/index"),
        meta: {
          title: "非机动车抓拍",
          icon: "icon-xiaoqu"
        }
      }
    ]
  },
  {
    path: "/monitor",
    name: "monitor",
    component: Layout,
    redirect: "/monitor/monitor",
    alwaysShow: true,
    meta: {
      title: "监控中心",
      icon: "icon-shexiangji",
    },
    children: [
      {
        name: "monitor",
        path: "monitor",
        component: _import_("security/monitor/index"),
        meta: {
          title: "监控中心",
          icon: "icon-shexiangji"
        }
      },
    ]
  },
 
  {
    path: "/checkin",
    name: "checkin",
    component: Layout,
    redirect: "/checkin/clock",
    alwaysShow: false,
    meta: {
      title: "考勤管理",
      icon: "icon-checkIn",
    },
    children: [
      {
        name: "schoolset",
        path: "schoolset",
        component: _import_("checkIn/manageSet/school"),
        meta: {
          title: "学生考勤设置",
          icon: "icon-chart",
          bg_color: "#231d75"
        }
      },
      {
        name: "allschool",
        path: "allschool",
        component: _import_("checkIn/schoolManage/index"),
        meta: {
          title: "学生考勤数据",
          icon: "icon-chart",
          bg_color: "#231d75"
        }
      },
      {
        name: "allrecord",
        path: "allrecord",
        component: _import_("checkRecord/allRecord"),
        meta: {
          title: "学生考勤统计",
          icon: "icon-chart",
          bg_color: "#231d75"
        }
      },
      // {
      //   name: "resident",
      //   path: "resident",
      //   component: _import_("checkIn/residentManage"),
      //   meta: {
      //     title: "住宿生考勤",
      //     icon: "icon-chart",
      //     bg_color: "#231d75"
      //   }
      // },
      {
        name: "clock",
        path: "clock",
        component: _import_("checkIn/index"),
        meta: {
          title: "教职工考勤组",
          icon: "icon-chart",
          bg_color: "#231d75"
        }
      },
      {
        name: "_company",
        path: "_company",
        component: _import_("personManage/companyManage/index"),
        meta: {
          title: "教职工考勤数据",
          icon: "icon-fangkeguanli",
          bg_color: "#796273"
        }
      },
      {
        name: "staffrecord",
        path: "staffrecord",
        component: _import_("checkRecord/staffRecord"),
        meta: {
          title: "教职工考勤统计",
          icon: "icon-chart",
          bg_color: "#231d75"
        }
      }

      // {
      //   name: "standard",
      //   path: "standard",
      //   component: _import_("checkIn/standard"),
      //   meta: {
      //     title: "考勤规范",
      //     icon: "icon-fangkeguanli",
      //     bg_color: "#796273"
      //   }
      // },
    ]
  },
  {
    path: "/alertSets",
    name: "alertSets",
    component: Layout,
    redirect: "/alertSets/advices",
    alwaysShow: true,
    meta: {
      title: "信息发布",
      icon: "el-icon-message",
    },
    children: [
      {
        name: "advices",
        path: "advices",
        component: _import_("alertSets/index"),
        meta: {
          title: "信息发布",
          icon: "el-icon-message",
        }
      },
      {
        name: "issue",
        path: "issue",
        component: _import_("alertSets/components/issue"),
        meta: {
          title: "信息发布",
          icon: "el-icon-message",
        },
      }
    ]
  },
  {
    path: "/leaveManage",
    name: "leaveManage",
    component: Layout,
    redirect: "/leaveManage/take",
    alwaysShow: true,
    meta: {
      title: "请假管理",
      icon: "el-icon-s-ticket",
    },
    children: [
      {
        name: "take",
        path: "take",
        component: _import_("leaveManage/index"),
        meta: {
          title: "请假管理",
          icon: "el-icon-s-ticket",
        }
      }
    ]
  },
  {
    path: "/school",
    name: "school",
    component: Layout,
    redirect: "/school/dorm",
    alwaysShow: false,
    meta: {
      title: "校园基础数据",
      icon: "icon-school",
    },
    children: [
      {
        name: "dorm",
        path: "dorm",
        component: _import_("houseManage/dormManage/index"),
        meta: {
          title: "宿舍楼楼宇",
          icon: "icon-churukou",
        }
      },
      {
        name: "classroom",
        path: "classroom",
        component: _import_("houseManage/classroomManage/index"),
        meta: {
          title: "教学楼楼宇",
          icon: "icon-churukou",
        }
      },
      {
        name: "passageway",
        path: "passageway",
        component: _import_("houseManage/passagewayManage/index"),
        meta: {
          title: "出入口",
          icon: "icon-churukou",
        }
      },
      {
        name: "info",
        path: "info",
        component: _import_("gradeInfo/index"),
        meta: {
          title: "班级信息",
          icon: "icon-classMana",
        }
      }
    ]
  },
  // {
  //   path: "/gradeInfo",
  //   name: "gradeInfo",
  //   component: Layout,
  //   redirect: "/gradeInfo/info",
  //   alwaysShow: true,
  //   meta: {
  //     title: "班级信息",
  //     icon: "icon-classMana",
  //   },
  //   children: [
  //     {
  //       name: "info",
  //       path: "info",
  //       component: _import_("gradeInfo/index"),
  //       meta: {
  //         title: "班级信息",
  //         icon: "icon-classMana",
  //       }
  //     }
  //   ]
  // },
  {
    path: "/person",
    name: "person",
    component: Layout,
    redirect: "/person/owner",
    alwaysShow: false,
    meta: {
      title: "人员基础数据",
      icon: "icon-personMana",
    },
    children: [
      {
        name: "owner",
        path: "owner",
        component: _import_("personManage/ownerManage/index"),
        meta: {
          title: "学生人员",
          icon: "icon-yonghu",
        }
      },
      {
        name: "teacher",
        path: "teacher",
        component: _import_("personManage/checkManage/index"),
        meta: {
          title: "教师人员",
          icon: "icon-yonghu",
        }
      },
      {
        name: "property",
        path: "property",
        component: _import_("personManage/propertyManage/index"),
        meta: {
          title: "职工人员",
          icon: "icon-wuyeguanli",
        }
      },
      // {
      //   name: "caller ",
      //   path: "caller",
      //   component: _import_("personManage/vistorManage/index"),
      //   meta: {
      //     title: "访客人员",
      //     icon: "icon-fangkeguanli",
      //   }
      // },
      {
        name: "other",
        path: "other",
        component: _import_("personManage/otherManage/index"),
        meta: {
          title: "其他人员",
          icon: "icon-fangkeguanli",
        }
      },
    ]
  },
  {
    path: "/device",
    name: "device",
    component: Layout,
    redirect: "/device/cameraManage",
    alwaysShow: false,
    meta: {
      title: "设备管理",
      icon: "icon-device",
    },
    children: [
      {
        name: "cameraManage",
        path: "cameraManage",
        component: _import_("device/cameraManage/index"),
        meta: {
          title: "摄像机",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "_manage",
        path: "_manage",
        component: _import_("device/deviceManage/index"),
        meta: {
          title: "门禁设备",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "audio",
        path: "audio",
        component: _import_("device/audio/index"),
        meta: {
          title: "语音报警设备",
          icon: "icon-xiaoqu"
        }
      }
    ]
  },
  {
    path: "/system",
    name: "system",
    component: Layout,
    redirect: "/system/manager",
    alwaysShow: false,
    meta: {
      title: "系统管理",
      icon: "icon-set",
    },
    children: [
      {
        name: "manager",
        path: "manager",
        component: _import_("roleManage/manager/index"),
        meta: {
          title: "账号管理",
          icon: "icon-guanliyuan",
        }
      },
      {
        name: "community",
        path: "community",
        component: _import_("roleManage/community/index"),
        meta: {
          title: "学校信息",

          icon: "icon-xiaoqu"
        }
      },
      {
        name: "dormitoryWarn",
        path: "dormitoryWarn",
        component: _import_("roleManage/dormitoryWarn/index"),
        meta: {
          title: "系统设置",

          icon: "icon-xiaoqu"
        }
      },
      {
        name: "importRecord",
        path: "importRecord",
        component: _import_("roleManage/importRecord/index"),
        meta: {
          title: "导入记录",

          icon: "icon-xiaoqu"
        }
      },
    ]
  },
];

export default new Router({
  // mode: 'history',
  routes: constantRouterMap
  // scrollBehavior: () => ({
  //   y: 0
  // }),
});
