import _axios from "../plugins/axios";
import config from './config';
// 查询发布消息
export function getmessagePage(params:any) {
  return _axios({
    url: config.v1 + '/admin/message/page',
    method: 'get',
    params
  })
}
// 添加发布消息
export function addMessage(data:any) {
  return _axios({
    url: config.v1 + '/admin/message',
    method: 'POST',
    data
  })
}
// 查询发布消息
export function getMessage(params:any) {
  return _axios({
    url: config.v1 + '/admin/message',
    method: 'get',
    params
  })
}
// 编辑发布消息
export function PutMessage(data:any) {
  return _axios({
    url: config.v1 + '/admin/message',
    method: 'put',
    data
  })
}
// 删除发布消息
export function DelMessage(serialNo) {
  return _axios({
    url: config.v1 + '/admin/message',
    method: 'DELETE',
    params: {
      serialNo
    }
  })
}
// 根据用户类型查询消息状态
export function infoMessage(data: object) {
  return _axios({
    url: config.v1 + '/admin/message/detail',
    method: 'post',
    data
  })
}