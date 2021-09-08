import _axios from "../plugins/axios";
import config from './config';
// 首页获取人员同行记录
export function peoplePassList() {
  return _axios({
    url: config.v1 + "/admin/people-pass",
    method: "get",
    params: {
      limit: 5,
      page: 1
    }
  });
}

//通过电话查看用户信息
export function queryUserPhone(phone: string) {
  return _axios({
    url: config.v1 + "/admin/scence-user/byPhone",
    method: "put",
    params: {
      phone
    }
  });
}

/***** 物业/用户 禁用恢复 ****** */
export function resetDisabledUser(data: object) {
  return _axios({
    url: config.v1 + "/admin/scence-user",
    method: "put",
    data
  });
}

//****学生相关****** */
//搜索学生
export function getStudents(params: Object) {
  return _axios({
    url: config.v1 + "/admin/student/page",
    method: "get",
    params
  });
}
// 添加学生
export function addStudent(data: Object) {
  return _axios({
    url: config.v1 + "/admin/student",
    method: "post",
    data
  });
}
// 修改学生
export function updateStudent(data: Object) {
  return _axios({
    url: config.v1 + "/admin/student",
    method: "put",
    data
  });
}

//****教师相关****** */
// 查询教师
export function getTeacher(params: Object) {
  return _axios({
    url: config.v1 + "/admin/teacher/page",
    method: "get",
    params
  });
}
// 添加教师
export function addTeacher(data: Object) {
  return _axios({
    url: config.v1 + "/admin/teacher",
    method: "post",
    data
  });
}
// 修改教师
export function updateTeacher(data: Object) {
  return _axios({
    url: config.v1 + "/admin/teacher",
    method: "put",
    data
  });
}
// 批量设置教师
export function updateTeachers(data: Object) {
  return _axios({
    url: config.v1 + "/admin/teacher/batch",
    method: "put",
    data
  });
}
// 修改教师
export function updateTeacherStatus(data: Object) {
  return _axios({
    url: config.v1 + "/admin/teacher/status",
    method: "put",
    data
  });
}

// 获取教师分组 
export function teacherGroups() {
  return _axios({
    url: config.v1 + "/admin/teacherGroup/groups",
    method: "post"
  });
}
// 增加一个教师分组 
export function addTeacherGroups(data:Object) {
  return _axios({
    url: config.v1 + "/admin/teacherGroup",
    method: "post",
    data
  });
}
// 更新教师分组 
export function editTeacherGroups(data:Object) {
  return _axios({
    url: config.v1 + "/admin/teacherGroup",
    method: "put",
    data
  });
}
// 删除教师分组 
export function delTeacherGroups(id: string) {
  return _axios({
    url: config.v1 + "/admin/teacherGroup",
    method: "delete",
    params: {
      id
    }
  });
}
//****职工相关****** */
// 查询职工
export function getWorker(params: Object) {
  return _axios({
    url: config.v1 + "/admin/worker",
    method: "get",
    params
  });
}
// 添加职工
export function addWorker(data: Object) {
  return _axios({
    url: config.v1 + "/admin/worker",
    method: "post",
    data
  });
}
// 修改职工
export function updateWorker(data: Object) {
  return _axios({
    url: config.v1 + "/admin/worker",
    method: "put",
    data
  });
}
// 批量设置职工
export function updateWorkers(data: Object) {
  return _axios({
    url: config.v1 + "/admin/worker/updateBatch",
    method: "put",
    data
  });
}


//****其他相关****** */
// 查询其他
export function getOther(params: Object) {
  return _axios({
    url: config.v1 + "/admin/other/page",
    method: "get",
    params
  });
}
// 添加其他
export function addOther(data: Object) {
  return _axios({
    url: config.v1 + "/admin/other",
    method: "post",
    data
  });
}
// 修改其他
export function updateOther(data: Object) {
  return _axios({
    url: config.v1 + "/admin/other",
    method: "put",
    data
  });
}

export function getUserPass(params: object) {
  return _axios({
    url: config.v2 + "/admin/peoplePass",
    method: "get",
    params
  });
}
export function getCarPass(params: object) {
  return _axios({
    url: config.v1 + "/admin/car-pass/",
    method: "get",
    params
  });
}

