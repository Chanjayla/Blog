import { service } from '../utils'

export const getArticles = (params: any) =>
  service({
    url: '/articles',
    method: 'get',
    params
  })
