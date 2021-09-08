import _axios from "../plugins/axios";
import config from './config';

// 获取厂商列表
export function getVendor(data: object) {
  return _axios({
    url:config.v1+ '/csia/camera/getVendors',
    method: 'get',
  })
}

// 绑定设备
export function createDevice(data: object) {
  return _axios({
    url:config.v1+ '/admin/device-link/bind',
    method: 'post',
    data
  })
}
//绑定出入口
export function bindDeviceLink(data: object) {
  return _axios({
    url:config.v1+ '/admin/camera-enter-exit-link',
    method: 'post',
    data
  })
}
export function unBindDeviceLink(data: object) {
  return _axios({
    url:config.v1+ '/admin/camera-enter-exit-link',
    method: 'delete',
    data
  })
}
// 获取设备列表
export function getDeviceList(params: object){
  return _axios({
    url:config.v2+ '/admin/dev-device-info/page-query',
    method: 'get',
    params
  })
}

// 通过编号查询设备类型
export function checkdeviceByNum(serialNum: string) {
  return _axios({
    url:config.v2+ '/admin/dev-device-info/query-type',
    method: 'get',
    params: {
      serialNum
    }
  })
}

export function editDeviceName(params:object){ 
  return _axios({
    url:config.v2+ '/admin/dev-device-info',
    method: 'put',
    params
  })
}
// 设备-同步数据
export function deviceSyncData(params:object){ 
  return _axios({
    url:config.v1+ '/admin/device-link/syncData',
    method: 'put',
    params
  })
}
// 行内编辑摄像头地址 /csia/camera/addr
export function editAddr(data: object) {
  return _axios({
    url:config.v1+ '/csia/camera/addr',
    method: 'put',
    data
  })
}

// 行内编辑摄像头名称 /csia/camera
export function editName(data: object) {
  return _axios({
    url:config.v1+ '/csia/camera',
    method: 'put',
    data
  })
}