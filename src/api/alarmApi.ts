import _axios from "../plugins/axios";
import config from './config';
//修改告警管理

//修改告警管理
export function editStall(data: any) {
  return _axios({
    url:config.v1+ `/admin/usr-early-report/${data.id}/`,
    method: "patch",
    data
  });
}

//告警未读总数
// --告警--未读
export function alertUnRead() {
  return _axios({
      url: config.v4 + '/admin/dev-device-warning/count/warning/unread',
      method: 'get'
  })
}
