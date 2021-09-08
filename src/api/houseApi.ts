import _axios from "../plugins/axios";
import config from './config';

// 公共上传图片
export function uploadFile(data:object){
  return _axios({
    url:config.v1 + '/admin/common/upBack',
    method:'POST',
    data
  })
}
/*******左侧房屋接口*********/
// 获取左侧树形结构房屋列表
export function getHouseTreeData() {
  return _axios({
    url: config.v1 + '/admin/building-group',
    method: 'get'
  })
}
// 获取左侧树形结构房屋列表--考勤应用
export function getHouseTree() {
  return _axios({
    url: config.v1 + '/admin/building-group/includeStorey',
    method: 'get'
  })
}
// 获取左侧树形结构房屋列表
export function getBuildingTreeData(params) {
  return _axios({
    url: config.v1 + '/admin/building',
    method: 'get',
    params
  })
}
export function getZoom(params) {
  return _axios({
    url: config.v1 + '/admin/room',
    method: 'get',
    params
  })
}
// 左侧树形结构添加分组
export function addHouseGroup(data: Object) {
  return _axios({
    url: config.v1 + '/admin/building-group',
    method: 'post',
    data
  })
}
// 左侧树形结构删除分组
export function deleteHouseGroup(id: string) {
  return _axios({
    url: config.v1 + '/admin/building-group',
    method: 'delete',
    params: {
      id
    }
  })
}
// 左侧树形结构修改分组
export function updateHouseGroup(data: Object) {
  return _axios({
    url: config.v1 + '/admin/building-group',
    method: 'put',
    data
  })
}
// 左侧树形结构修改分组排序
export function updateOrderHouseGroup(data: Object) {
  return _axios({
    url: config.v1 + '/admin/building-group/order',
    method: 'put',
    data
  })
}
// 职工左侧树形结构修改分组排序
export function updateOrderWorkerGroup(data: Object) {
  return _axios({
    url: config.v1 + '/admin/worker-group/order',
    method: 'put',
    data
  })
}
// 班级年级的树状结构
export function getclassTreeFormat() {
  return _axios({
    url: config.v1 + '/admin/class/tree',
    method: 'get',
  })
}
// 班级年级的树状结构
export function getclassTree() {
  return _axios({
    url: config.v1 + '/admin/class/class-tree',
    method: 'get',
  })
}
// 创建单元楼
export function addBuilding(data: object) {
  return _axios({
    url: config.v1 + '/admin/building',
    method: 'post',
    data
  })
}

// 修改单元楼
export function updateBuilding(data: object) {
  return _axios({
    url: config.v1 + '/admin/building',
    method: 'put',
    data
  })
}

// 删除单元楼
export function deleteBuilding(id: string) {
  return _axios({
    url: config.v1 + '/admin/building',
    method: 'delete',
    params: {
      id
    }
  })
}

// 获取单元楼单位
export function getUnitList(type: string = 'group') {
  return _axios({
    url: config.v1 + '/admin/unit',
    method: 'get',
    params: {
      type
    }
  })
}

// 增加单元楼单位
export function addUnit(name: string, type: string) {
  return _axios({
    url: config.v1 + '/admin/unit',
    method: 'post',
    data: {
      name,
      type
    }
  })
}

// 删除单元楼单位
export function deleteUnit(id: string) {
  return _axios({
    url: config.v1 + '/admin/unit',
    method: 'delete',
    params: {
      id
    }
  })
}
/**左侧树形结构工作组**/
//获取分组
export function getWorkGroup() {
  return _axios({
    url: config.v1 + '/admin/worker-group',
    method: 'get'
  })
}
// 左侧树形结构添加工作分组
export function addWorkGroup(data: Object) {
  return _axios({
    url: config.v1 + '/admin/worker-group',
    method: 'post',
    data
  })
}
// 左侧树形结构添加工作分组
export function updateWorkGroup(data: Object) {
  return _axios({
    url: config.v1 + '/admin/worker-group',
    method: 'put',
    data
  })
}
// 左侧树形结构删除工作分组
export function deleteWorkGroup(id: string) {
  return _axios({
    url: config.v1 + '/admin/worker-group',
    method: 'delete',
    params: {
      id
    }
  })
}
/*******门禁卡管理*********/
// 门禁卡启用与禁用
export function changeCardStstus(status: string, id: string) {
  return _axios({
    url: config.v1 + '/admin/door-card/update',
    method: 'put',
    params: {
      id,
      status
    }
  })
}
// 创建门禁卡
export function createCard(form: object) {
  return _axios({
    url: config.v1 + '/admin/door-card/insert',
    method: 'post',
    data: {
      ...form
    }
  })
}
// 门禁卡过期时间修改
export function cardvalidDateChange(params: object) {
  return _axios({
    url: config.v1 + '/admin/door-card/update',
    method: 'put',
    params
  })
}
// 获取指定门禁卡的同行记录
export function theCardPassList(params: object) {
  return _axios({
    url: config.v2 + '/admin/peoplePass',
    method: 'get',
    params: {
      ...params,
      limit: 10
    }
  })
}
// 获取对应房屋下的门禁卡信息
export function getCardListByHouseId(houseId: string) {
  return _axios({
    url: config.v1 + '/admin/door-card/houseId',
    method: 'get',
    params: {
      houseId
    }
  })
}

