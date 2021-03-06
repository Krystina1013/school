import _axios from "../plugins/axios";
import config from './config';
// 首页获取场景信息
export function getSceneInfo() {
  return _axios({
    url: config.v1 + '/admin/home-page/Home/Page/count',
    method: 'get'
  })
}

export function getScene() {
  return _axios({
    url: config.v1 + '/admin/hs-scence/info',
    method: 'get'
  })
}

// 是否允许家长进入
export function updateFamilyPass(data: any) {
  return _axios({
    url: config.v1 + '/admin/hs-scence/update/allow-family-pass',
    method: 'put',
    data
  })
}

//小区图片删除
export function deleteImg(id: any) {
  return _axios({
    url: config.v1 + `/admin/hs-scence/picture/${id}`,
    method: 'delete'
  })
}

//小区修改
export function editCommunity(data: any) {
  return _axios({
    url: config.v1 + '/admin/hs-scence/update',
    method: 'put',
    data
  })
}

// 人员通信记录统计
export function getPassListChart(params: object) {
  return _axios({
    url: config.v1 + '/admin/count-report/report',
    method: 'get',
    params
  })
}

// 车辆通行记录
export function getCarPassListChart(params: object) {
  return _axios({
    url: config.v1 + '/admin/car-pass/report',
    method: 'get',
    params
  })
}

// 获取访客车辆通行统计
export function getVistorCarList(params: object) {
  return _axios({
    url: config.v1 + '/admin/car-pass/orderVisitCar',
    method: 'get',
    params
  })
}

// /admin/count-report/orderVisitor 访客排序  /admin/count-report/orderBeVisited被访人排序
export function vistorSort(params: object) {
  return _axios({
    url: config.v1 + '/admin/count-report/orderVisitor',
    method: 'get',
    params
  })
}

export function vistoredSort(params: object) {
  return _axios({
    url: config.v1 + '/admin/count-report/orderBeVisited',
    method: 'get',
    params
  })
}

// 首页车辆通行记录

export function carPassList() {
  return _axios({
    url: config.v1 + '/admin/car-pass/homeOrderVisitCar',
    method: 'get',
    params: {
      limit: 6
    }
  })
}

// 首页人员通行记录
export function peoplePassList() {
  return _axios({
    url: config.v1 + '/admin/people-pass/homeList',
    method: 'get',
    params: {
      limit: 6
    }
  })
}
// 首页 /ktwelve/admin/index/catch_info

// 首页人员通行记录
export function getIndexData() {
  return _axios({
    url: config.v1 + '/admin/hs-scence/index',
    method: 'get',
  })
}
// 首页抓拍
export function getZpData() {
  return _axios({
    url: config.v1 + '/admin/index/catch_info',
    method: 'get',
  })
}
// 首页学校老师、职工、学生数据
export function getSchoolData() {
  return _axios({
    url: config.v1 + '/admin/index/school_info',
    method: 'get',
  })
}
// 首页人员通行情况及关注人员
export function getPassData() {
  return _axios({
    url: config.v2 + '/admin/index/peoples',
    method: 'get',
  })
}
// 首页t 设备数量
export function getDeviceData() {
  return _axios({
    url: config.v2 + '/admin/index/device_count',
    method: 'get',
  })
}
// 首页设备报警
export function getDeviceAlarmData() {
  return _axios({
    url: config.v2 + '/admin/index/device_warn',
    method: 'get',
  })
}