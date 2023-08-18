import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserInfoStore from '@/store/user'

let service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASEURL,
  timeout: 3000
})

service.interceptors.request.use((config) => {
  if (localStorage.getItem('Token')) {
    config.headers['Authorization'] = localStorage.getItem('Token')
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})
service.interceptors.response.use(
  (response) => {
    let { status, message, token } = response.data
    // 状态码为失败
    if (status) {
      if (status === 401) {
        if (localStorage.getItem('Token')) {
          ElMessage.error(message)
          let store = useUserInfoStore()
          store.$reset()
          localStorage.clear()
        }
      } else {
        ElMessage({
          type: status == '2' ? 'info' : 'error',
          message
        })
      }
      return Promise.reject(response.data)
    } else {
      if (token) {
        localStorage.setItem('Token', token)
      }
      return Promise.resolve(response.data)
    }
  },
  (err) => {
    ElMessage.error(err)
    return Promise.reject(err)
  }
)

export default service
