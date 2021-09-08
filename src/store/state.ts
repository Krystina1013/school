import stateType from "./type";
import { getToken, getName, getPassword, getPermission, getSceneId } from '@/utils/auth'
const state: stateType = {
  name: getName(),
  password: getPassword(),
  token: getToken(),
  sceneId: getSceneId(),
  permissionList: [],
  router: [],
  total: 0,
  record: 0,
  buildName :''
}
export default state
