import axios from 'axios'
import { getToken } from '../utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 * 2 // request timeout
})

const whitelist = ['login/image_code', 'login/register', 'user/login']

// request interceptor
service.interceptors.request.use(
  config => {
    let isNeedAuth = true
    for(let i in whitelist) {
      if(config.url.indexOf(whitelist[i]) > -1) {
        isNeedAuth = false
      }
    }
    if(isNeedAuth) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if(response.data.code !== 0) {
      $message.error(response.data.message)
      return res
    }
    // if the custom code is not 20000, it is judged as an error.
    return res
  },
  error => {
    return Promise.reject(error)
  }
)

export default service