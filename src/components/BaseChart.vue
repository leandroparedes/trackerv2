<template>
    <div style="position: relative; height: 50vh; width: 100%">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
import Chart from 'chart.js';

export default {
    name: 'BaseChart',

    extends: Line,

    mixins: [reactiveProp],

    props: ['type'],
    
    data: function () {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0
                },
                elements: {
                    point: {
                        radius: 1
                    }
                },
                legend: {
                    labels: {
                        boxWidth: 8,
                        usePointStyle: true,
                    }
                },
                hover: {
                    mode: 'index',
                    intersect: false,
                    animationDuration: 0
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#000',
                    titleFontSize: 18,
                    titleFontColor: '#2196f3',
                    titleAlign: 'center',
                    titleMarginBottom: 10,
                    bodySpacing: 10,
                    bodyFontSize: 14,
                    xPadding: 10,
                    yPadding: 10,
                    callbacks: {
                        title: (tooltipItem, data) => {
                            return this.$moment(tooltipItem[0].xLabel).format('MMMM Do, YYYY');
                        },
                        label: function (tooltipItem, data) {
                            return ' ' + data.datasets[tooltipItem.datasetIndex].label + ': ' + Intl.NumberFormat().format(tooltipItem.yLabel);
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        type: this.type,
                        ticks: {
                            callback: function (n, index, values) {
                                if (n < 1e3) return n;
                                if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
                                if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
                                if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
                                if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
                            },
                            maxTicksLimit: 9
                        },
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day',
                            unitStepSize: this.$vuetify.breakpoint.mdAndDown ? 15 : 10
                        }
                    }]
                }
            }
        }
    },

    mounted () {
        Chart.Legend.prototype.afterFit = function() {
            this.height = this.height + 10;
        };
        
        this.renderChart(this.chartData, this.options);
    },

    watch: {
        'chartData.datasets': function () {
            this.$data._chart.update();
        },
    }
}
</script>