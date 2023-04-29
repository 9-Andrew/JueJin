import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserInfo } from '@/stores/index'

let service = axios.create({
  baseURL: 'http://localhost:3000',
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
    if (response.data.status) {
      if (response.data.status === 401) {
        if (localStorage.getItem('Token')) {
          ElMessage.error(response.data.message)
          let store = useUserInfo()
          store.$reset()
          localStorage.clear()
        }
      }
      return Promise.reject(response.data)
    } else {
      if (response.data.token) {
        localStorage.setItem('Token', response.data.token)
      }
      return Promise.resolve(response.data)
    }
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default service
