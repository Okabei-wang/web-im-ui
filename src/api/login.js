import request from '../request/index'
import { serverHost } from './server'

/**
 * 验证码
 */
export function fetchImageCode() {
  return request({
    url: `${serverHost}/login/image_code`,
    method: 'GET'
  })
}

/**
 * 注册
 */
 export function registerUser(data) {
  return request({
    url: `${serverHost}/login/register`,
    method: 'POST',
    data
  })
}

/**
 * 登录
 */
 export function loginUser(data) {
  return request({
    url: `${serverHost}/user/login`,
    method: 'POST',
    data
  })
}

/**
 * 获取用户信息
 */
 export function userInfo() {
  return request({
    url: `${serverHost}/user/info`,
    method: 'GET'
  })
}

/**
 * 获取好友列表
 */
 export function getFriendList(data) {
  return request({
    url: `${serverHost}/friend/list`,
    method: 'POST',
    data
  })
}

/**
 * 更改用户头像
 */
 export function updateAvatar(data) {
  return request({
    url: `${serverHost}/update/avatar`,
    method: 'POST',
    data
  })
}

/**
 * 搜索用户
 */
 export function searchUser(data) {
  return request({
    url: `${serverHost}/find/user`,
    method: 'POST',
    data
  })
}

/**
 * 用户消息列表
 */
 export function getUserMessageList(data) {
  return request({
    url: `${serverHost}/user/Message/list`,
    method: 'get'
  })
}