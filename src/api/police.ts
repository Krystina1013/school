import _axios from "../plugins/axios";
import config from './config';

// 相似度
export function systemSetting() {
    return _axios({
        url: config.v4 + '/csia/system/setting',
        method: 'get',
    })
}


// 声音设备--列表
export function getAudioList(params) {
    return _axios({
        url: config.v1 + '/admin/voice-alert-device',
        method: 'get',
        params
    })
}
// 视频盒子--添加
export function addBox(data) {
    return _axios({
        url: config.v4 + '/csia/box',
        method: 'post',
        data
    })
}
// 声音设备--修改
export function updateAudio(data) {
    return _axios({
        url: config.v1 + '/admin/voice-alert-device',
        method: 'put',
        data
    })
}
// 摄像机列表---不分页
export function getCameraNoPage(data:any) {
    return _axios({
        url: config.v4 + '/csia/camera/noPage',
        method: 'post',
        data
    })
}
export function getAllCamera(data:any) {
    return _axios({
        url: config.v1 + '/csia/camera/unBind/noPage',
        method: 'post',
        data
    })
}
// 摄像机列表---分页
export function getCamera(data) {
    return _axios({
        url: config.v1 + '/csia/camera/page',
        method: 'post',
        data
    })
}
// 摄像机列表---分页 未绑定的
export function getUnbindCamera(data) {
    return _axios({
        url: config.v1 + '/csia/camera/unBind/page',
        method: 'post',
        data
    })
}
// 摄像机列表---分页
export function getCameraTree(params) { 
    return _axios({
        url: config.v1 + '/csia/camera/tree',
        method: 'get',
        params
    })
}
// 摄像机列表---修改分组和名称
export function updateCameraGroup(data) { 
    return _axios({
        url: config.v1 + '/csia/camera/edit',
        method: 'post',
        data
    })
}
// 摄像机列表---添加
export function addCamera(data) {
    return _axios({
        url: config.v4 + '/csia/camera',
        method: 'post',
        data
    })
}
// 摄像机列表---修改
export function updateCamera(data) {
    return _axios({
        url: config.v4 + '/csia/camera',
        method: 'put',
        data
    })
}
// 摄像机列表---绑定摄像机
export function bindCamera(data) {
    return _axios({
        url: config.v1 + '/csia/alertTask/updateDeviceTask',
        method: 'put',
        data
    })
}
// 摄像机列表---绑定摄像机
export function warnSet(data) {
    return _axios({
        url: config.v4 + '/csia/camera/warn',
        method: 'put',
        data
    })
}
// 摄像机列表---添加摄像机分组
export function addCameraGroup(data) { 
    return _axios({
        url: config.v1 + '/csia/camera/group',
        method: 'put',
        data
    })
}
export function changeCameraGroup(data) { 
    return _axios({
        url: config.v1 + '/csia/camera/change',
        method: 'post',
        data
    })
}
// 左侧树形结构删除摄像机分组
export function deleteCameraGroup(data) {
    return _axios({
      url: config.v1 + '/csia/camera/batch',
      method: 'delete',
      data
    })
  }
// 身份搜索-照片 
export function faceSearch(data) {
    return _axios({
        url: config.v4 + '/csia/face/faceSearch',
        method: 'post',
        data
    })
}
// 身份搜索-人员信息
export function faceAttrSearch(data) {
    return _axios({
        url: config.v4 + '/csia/face/faceAttrSearch',
        method: 'post',
        data
    })
}
// 人脸抓拍-轨迹搜索
export function unknownFaceSearch(data) {
    return _axios({
        url: config.v4 + '/csia/face/unknownFaceSearch',
        method: 'post',
        data
    })
}
// 人脸抓拍-抓拍记录
export function unknownFaceTimeSearch(data) {
    return _axios({
        url: config.v1 + '/csia/face/unknownFaceTimeSearch',
        method: 'post',
        data
    })
}
// 人脸抓拍-某个摄像机抓拍
export function unknownFaceRecentCap(data) {
    return _axios({
        url: config.v4 + '/csia/face/unknownFaceRecentCap',
        method: 'post',
        data
    })
}

