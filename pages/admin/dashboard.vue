<template>
    <div></div>
</template>
<script>
import * as Statistics from '~/api/statistics'
export default {
    name: 'Dashboard',
    layout: 'admin',
    data() {
        return {
            ws: null
        }
    },
    mounted() {
    //    Statistics.getPv().then(res => {
    //        console.log(res)
    //    })
        this.ws = new WebSocket("ws://127.0.0.1:3000");
        this.ws.onopen = function (e) {
            //成功连接服务器回调
            console.log('客户端（client）：与服务器的连接已打开')
        }
    },
    destroyed() {
        this.ws.close()
    },
    methods: {

    }
}
</script>