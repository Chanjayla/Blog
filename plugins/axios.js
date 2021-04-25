import * as axios from 'axios'
import { Message } from 'element-ui'
export default ({ $axios, store }) => {
	if (process.env.NODE_ENV == 'development') {
		axios.defaults.baseURL = 'https://127.0.0.1:3000'
	} else {
		axios.defaults.baseURL = 'https://www.jaylang.cn'
	}
	$axios.onResponse(response => {
		console.log('test:', response)
		const message = response.data.msg
		const code = response.data.code 
		if (code == -1 || code == -2) {
			store.commit('user/REMOVE_TOKEN')
			Message({
				message: '认证错误' + message.name,
				type: 'error',
				duration: 3 * 1000
			})
			// redirect('/admin/login')
		}
		return response
	})
}
