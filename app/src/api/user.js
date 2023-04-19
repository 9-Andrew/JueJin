import request from '@/utils/request';

export const login=()=>request({
  url:'/api/login',
})