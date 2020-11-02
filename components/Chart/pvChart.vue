<template>
    <div class="chart-box">
        <div class="chart-content" ref="chartContent"></div>
        <el-dropdown @command="selectMode" class="dropdown">
            <span class="el-dropdown-link">
                {{ typeItems[type]
                }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="type in typeItems"
                    :key="type"
                    :command="type"
                    >{{ type }}</el-dropdown-item
                >
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
import * as Statistics from '~/api/statistics'
import echarts from 'echarts'
export default {
    data() {
        return {
            echartsInstance: null,
            type: -1,
            typeItems: ['Recent 7 Days', 'This Month', 'Recent 3 Months'],
            lineX: [],
            lineY: [],
            dates: null,
        }
    },
    mounted() {
        this.echartsInstance = echarts.init(
            this.$refs['chartContent'],
            'light'
        )
        this.type = 0
    },
    watch: {
        type() {
            const date = new Date() 
            if (this.type === 0) {
                const today0 = Date.now() - (date.getSeconds()+date.getMinutes()*60+date.getHours()*3600)*1000
                const startTime = today0 - 6 * 24 * 3600 * 1000
                this.dates = this.getDateArr(startTime, Date.now())
            } else if (this.type === 1) {
                const startTime = new Date(`${date.getFullYear()}-${date.getMonth()+1}-1 00:00:00`).getTime()
                this.dates = this.getDateArr(startTime, Date.now())
            } else if (this.type === 2) {
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                if(month < 3) {
                    year = year - 1
                    month = 10 + month
                } else {
                    month -= 2
                }
                const startTime = new Date(`${year}-${month}-1 00:00:00`).getTime()
                this.dates = this.getDateArr(startTime, Date.now())
            }
        },
        dates() {
            this.requestStatistics()
        },
    },
    methods: {
        requestStatistics() {
            Statistics.getPv({
                stime: this.dates.stime,
            }).then((res) => {
                const xs = this.dates.arr
                const data = this.handleData(res.data)
                this.initChart(xs, data.pv, data.uv)
                this.$emit('ipView', data.ip)
            })
        },
        handleData(data) {
            const len = this.dates.timeStampArr.length
            let pvResult = this.initCountArr(len)
            let uvResult = this.initCountArr(len)
            let record = []
            let ipResult = {}
            let timeStampArr = this.dates.timeStampArr.reverse()
            for (let i = 0; i < data.length; ++i) {
                let time = new Date(data[i].date).getTime()
                let idx = timeStampArr.findIndex((item) => time > item)
                pvResult[len - 1 - idx] = pvResult[len - 1 - idx]
                    ? pvResult[len - 1 - idx] + 1
                    : 1
                ipResult[data[i].ip] = ipResult[data[i].ip]
                    ? ipResult[data[i].ip] + 1
                    : 1
                if (
                    record[len - 1 - idx] &&
                    record[len - 1 - idx][data[i].ip]
                ) {
                    continue
                }
                record[len - 1 - idx]
                    ? (record[len - 1 - idx][data[i].ip] = 1)
                    : (record[len - 1 - idx] = { [[data[i].ip]]: 1 })
                uvResult[len - 1 - idx] = uvResult[len - 1 - idx]
                    ? uvResult[len - 1 - idx] + 1
                    : 1
            }
            return {
                pv: pvResult,
                uv: uvResult,
                ip: ipResult,
            }
        },
        initChart(xs, pvData, uvData) {
            this.echartsInstance.setOption({
                xAxis: {
                    type: 'category',
                    data: xs,
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100,
                    }
                ],
                legend: {
                    data: ['pv', 'uv'],
                    right: 10,
                },
                series: [
                    {
                        name: 'pv',
                        data: pvData,
                        type: 'line',
                        itemStyle: { normal: { label: { show: true } } },
                    },
                    {
                        name: 'uv',
                        data: uvData,
                        type: 'line',
                        itemStyle: { normal: { label: { show: true } } },
                    },
                ],
                title: {
                    text: 'pv/uv',
                },
            })
        },
        getDateArr(startTime, endTime) {
            const dates = {
                arr: [],
                timeStampArr: [],
            }
            const step = 60 * 60 * 24 * 1000
            for(let temp=startTime;temp<endTime;temp+=step) {
                const tempDate = new Date(temp)
                const year = tempDate.getFullYear()
                const month = tempDate.getMonth()
                const day = tempDate.getDate()
                dates.arr.push(`${year}-${month+1}-${day}`)
                dates.timeStampArr.push(temp)
            }
            dates.stime = startTime
            return dates
        },
        selectMode(command) {
            if (command == 'Recent 7 Days') {
                this.type = 0
            } else if (command == 'This Month') {
                this.type = 1
            } else if (command == 'Recent 3 Months') {
                this.type = 2
            }
        },
        initCountArr(len) {
            const result = []
            if (typeof len !== 'number') {
                return result
            }
            for (let i = 0; i < len; ++i) {
                result.push(0)
            }
            return result
        },
    },
}
</script>
<style lang="scss" scoped>
.chart-box {
    position: relative;
    height: 100%;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    background: #fff;
    border-radius: 5px;
}
.chart-content {
    box-sizing: border-box;
    padding: 10px;
    height: 100%;
}
.dropdown {
    position: absolute;
    top: 20px;
    left: 100px;
    color: $linkHoverColor;
}
</style>