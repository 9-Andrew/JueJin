import request from '@/utils/request'

export const login = ({ username, password }) =>
  request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })

export const register = ({ username, password }) =>
  request({
    url: '/api/register',
    method: 'post',
    data: {
      username,
      password
    }
  })

export const reqUserInfo = (id) => request('/api/user?id=' + id)
