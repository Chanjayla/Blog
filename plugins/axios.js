import * as axios from 'axios'
export default ({ app, store, redirect }) => {
	if(process.env.NODE_ENV == 'development') {
		axios.defaults.baseURL = 'http://127.0.0.1:3000'
	} else {
		axios.defaults.baseURL = 'http://47.101.61.8'
	}

	// request拦截器，我这里设置了一个token，当然你可以不要
	// axios.onRequest(config => {
	// 	config.headers.common['X-Access-Token'] = store.state.token
	// })
	// axios.onError(error => {
		
	// })
	// // response拦截器，数据返回后，你可以先在这里进行一个简单的判断
    // 	axios.interceptors.response.use(response => {
		
	// })
}
