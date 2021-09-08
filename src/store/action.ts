import state from "./state";
import { ActionTree } from "vuex";
import stateType from './type';
import { getRoleList } from '@/api/user.ts'
import { alertUnRead } from "@/api/alarmApi.ts"; //获取目标访客受访人信息

function selectRoute(route: Array<object>, role: Array<string>) {
  role = ['pageUpdate', 'pageLook', ...role]
  const Route = [...route]
  const newRoute: Array<object> = Route.filter(ele => {
    let arr: Array<object> = []
    ele['children'].forEach((item: object) => {
      if (role.includes(item['name'] + 'Look')) {
        arr.push(item)
      }
    })
    ele['children'] = arr
    return ele['children'].length > 0
  })

  return newRoute
}

const action: ActionTree<stateType, any> = {
  SET_NAME({ commit, state: stateType }, name: string) {
    commit('SET_NAME', name)
  },

  SET_PASSWORD({ commit, state: stateType }, password: string) {
    commit('SET_PASSWORD', password)
  },

  SET_TOKEN({ commit, state: stateType }, token: string) {
    commit('SET_TOKEN', token)
  },
  SET_SCENCEID({ commit, state: stateType }, token: string) {
    commit('SET_SCENCEID', token)
  },
  SET_TOTAL({ commit, state: stateType }, total: number) {
    commit('SET_TOTAL', total)
  },

  SET_PERMISSIONLIST({ commit, state: stateType }, list: Array<object>) {
    // let arr = ["alarmUpdate","alarmLook","firstAppearUpdate","firstAppearLook","realTimeMonitorUpdate","realTimeMonitorLook","videoBoxUpdate","videoBoxLook","cameraManageUpdate","cameraManageLook","captureUpdate","captureLook","identitySearchUpdate","identitySearchLook","importantPersonUpdate","importantPersonLook","chartUpdate","chartLook","listUpdate","listLook","access_cardUpdate","access_cardLook","passagewayUpdate","passagewayLook","ownerUpdate","ownerLook","propertyUpdate","propertyLook","caller Update","caller Look","managementUpdate","managementLook","strangerUpdate","strangerLook","focusUpdate","focusLook","carManageUpdate","carManageLook","carPassUpdate","carPassLook","carportUpdate","carportLook","_manageUpdate","_manageLook","issueUpdate","issueLook","managerUpdate","managerLook","rolePowerUpdate","rolePowerLook","communityUpdate","communityLook","warningLinkUpdate","warningLinkLook","infoUpdate","infoLook","personPassChartLook","carPassChartUpdate","carPassChartLook","visitorCarChartUpdate","visitorCarChartLook","visitorChartUpdate","visitorChartLook","stallUpdate","stallLook","argumentsStallUpdate","argumentsStallLook","moduleLook","moduleUpdate","monitorLook","monitorUpdate","classroomLook","classroomUpdate","laboratoryLook","laboratoryUpdate","libraryLook","libraryUpdate","statisticsLook","statisticsUpdate","attendanceManageLook","attendanceManageUpdate","companyLook","companyUpdate","officeSpaceChartLook","officeSpaceChartUpdate"];
    let arr = ["importRecordLook", 'gradeInfoLook', "importRecordUpdate", 'dormLook', 'dormUpdate', "checkLook", "checkUpdate", "alarmUpdate", "alarmLook", "firstAppearUpdate", "firstAppearLook", "realTimeMonitorUpdate", "realTimeMonitorLook", "audioUpdate", "audioLook", "cameraManageUpdate", "cameraManageLook", "attentionPersonUpdate", "attentionPersonLook", "captureUpdate", "captureLook", "identitySearchUpdate", "identitySearchLook", "importantPersonUpdate", "importantPersonLook", "chartUpdate", "chartLook", "listUpdate", "listLook", "access_cardUpdate", "access_cardLook", "passagewayUpdate", "passagewayLook", "ownerUpdate", "ownerLook", "propertyUpdate", "propertyLook",
      "caller Update", "caller Look", "otherLook", "otherUpdate", "dormitoryWarnLook", "dormitoryWarnUpdate", "managementUpdate", "managementLook", "strangerUpdate", "strangerLook", "focusUpdate", "focusLook", "carManageUpdate", "carManageLook", "carPassUpdate", "carPassLook", "carportUpdate", "carportLook", "_manageUpdate", "_manageLook", "_companyUpdate", "_companyLook", "issueUpdate", "issueLook", "managerUpdate", "managerLook", "rolePowerUpdate", "rolePowerLook", "communityUpdate", "communityLook", "warningLinkUpdate", "warningLinkLook", "infoUpdate", "infoLook", "advicesUpdate", "advicesLook", "personPassChartLook", "carPassChartUpdate", "carPassChartLook", "visitorCarChartUpdate", "visitorCarChartLook", "visitorChartUpdate", "visitorChartLook", "stallUpdate", "stallLook", "argumentsStallUpdate", "argumentsStallLook", "moduleLook", "moduleUpdate", "monitorLook", "monitorUpdate", "classroomLook", "classroomUpdate", "laboratoryLook", "laboratoryUpdate", "libraryLook", "libraryUpdate",
      "statisticsLook", "statisticsUpdate", "issueUpdate", "issueLook", "attendanceManageLook", "attendanceManageUpdate", "companyLook", "companyUpdate", "officeSpaceChartLook", "officeSpaceChartUpdate", "standardUpdate", "standardLook", "clockUpdate", "clockLook", "allschoolLook", "allschoolUpdate", "residentLook", "residentUpdate", "schoolsetLook", "schoolsetUpdate", "allrecordLook", "allrecordUpdate", "dormrecordLook", "dormrecordUpdate", "staffrecordLook", "staffrecordUpdate", "teacherUpdate", "teacherLook", 'onePersonUpdate', 'onePersonLook', 'classroomUpdate', 'classroomLook', 'importantAreaLook', 'importantAreaUpdate', "takeUpdate", "takeLook", 'carCaptureLook', 'carCaptureUpdate', 'motoCaptureLook', 'motoCaptureUpdate', 'screenLook', 'screenUpdate'];
    return new Promise((resolve, reject) => {
      // getRoleList().then((res: any) => {
      commit('SET_PERMISSIONLIST', arr)
      resolve(arr)
      // })
    })
  },

  SELECT_ROUTE({ commit, state: stateType }, obj: object) {
    return new Promise((res, rej) => {
      const router = selectRoute(obj['route'], obj['role'])
      commit('SET_ROUTE', router)
      res(router)
    })
  },

  GET_WARNING({ commit, state: stateType }) {
    return new Promise((resolve, reject) => {
      alertUnRead().then((res: any) => {
        commit('GET_WARNING', res.data.data)
        resolve(res)
      }).catch(err => {
        reject(err);
      })
    })
  }
}
export default action;
