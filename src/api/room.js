import request from '../request/index'
import { serverHost } from './server'

/**
 * 创建房间
 */
export function createRoom(data) {
  return request({
    url: `${serverHost}/room/create`,
    method: 'POST',
    data
  })
}

/**
 * 获取房间信息
 */
 export function getRoomInfo(data) {
  return request({
    url: `${serverHost}/room/info`,
    method: 'post',
    data
  })
}
