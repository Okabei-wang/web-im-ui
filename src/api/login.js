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