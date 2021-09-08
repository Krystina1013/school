import _axios from "../plugins/axios";

import config from './config';

//所有设备列表--不分页
export function deviceList() {
  return _axios({
    url: config.v2 + '/admin/dev-device-info/query',
    method: 'get',
  })
}
//设备管理，所有设备，门禁-摄像头
export function deviceVillaQuery(params: any) {
  return _axios({
    url: config.v2 + '/admin/dev-device-info/villa/query',
    method: 'get',
    params
  })
}
//设备绑定
export function bindDevice(data: any) {
  return _axios({
    url: config.v2 + '/admin/device-link/bind',
    method: 'post',
    data
  })
}
//设备解绑
export function unbindDevice(data: any) {
  return _axios({
    url: config.v2 + '/admin/device-link/unbind',
    method: 'delete',
    data
  })
}
//设备修改
export function updateDevice(params: any) {
  return _axios({
    url: config.v2 + '/admin/dev-device-info',
    method: 'put',
    params
  })
}

// 通过编号查询设备类型
export function checkdeviceByNum(serialNum: string) {
  return _axios({
    url: config.v2 + '/admin/dev-device-info/query-type',
    method: 'get',
    params: {
      serialNum
    }
  })
}

// 设备告警--修改
export function updateDeviceWarning(params:any) {
  return _axios({
    url: config.v2 + '/admin/dev-device-warning',
    method: 'put',
    params
  })
}
// 设备--门禁数量
export function deviceCount() {
  return _axios({
    url: config.v2 + '/admin/dev-device-info/count/device',
    method: 'get',
  })
}
// 设备--监控数量
export function monitorCount() {
  return _axios({
    url: config.v2 + '/admin/dev-device-info/count/monitoring',
    method: 'get',
  })
}
// 设备告警--列表
export function deviceWarnPage(params:any) {
  return _axios({
    url: config.v2 + '/admin/dev-device-warning/page',
    method: 'get',
    params
  })
}
// 设备告警--已读
export function setRead(data:any) {
  return _axios({
    url: config.v2 + '/admin/dev-device-warning/read',
    method: 'put',
    data
  })
}
// 设备告警--全部已读
export function setAllRead(data) {
  return _axios({
    url: config.v2 + '/admin/dev-device-warning/all/read',
    method: 'put',
    data
  })
}
// 预警中心--类型未读
export function unReadOfType() {
  return _axios({
    url: config.v2 + '/admin/dev-device-warning/count/type/unread/warning',
    method: 'get'
  })
}
// 预警中心--处理预警
export function handleWarn(data) {
  return _axios({
    url: config.v2 + '/admin/dev-device-warning/process',
    method: 'put',
    data
  })
}
// 预警中心--暂停告警
export function stopAlarm(data) {
  return _axios({
    url: config.v2 + '/admin/dev-device-warning/stop/warn',
    method: 'post',
    data
  })
}
// 抓拍记录--按时间
export function unknownFaceTimeSearch(data:any) {
  return _axios({
    url: config.v2 + '/csia/face/unknownFaceTimeSearch',
    method: 'post',
    data
  })
}

// 抓拍记录--按人脸
export function unknownFaceSearch(data:any) {
  return _axios({
    url: config.v2 + '/csia/face/unknownFaceSearch',
    method: 'post',
    data
  })
}

// 摄像机列表---不分页
export function getCameraNoPage() {
  return _axios({
      url: config.v5 + '/csia/camera/noPage',
      method: 'post',
  })
}

// 摄像机列表分組
export function getCameraByGroup() {
  return _axios({
      url: config.v1 + '/csia/camera/tree',
      method: 'get',
  })
}
// 播放视频地址
export function liveUrl(params:any) {
  return _axios({
      url: config.v2 + '/csia/camera/liveUrl',
      method: 'get',
      params
  })
}
// 播放视频
export function play(params:any) {
  return _axios({
      url: config.v2 + '/csia/camera/play',
      method: 'get',
      params
  })
}
// 播放视频--历史视频-日期
export function playBackDate(params:any) {
  return _axios({
      url: config.v2 + '/csia/camera/playBack',
      method: 'get',
      params
  })
}
// 播放视频--历史视频
export function playBackList(params:any) {
  return _axios({
      url: config.v2 + '/csia/camera/playBackList',
      method: 'get',
      params
  })
}
// 播放视频--历史视频 分页
export function playBackPageList(params:any) {
  return _axios({
      url: config.v1 + '/csia/camera/playBackPage',
      method: 'get',
      params
  })
}

// 播放视频--短视频
export function playBackTime(params:any) {
  return _axios({
      url: config.v2 + '/csia/camera/playBackTime',
      method: 'get',
      params
  })
}
export function carSearch(data:any) {
  return _axios({
    url: config.v2 + '/csia/vehicle',
    method: 'post',
    data
  })
}