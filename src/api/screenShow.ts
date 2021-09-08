import _axios from "../plugins/axios";
import config from './config';

// 大屏校园用户信息
export function userInfo() {
  return _axios({
    url: config.v1 + "/admin/index/screen/statis",
    method: "get"
  });
}

// 今日访客数
export function visitor() {
  return _axios({
    url: config.v3 + "/admin/visitor/todayVisitor",
    method: "get"
  });
}

// 只能抓拍记录
export function captureInfo(params) {
  return _axios({
    url: config.v1 + "/admin/index/screen/Capture",
    method: "get",
    params
  });
}

// 门禁通行记录
export function accessInfo(params) {
  return _axios({
    url: config.v2 + "/admin/peoplePass/ktwelve",
    method: "get",
    params
  });
}