// 删除门禁卡
export function deleteDoorCard(Arr: Array<string>) {
  return _axios({
    url: config.v1 + '/admin/door-card/delete',
    method: 'delete',
    data: Arr

  })
}

//***********校园管理 ***********/
/****宿舍楼栋 */
// 添加房屋
export function addHouse(data: object) {
  return _axios({
    url: config.v1 + '/admin/room',
    method: 'post',
    data
  })
}
// 修改房屋
export function updateHouse(data: object) {
  return _axios({
    url: config.v1 + '/admin/room',
    method: 'put',
    data
  })
}
// 获取当前场景下的宿舍楼
export function searchHouse(buildingType: string) {
  return _axios({
    url: config.v1 + '/admin/building',
    method: 'get',
    params: {
      buildingType
    }
  })
}
// 获取当前场景下出入口
export function getInoutList() {
  return _axios({
    url: config.v1 + '/admin/enter-exit',
    method: 'get'
  })
}
// 添加出入口
export function creatPassageway(data: object) {
  return _axios({
    url: config.v1 + '/admin/enter-exit',
    method: 'post',
    data
  })
}

//修改出入口
export function editPassageway(data: object) {
  return _axios({
    url: config.v1 + '/admin/enter-exit',
    method: 'put',
    data
  })
}


// 获取特定房屋下的注册人员
export function getRoomPeople(roomId: string) {
  return _axios({
    url: config.v1 + '/admin/student-room-link/searchAllStudentsByRoom',
    method: 'get',
    params: {
      roomId
    }
  })
}
// 获取特定房屋下的注册人员--某个人
export function getRegisterPerson(id: string) {
  return _axios({
    url: config.v1 + '/admin/user-house-link/links',
    method: 'get',
    params: {
      id
    }
  })
}


// 根据房屋id查询房屋信息(已删除的也能查出来)
export function getRegisterHouse(params: object) {
  return _axios({
    url: config.v1 + '/admin/hsHouse/by-id',
    method: 'get',
    params
  })
}

// 删除特定房屋下的某个注册人员
export function deleteTheHousePeople(id: string, houseId: string, userId: string, scenceUserId: string) {
  return _axios({
    url: config.v1 + '/admin/user-house-link',
    method: 'delete',
    // params: {
    //   id,
    //   houseId,
    //   userId,
    //   scenceUserId
    // }
    data: [id]
  })
}

// 通过用户id获取房屋列表信息
export function getHouseListByUserId(userId: string) {
  return _axios({
    url: config.v1 + '/admin/hsHouse/byUserId',
    method: 'get',
    params: {
      userId
    }
  })
}
// 批量门禁卡续期
export function updateCardDate(ids: any, date: any) {
  return _axios({
    url: config.v1 + `/admin/door-card/batchUpdate?ids=${ids}&date=${date}`,
    method: 'put',
  })
}
/*********
 * 班级******/
// 获取班级
export function getClass(grade: string) {
  return _axios({
    url: config.v1 + '/admin/class',
    method: 'get',
    params: {
      grade,
      limit: 100,
      page: 1
    }
  })
}
// 添加班级
export function creatClass(data: object) {
  return _axios({
    url: config.v1 + '/admin/class',
    method: 'post',
    data
  })
}

//修改班级
export function editClass(data: object) {
  return _axios({
    url: config.v1 + '/admin/class',
    method: 'put',
    data
  })
}
// 查询班级树
export function getClassTree() {
  return _axios({
    url: config.v1 + '/admin/class/grade',
    method: 'get',
  })
}
// 根据年级查询班级 --分页
export function getClassByGrade(params: object) {
  return _axios({
    url: config.v1 + '/admin/class',
    method: 'get',
    params
  })
}
// 获取年级列表
export function getGradeList() {
  return _axios({
    url: config.v1 + '/admin/class/gradeList',
    method: 'get',
  })  
}