// 获取住户的人脸库信息
export function getFaceList(params: object) {
  return _axios({
    url: config.v1 + "/admin/usr-dev-link",
    method: "get",
    params
  });
}

// 获取业主的人脸库信息
export function getOwnerFaceList(params: object) {
  return _axios({
    url: config.v1 + "/admin/usr-dev-link/by-scence-user-id",
    method: "get",
    params
  });
}

//获取目标人员通行记录 || 访客通行记录
export function getTargrtRecord(params: object) {
  return _axios({
    url: config.v1 + "/admin/people-pass/by-visit-id/",
    method: "get",
    params
  });
}

// 获取人员通行位置的搜索建议
export function getPassAddress(name: string) {
  return _axios({
    url: config.v1 + "/admin/building",
    method: "get",
    params: {
      name
    }
  });
}
// 修改住户的远程开门 车辆 访客权限
export function updateRoleHouse(data: object) {
  return _axios({
    url: config.v1 + "/admin/usrHouseLink",
    method: "put",
    data
  });
}

/********* 宿舍楼栋管理人员 *********** */
// 添加宿舍楼栋管理人员
export function addBuildingAdmin(data: object) {
  return _axios({
    url: config.v1 + "/admin/building-admin",
    method: "post",
    data
  });
}

// 修改宿舍楼栋管理人员
export function updateAdmin(data: object) {
  return _axios({
    url: config.v1 + "/admin/building-admin",
    method: "put",
    data
  });
}


/********** 获取权限组 ************/
export function getRoleGroup(name: string | null) {
  return _axios({
    url: config.v1 + "/admin/authorities/list",
    method: "get",
    params: {
      name
    }
  });
}

// 创建权限组
export function addRoleGroup(data: object) {
  return _axios({
    url: config.v1 + "/admin/authorities",
    method: "post",
    data
  });
}

// 删除权限组
export function deleteRoleGroup(id: string) {
  return _axios({
    url: config.v1 + "/admin/authorities",
    method: "delete",
    params: {
      id
    }
  });
}

// 修改全选组信息
export function updateRoleGroup(data: object) {
  return _axios({
    url: config.v1 + "/admin/authorities",
    method: "put",
    data
  });
}
/********* 关注人员 *********** */

// 创建关注人员
export function addFocusPeople(data: object) {
  return _axios({
    url: config.v1 + "/admin/usr-focus-personnel/",
    method: "post",
    data
  });
}

// 通过id获取工作人员信息
export function getWorkerById(params: object) {
  return _axios({
    url: config.v1 + "/admin/worker",
    method: "get",
    params: params
  });
}

//修改关注人员
export function editFocusPeople(data: Object) {
  return _axios({
    url: config.v1 + `/admin/usr-focus-personnel/${data["id"]}/`,
    method: "patch",
    data
  });
}

// 删除关注人员
export function deleteFocusPeople(id: string) {
  return _axios({
    url: config.v1 + `/admin/usr-focus-personnel/${id}/`,
    method: "delete"
  });
}

// 获取关注人员类别
export function getType() {
  return _axios({
    url: config.v1 + "/admin/usr-focus-personnel-type/",
    method: "get"
  });
}

//添加关注人员类别
export function addType(data: Object) {
  return _axios({
    url: config.v1 + "/admin/usr-focus-personnel-type/",
    method: "post",
    data
  });
}

//删除关注人员类别
export function deleteType(id: any) {
  return _axios({
    url: config.v1 + `/admin/usr-focus-personnel-type/${id}/`,
    method: "delete"
  });
}

/********* 楼控 *********** */

// 获取楼控
export function getFloorControl(params: Object) {
  return _axios({
    url: config.v1 + "/admin/hsHouse/view",
    method: "get",
    params
  });
}

//修改入住人员信息
export function editHotelStaff(data: Object) {
  return _axios({
    url: config.v1 + `/admin/scence-user/student`,
    method: "put",
    data
  });
}

// 解绑人脸
export function deleteFace(data) {
  return _axios({
    url: config.v1 + "/admin/usr-dev-link",
    method: "delete",
    data
  });
}

