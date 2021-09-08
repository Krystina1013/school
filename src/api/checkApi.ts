import _axios from "../plugins/axios";
import config from './config';

// 获取全校考勤
export function getSchoolCheck() {
  return _axios({
    url: config.v1 + '/admin/hs-scence/home',
    method: 'get'
  })
}
// 全校考勤设置
export function setSchoolCheck(params) {
  return _axios({
    url: config.v1 + '/admin/hs-scence/update',
    method: 'put',
    data: params
  })
}

// 年级考勤设置
export function setGradeCheck(params) {
  return _axios({
    url: config.v1 + '/admin/class/setAttendance',
    method: 'put',
    data: params
  })
}

// 学生考勤记录查询
export function searchRecord(params) {
  return _axios({
    url: config.v1 + '/admin/attendance-record/student/class',
    method: 'get',
    data: params
  })
}

// 教职工考勤统计
export function workRecord(params) {
  return _axios({
    url: config.v1 + '/admin/attendance-record/worker/statistcs',
    method: 'get',
    params
  })
}
export function workRecordTable(params) {
  return _axios({
    url: config.v1 + '/admin/attendance-record/worker',
    method: 'get',
    params
  })
}

// 班级考勤记录查询
export function classRecord(params) {
  return _axios({
    url: config.v1 + '/admin/attendance-record/student/class',
    method: 'get',
    params
  })
}

// 宿舍考勤记录查询
export function dormRecord(params) {
  return _axios({
    url: config.v1 + '/admin/attendance-record/student/room',
    method: 'get',
    params
  })
}

// // 学生考勤记录列表查询
// export function searchPassRecord(params) {
//   return _axios({
//     url: config.v4 + '/admin/peoplePass/ktwelve',
//     method: 'get',
//     params
//   })
// }