<template>
    <div class="chart-box">
        <div class="chart-content" ref="chartContent"></div>
    </div>
</template>
<script>
import * as Statistics from '~/api/statistics'
import echarts from '~/libs/echarts.min.js'
export default {
    data() {
        return {
            echartsInstance: null,
        }
    },
    mounted() {
        this.echartsInstance = echarts.init(this.$refs['chartContent'], 'light')
        this.requestStatistics()
    },
    methods: {
        requestStatistics() {
            Statistics.getBlogPv().then((res) => {
                const data = this.handleData(res.data)
                this.initChart(data.xs, data.ys)
                this.$emit('blogView', res.data)
            })
        },
        handleData(data) {
            const xs = []
            const ys = []
            data.forEach((item) => {
                xs.push(item.title)
                ys.push(item.pv)
            })
            return {
                xs,
                ys,
            }
        },
        initChart(xs, ys) {
            const baseOption = {
                title: {
                    text: 'blog view',
                },
                xAxis: {
                    type: 'category',
                    data: xs,
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: true,
                        color: '#409EFF',
                        formatter(value, index) {
                            return ys[index] + '次'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#999'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [
                    {
                        data: ys,
                        type: 'bar',
                        itemStyle: {
                            color: '#409EFF',
                            opacity: 0.8
                        },
                        label: {
                            show: true,
                            position: 'top',
                            distance: 10,
                            color: '#409EFF',
                            formatter(value) {
                                if(value.name.length > 8) {
                                    return value.name.substring(0,8) + '...'
                                } else {
                                    return value.name
                                }
                            }
                        }
                    },
                ],
            }
            if (ys.length > 10) {
                baseOption.dataZoom = [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100,
                    },
                ]
            }
            this.echartsInstance.setOption(baseOption)
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