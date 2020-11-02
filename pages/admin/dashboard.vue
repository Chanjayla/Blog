<template>
    <div class="dashboard">
        <div class="server-status">
            <div class="server-status__item">
                <h1>MEM USAGE</h1>
                <el-progress :percentage="memUsagePercent"></el-progress>
                <p>
                    <span>Used: {{ mem.used || '0' }}MB</span>
                    <span>Total: {{ mem.total || '0' }}MB</span>
                    <span>Free: {{ mem.free || '0' }}MB</span>
                </p>
            </div>
            <div class="server-status__item">
                <h1>DISK USAGE</h1>
                <el-progress :percentage="diskUsagePercent"></el-progress>
                <p>
                    <span>Used: {{ disk.used || '0' }}MB</span>
                    <span>Total: {{ disk.total || '0' }}MB</span>
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
        <el-row class="st-row" :gutter="20">
            <el-col :span="16" style="height: 400px">
                <PvChart @ipView="refreshViewIP" />
            </el-col>
            <el-col :span="8" class="view-box">
                <h2>Most View IP</h2>
                <dl class="view-box__list">
                    <dd v-for="(num, ip) in viewIPs" :key="ip">
                        <span>{{ ip }}</span>
                        <span>{{ num }}次</span>
                    </dd>
                </dl>
            </el-col>
        </el-row>
        <el-row class="st-row" :gutter="20">
            <el-col :span="16" style="height: 400px">
                <BlogPvChart @blogView="refreshViewBlog" />
            </el-col>
            <el-col :span="8" class="view-box">
                <h2>Most View Blog</h2>
                <ul class="view-box__list">
                    <li v-for="(item, idx) in viewBlogs" :key="item.title">
                        <img
                            class="icon"
                            :src="item.preview_image"
                            @error="loadDefaultIcon"
                        />
                        <span class="tit">{{ item.title }}</span>
                        <span class="rank">{{idx+1}}</span>
                    </li>
                </ul>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import wsConfig from '~/config/websocket'
import PvChart from '~/components/Chart/pvChart'
import BlogPvChart from '~/components/Chart/blogPvChart'
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
            viewIPs: {},
            viewBlogs: [],
        }
    },
    components: {
        PvChart,
        BlogPvChart,
    },
    mounted() {
        this.websocketHandle()
    },
    destroyed() {
        this.ws && this.ws.close()
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
        },
        refreshViewIP(data) {
            this.viewIPs = data
        },
        refreshViewBlog(data) {
            this.viewBlogs = data
            console.log(this.viewBlogs)
        },
        loadDefaultIcon(e) {
            console.log(e)
        }
    },
    computed: {
        memUsagePercent() {
            return Math.floor((this.mem.used / this.mem.total) * 100) || 0
        },
        diskUsagePercent() {
            return Math.floor((this.disk.used / this.disk.total) * 100) || 0
        },
        cpuUsagePercent() {
            return parseInt(this.cpu.used) || 0
        },
    },
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
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
            0 0 3px 0 rgba(0, 0, 0, 0.04);
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
.st-row {
    box-sizing: border-box;
    padding: 0 20px;
    margin-bottom: 20px;
}
.view-box {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 400px;
    padding: 10px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    background: #fff;
    border-radius: 5px;
    color: $normalFontColor;
    h2 {
        font-size: 16px;
        padding-bottom: 10px;
        margin-bottom: 15px;
        border-bottom: 1px solid $borderColor;
    }
    dd {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        color: $secondaryFontColor;
        font-size: 14px;
        line-height: 2;
    }
    &__list {
        padding: 0;
        list-style: none;
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
        li {
            box-sizing: border-box;
            display: block;
            position: relative;
            height: 40px;
            line-height: 40px;
            padding: 0 50px;
            font-size: 14px;
            .icon {
                position: absolute;
                left: 5px;
                top: 0;
                bottom: 0;
                margin: auto;
                width: 30px;
                height: 30px;
                border-radius: 50%;
            }
            .tit {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .rank {
                position: absolute;
                right: 5px;
                top: 0;
                bottom: 0;
                margin: auto;
                width: 24px;
                height: 24px;
                line-height: 24px;
                background: #444;
                color: #fff;
                text-align: center;
                
            }
        }
    }
}
</style>