// export default url
import _axios from "../plugins/axios";
import config from './config';
export function login(data: Object) {
  return _axios({
    url: config.v1 + "/open/login",
    method: "post",
    data
  });
}

// 获取用户权限
export function getRoleList() {
  return _axios({
    url: config.v1 + "/admin/usr-user-role-link",
    method: "get"
  });
}

// 获取用户权限
// export function getAuthCode(params: object) {
//   return _axios({
//     url:config.v1+ "/admin/open/auth-code",
//     method: "get",
//     params
//   });
// }

// 获取用户权限
export function getAuthCode(params: object) {
  return _axios({
    url: config.v1 + "/open",
    method: "get",
    params
  });
}

// 导出列表公用
export function exportList(url: string) {
  return _axios({
    url: url,
    method: "get",
    responseType: "blob"
  });
}
// 发送验证码
export function sendAuthCode(params: any) {
  return _axios({
    url: config.v3 + "/app/open/send-auth-code/sms",
    method: "get",
    params
  });
}
//  反馈
export function feedback(data: Object) {
  return _axios({
    url: config.v1 + "/admin/feedback",
    method: "post",
    data
  });
}
/***登陆 和修改密码 */
// 验证短信验证码
export function getValidateSms(params: any) {
  return _axios({
    url: config.v1 + "/open/validateSms",
    method: "get",
    params
  });
}
export function updatePassword(data: Object) {
  return _axios({
    url: config.v1 + "/open/updatePassword",
    method: "put",
    data
  });
}
/**
 * 通过人脸获取用户信息***/
export function getInfoByFaceId(params: Object) {
  return _axios({
    url: config.v1 + "/admin/scence-user/faceId",
    method: "get",
    params
  });
}

// 模糊搜索
export function getInfoSimilar(params: any) {
  return _axios({
    url: config.v1 + "/admin/scence-user/matchUserInfo",
    method: "get",
    params
  });
}
/** 通过人脸获取人员信息***/
export function getInfoByFace(data: any) {
  return _axios({
    url: config.v1 + "/admin/scence-user/faces",
    method: "post",
    data
  });
}
/**
 * 通过人脸获取人员信息多个***/
export function getInfoByFaces(data: any) {
  return _axios({
    url: config.v1 + "/admin/scence-user/faces",
    method: "post",
    data
  });
}
/**
 * 通过人脸id获取用户所有信息多个***/
export function getInfoByFaceIds(params: Object) {
  return _axios({
    url: config.v1 + "/admin/scence-user/faces/byId",
    method: "get",
    params
  });
}
/**
 * 上传预警中心反馈图片***/
export function uploadAlarmImage(data: any) {
  return _axios({
    url: config.v3 + "/admin/feed_back/upFile",
    method: "post",
    data
  });
}