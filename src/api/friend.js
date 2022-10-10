import request from '../request/index'
import { serverHost } from './server'

/**
 * 同意好友
 */
 export function agreeInvite(data) {
  return request({
    url: `${serverHost}/friend/agree`,
    method: 'POST',
    data
  })
}

/**
 * 获取好友信息
 */
 export function getFriendInfo(data) {
  return request({
    url: `${serverHost}/friend/info`,
    method: 'POST',
    data
  })
}

/**
 * 获取好友历史记录
 */
 export function getFriendHistory(data) {
  return request({
    url: `${serverHost}/friend/history`,
    method: 'POST',
    data
  })
}