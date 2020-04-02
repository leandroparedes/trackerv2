<template>
    <div style="position: relative; height: 50vh; width: 100%">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

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
                elements: {
                    point: {
                        radius: 1
                    }
                },
                hover: {
                    mode: 'index',
                    intersect: false
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
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return ' ' + data.datasets[tooltipItem.datasetIndex].label + ': ' + Intl.NumberFormat('de-DE').format(tooltipItem.yLabel);
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
                            maxTicksLimit: 10
                        },
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day',
                            unitStepSize: 15
                        }
                    }]
                }
            }
        }
    },

    mounted () {
        this.renderChart(this.chartData, this.options);
    },

    watch: {
        'chartData.datasets': function () {
            this.$data._chart.update();
        },
    }
}
</script>