// 上传人脸
export function uploadFace(data) {
  return _axios({
    url: config.v1 + "/admin/scence-user/upFace",
    method: "put",
    data
  });
}
// 修改用户过期时间
export function userHouseUpdate(data) {
  return _axios({
    url: config.v1 + "/admin/user-house-link/update",
    method: "put",
    data
  });
}
// 批量修改用户过期时间
export function userBatchHouseUpdate(data) {
  return _axios({
    url: config.v1 + "/admin/user-house-link/batch/overTime",
    method: "put",
    data
  });
}

// 审核
export function userApplication(data) {
  return _axios({
    url: config.v1 + "/admin/user-application",
    method: "put",
    data
  });
}
// 用户列表
export function scenceUserPage(data) {
  return _axios({
    url: config.v1 + "/admin/scence-user/page",
    method: "get",
    params: data
  });
}



/***** 物业/用户 禁用恢复 ****** */

//删除用户
export function deleteUser(data: object) {
  return _axios({
    url: config.v1 + "/admin/scence-user",
    method: "DELETE",
    data
  });
}

// 查看用户和物业人员的通行记录
export function getUserPropertyPass(params: object) {
  return _axios({
    url: config.v1 + "/admin/peoplePass",
    method: "get",
    params
  });
}
// 用户通行权限
export function getUserDevLink(params: object) {
  return _axios({
    url: config.v1 + "/admin/user-dev-link",
    method: "get",
    params
  });
}
// 查看用户的人脸库信息 弃用
// export function getPersonFace(key: string) {
//   return _axios({
//     url:config.v5+ '/admin/uploadFile',
//     method: 'get',
//     params: {
//       key
//     }
//   })
// }
//****办公成员相关****** */
// 添加办公成员
export function addPeople(data: Object) {
  return _axios({
    url: config.v1 + "/admin/scence-user/add",
    method: "post",
    data
  });
}
// 修改用户电话
export function updateUserPhone(data: object) {
  return _axios({
    url: config.v1 + "/admin/scence-user/phone",
    method: "put",
    data
  });
}

// 修改用户信息
export function updateUser(data: object) {
  return _axios({
    url: config.v1 + "/admin/scence-user",
    method: "put",
    data
  });
}
// 修改用户备注
export function updateUserNote(id: string, note: string) {
  return _axios({
    url: config.v1 + "/admin/usrUser/updateNote",
    method: "put",
    params: {
      id,
      note
    }
  });
}


// 获取人员通行位置的搜索建议
// export function getPassAddress(name: string) {
//   return _axios({
//     url:config.v5+ "/admin/building",
//     method: "get",
//     params: {
//       name
//     }
//   });
// }
// 修改办公成员的远程开门 车辆 访客权限
// export function updateRoleHouse(data: object) {
//   return _axios({
//     url:config.v5+ "/admin/usrHouseLink",
//     method: "put",
//     data
//   });
// }

/********* 物业人员 *********** */
// 添加物业人员
export function addPropert(data: object) {
  return _axios({
    url: config.v1 + "/admin/scence-user/propertyUser",
    method: "post",
    data
  });
}

// 改变物业人员的权限组
export function changeRoleGroup(authId: string, id: string) {
  return _axios({
    url: config.v1 + "/admin/scence-user/propertyUser/updateAuth",
    method: "put",
    params: {
      authId,
      id
    }
  });
}

// 查看物业人员
export function watchPropert(id: string) {
  return _axios({
    url: config.v1 + "/admin/usrUser/PropertyManager",
    method: "get",
    params: {
      id
    }
  });
}

/********** 获取权限组 ************/
// export function getRoleGroup(name: string | null) {
//   return _axios({
//     url:config.v5+ "/admin/authorities/list",
//     method: "get",
//     params: {
//       name
//     }
//   });
// }

// 创建权限组
// export function addRoleGroup(data: object) {
//   return _axios({
//     url:config.v5+ "/admin/authorities",
//     method: "post",
//     data
//   });
// }

// // 删除权限组
// export function deleteRoleGroup(id: string) {
//   return _axios({
//     url:config.v5+ "/admin/authorities",
//     method: "delete",
//     params: {
//       id
//     }
//   });
// }

// 修改全选组信息
// export function updateRoleGroup(data: object) {
//   return _axios({
//     url:config.v5+ "/admin/authorities",
//     method: "put",
//     data
//   });
// }
/********* 关注人员 *********** */