// 首次出现
export function firstAppear(params) {
    return _axios({
        url: config.v2 + '/csia/face/firstAppear/list',
        method: 'get',
        params
    })
}
// 重点人员--分组列表
export function importantGroup(params) {
    return _axios({
        url: config.v4 + '/csia/alertTask',
        method: 'get',
        params
    })
}
// 重点人员--分组添加
export function AddimportantGroup(data) {
    return _axios({
        url: config.v4 + '/csia/alertTask',
        method: 'post',
        data
    })
}
// 重点人员--分组修改
export function updateImportantGroup(data) {
    return _axios({
        url: config.v4 + '/csia/alertTask',
        method: 'put',
        data
    })
}
// 重点人员--分组删除
export function delateImportantGroup(data) {
    return _axios({
        url: config.v4 + '/csia/alertTask',
        method: 'delete',
        data
    })
}
// 重点人员--列表
export function getImportantPerson(data) {
    return _axios({
        url: config.v4 + '/csia/alertPhoto/page',
        method: 'post',
        data
    })
}
// 重点人员--添加
export function addImportantPerson(data) {
    return _axios({
        url: config.v4 + '/csia/alertPhoto',
        method: 'post',
        data
    })
}
// 重点人员--修改
export function updateImportantPerson(data) {
    return _axios({
        url: config.v4 + '/csia/alertPhoto',
        method: 'put',
        data
    })
}
// 重点人员--删除
export function deleteImportantPerson(data) {
    return _axios({
        url: config.v4 + '/csia/alertPhoto',
        method: 'delete',
        data
    })
}
// 人脸检测 
export function faceDetect(data) {
    return new Promise((resolve,reject)=>{
        _axios({
            url: config.v4 + '/csia/face/detect',
            method: 'post',
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
// 人脸上传
export function faceUpload(data) {
    return _axios({
        url: config.v4 + '/csia/face/upFace',
        method: 'post',
        data
    })
}
// 人脸修改
export function faceUpdate(data) {
    return _axios({
        url: config.v4 + '/csia/face/faceUpdate',
        method: 'post',
        data
    })
}
// 实时监控--告警
export function allAlert(params) {
    return _axios({
        url: config.v4 + '/csia/alert/all',
        method: 'get',
        params
    })
}
// 实时监控--告警--已读
export function alertRead(data) {
    return _axios({
        url: config.v4 + '/admin/dev-device-warning/read',
        method: 'put',
        data
    })
}
// 实时监控--告警--未读
export function alertUnRead() {
    return _axios({
        url: config.v4 + '/admin/dev-device-warning/count/warning/unread',
        method: 'get'
    })
}
// 实时监控--告警--元数据
export function capMessage(params) {
    return _axios({
        url: config.v4 + '/csia/alert/capMessage',
        method: 'get',
        params
    })
}
// 播放视频
export function play(params) {
    return _axios({
        url: config.v4 + '/csia/camera/play',
        method: 'get',
        params
    })
}

// 关注人员--列表 
export function getCareUser(params) {
    return _axios({
        url: config.v1 + '/admin/care-user',
        method: 'get',
        params
    })
}
// 关注人员--添加
export function addCareUser(data) {
    return _axios({
        url: config.v1 + '/admin/care-user',
        method: 'post',
        data
    })
}
// 关注人员--修改
export function updateCareUser(data) {
    return _axios({
        url: config.v1 + '/admin/care-user',
        method: 'put',
        data
    })
}
// 关注人员--删除
export function deleteCareUser(data) {
    return _axios({
        url: config.v1 + '/admin/care-user',
        method: 'delete',
        data
    })
}
// 设备告警--列表
export function deviceWarning(params) {
    return _axios({
        url: config.v4 + '/admin/dev-device-warning/page',
        method: 'get',
        params
    })
}
// 设备告警--修改
export function updateDeviceWarning(params) {
    return _axios({
        url: config.v4 + '/admin/dev-device-warning',
        method: 'put',
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

  //抓拍首次出现加入重点人员
export function addImportant(data: any) {
    return _axios({
        url: config.v5 + '/csia/alertPhoto/alertPhoto/byFaceUrl',
        method: 'post',
        data
    })
}
  //一人一档-列表
  export function searchOnePersonByName(params: any) {
    return _axios({
        url: config.v5 + '/csia/personArchive/byName',
        method: 'get',
        params
    })
}
//一人一档-搜索
export function searchOnePerson(data: any) {
    return _axios({
        url: config.v5 + '/csia/personArchive/search',
        method: 'post',
        data
    })
}
  //一人一档-图片
  export function searchOnePersonImg(data: any) {
    return _axios({
        url: config.v5 + '/csia/personArchive/byPic',
        method: 'post',
        data
    })
}
  //一人一档-轨迹
  export function searchOnePersonTrack(params: any) {
    return _axios({
        url: config.v5 + '/csia/personArchive/track',
        method: 'get',
        params
    })
  }
   /**
    * 重点区域* */
   // 添加
  export function addArea(data: any) {
    return _axios({
        url: config.v1 + '/admin/area',
        method: 'post',
        data
    })
  }
  //修改
  export function putArea(data: any) {
    return _axios({
        url: config.v1 + '/admin/area',
        method: 'put',
        data
    })
  } 
  //通过id查找
  export function getAreaById(params: any) {
    return _axios({
        url: config.v1 + '/admin/area/byId',
        method: 'get',
        params
    }) 
  }