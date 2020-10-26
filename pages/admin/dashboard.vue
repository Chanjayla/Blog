<template>
    <div class="dashboard">
        <div class="server-status">
            <div class="server-status__item">
                <h1>MEM USAGE</h1>
                <el-progress :percentage="memUsagePercent"></el-progress>
                <p>
                    <span>Used: {{ mem.used || '0'}}MB</span>
                    <span>Total: {{ mem.total|| '0' }}MB</span>
                    <span>Free: {{ mem.free || '0'}}MB</span>
                </p>
            </div>
            <div class="server-status__item">
                <h1>DISK USAGE</h1>
                <el-progress :percentage="diskUsagePercent"></el-progress>
                <p>
                    <span>Used: {{ disk.used || '0'}}MB</span>
                    <span>Total: {{ disk.total || '0'}}MB</span>
                </p>
            </div>
            <div class="server-status__item">
                <h1>CPU USAGE</h1>
                <el-progress :percentage="cpuUsagePercent"></el-progress>
                <p>
                   <span>Platform: {{ cpu.platform }}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import * as Statistics from '~/api/statistics'
import wsConfig from '~/config/websocket'
export default {
    name: 'Dashboard',
    layout: 'admin',
    data() {
        return {
            ws: null,
            loopTimer: null,
            mem: {},
            disk: {},
            cpu: {},
            startTime: 0,
        }
    },
    mounted() {
        //    Statistics.getPv().then(res => {
        //        console.log(res)
        //    })
        this.websocketHandle()
    },
    destroyed() {
        this.ws.close()
    },
    methods: {
        websocketHandle() {
            this.ws = new WebSocket(wsConfig.url)
            this.ws.onopen = (e) => {
                this.startTime = new Date().getTime()
                this.ws.send(
                    JSON.stringify({
                        token: this.$store.state.user.token,
                        type: 1,
                    })
                )
            }
            this.ws.onmessage = (message) => {
                this.handleStatusData(message.data)
                clearTimeout(this.loopTimer)
                this.loopTimer = setTimeout(() => {
                    this.startTime = new Date().getTime()
                    this.ws.send(
                        JSON.stringify({
                            token: this.$store.state.user.token,
                            type: 1,
                        })
                    )
                }, 5000)
            }
        },
        handleStatusData(data) {
            data = JSON.parse(data)
            this.mem = data.mem || {}
            this.disk = data.disk || {}
            this.cpu = data.cpu || {}
        }
    },
    computed: {
        memUsagePercent() {
            return Math.floor(this.mem.used/this.mem.total*100) || 0
        },
        diskUsagePercent() {
            return Math.floor(this.disk.used/this.disk.total*100) || 0
        },
        cpuUsagePercent() {
            return parseInt(this.cpu.used) || 0
        }
    }
}
</script>
<style lang="scss" scoped>
.server-status {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    &__item {
        width: 33%;
        min-width: 300px;
        box-sizing: border-box;
        margin: 10px;
        padding: 10px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
        background: #fff;
        border-radius: 5px;
        h1 {
            margin-bottom: 10px;
            color: $normalFontColor;
            font-size: 16px;
        }
        p {
            margin-top: 10px;
            color: $secondaryFontColor;
            font-size: 14px;
            span {
                display: inline-block;
                margin: 0 5px 0 0;
            }
        }
    }
}
</style>