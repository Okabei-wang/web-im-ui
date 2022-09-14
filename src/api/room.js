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
 * 获取房间列表
 */
 export function getRoomList(data) {
  return request({
    url: `${serverHost}/room/list`,
    method: 'POST',
    data
  })
}

/**
 * 获取房间列表
 */
 export function getRoomInfo(data) {
  return request({
    url: `${serverHost}/room/info`,
    method: 'POST',
    data
  })
}

/**
 * 获取房间历史消息
 */
 export function getRoomHistory(data) {
  return request({
    url: `${serverHost}/room/history`,
    method: 'POST',
    data
  })
}

/**
 * 进入房间
 */
 export function entryRoom(data) {
  return request({
    url: `${serverHost}/entry/room`,
    method: 'POST',
    data
  })
}
