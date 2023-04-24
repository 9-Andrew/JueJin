import axios from 'axios'
import { ElMessage } from 'element-plus'

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
      ElMessage.error(response.data.message)
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
