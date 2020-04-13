import axios from 'axios'
import { Message, MessageBox } from 'element-ui'

export const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    console.log(config)
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    // Message({
    //   message: res.message,
    //   type: 'error',
    //   duration: 2000
    // })
    return response.data
  }
)