// 创建关注人员
// export function addFocusPeople(data: object) {
//   return _axios({
//     url:config.v5+ "/admin/usr-focus-personnel/",
//     method: "post",
//     data
//   });
// }

// 通过id获取权限组信息
export function getGroupInfoById(id: string) {
  return _axios({
    url: config.v1 + "/admin/authorities/byId",
    method: "get",
    params: {
      id
    }
  });
}

//批量设置通行时间
export function editPasstime(data: Object) {
  return _axios({
    url: config.v1 + `/admin/scence-user/passTime`,
    method: "put",
    data
  });
}
//批量设置是否禁止工作日通行
export function editRestDayPass(data: Object) {
  return _axios({
    url: config.v1 + `/admin/scence-user/restDayPass`,
    method: "put",
    data
  });
}


// 通行记录
export function getPassList(params) {
  return _axios({
    url: config.v2 + "/admin/peoplePass/ktwelve",
    method: "get",
    params
  });
}
// 考勤 
export function getAttendanceGroup() {
  return _axios({
    url: config.v1 + "/admin/attendance-group",
    method: "get",

  });
}
export function attendanceGroup(data) {
  return _axios({
    url: config.v1 + "/admin/attendance-group",
    method: "post",
    data
  });
}
export function attendanceGroupDelete(data) {
  return _axios({
    url: config.v1 + "/admin/attendance-group",
    method: "delete",
    data
  });
}
export function attendanceGroupUpdate(data) {
  return _axios({
    url: config.v1 + "/admin/attendance-group",
    method: "put",
    data
  });
}
//考勤组的用户
export function attendanceGroupinGroup(params) {
  return _axios({
    url: config.v1 + "/admin/attendance-group/inGroup",
    method: "get",
    params
  });
}
//没在考勤组的用户
export function attendanceGroupOutGroup(params) {
  return _axios({
    url: config.v1 + "/admin/attendance-group/outGroup",
    method: "get",
    params
  });
}
//创建考勤计划
export function attendanceGroupPlan(data) {
  return _axios({
    url: config.v1 + "/admin/attendance-group/plan",
    method: "post",
    data
  });
}
//删除考勤计划
export function attendanceGroupPlanDelete(data) {
  return _axios({
    url: config.v1 + "/admin/attendance-group/plan",
    method: "delete",
    data
  });
}
//自定义考勤计划列表
export function attendanceGroupPlanScence(params) {
  return _axios({
    url: config.v1 + "/admin/attendance-group/plan",
    method: "get",
    params
  });
}
//法定节假日考勤计划列表
export function attendanceGroupPlanSystem() {
  return _axios({
    url: config.v1 + "/admin/attendance-group/plan/system",
    method: "get",
  });
}
//考勤节假日日期数据
export function attendanceGroupPlanTotal(params) {
  return _axios({
    url: config.v1 + "/admin/attendance-group/plan/total",
    method: "get",
    params
  });
}

// export const searchPoliceByParams = async (param: any) => {
//   const { data } = await request.post(`/v5/policeperson/getbyparam`, param)
//   return data
// }

// 住户列表
export function getPeople(params: Object) {
  return _axios({
    url: config.v5 + "/admin/scence-user/page",
    method: "get",
    params
  })
}
//****账号相关****** */

// 添加职工
export function addAccount(data: Object) {
  return _axios({
    url: config.v1 + "/admin/sys-user",
    method: "post",
    data
  });
}
// 修改教师
export function updateAccount(data: Object) {
  return _axios({
    url: config.v1 + "/admin/sys-user",
    method: "put",
    data
  });
}
// 系统配置 
export function dormitoryConfig(params: any) {
  return _axios({
    url: config.v1 + '/admin/alert-config/dormitory',
    method: 'get',
    params
  })
}
// 系统配置 --修改
export function updateDormitoryConfig(data: any) {
  return _axios({
    url: config.v1 + '/admin/alert-config/dormitory',
    method: 'put',
    data
  })
}
/**家长 */
export function getParents(params:any) {
  return _axios({
    url: config.v1 + "/admin/message/parents",
    method: "get",
    params
  })
}
