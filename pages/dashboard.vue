<template>
  <v-layout>
    <v-container>
      <v-row>
        <v-col v-for="item in chartValuesTable" :key="item.id" cols="4">
          <v-card>
            <line-chart :chart-data="lineData(item.vals)" :options="chartOptions" />
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="item in chartValuesTable" :key="item.id" cols="4">
          <v-card>
            <doughnut-chart :chart-data="chartData(item.vals)" :options="chartOptions" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
import colors from 'vuetify/es5/util/colors'
import { mapGetters, mapActions } from 'vuex'
// import axios from 'axios'
export default {
  data () {
    return {
      chartValuesTable: [
        { 'id': 1, 'vals': [30, 30, 30] },
        { 'id': 2, 'vals': [40, 50, 60] },
        { 'id': 2, 'vals': [40, 5, 6] }
      ],
      chartColors: [
        colors.red.lighten1,
        colors.blue.lighten1,
        colors.yellow.lighten1
      ],
      chartLabels: ['人', '仕事', '健康'],
      chartOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic'
        }
      }
    }
  },
  mounted () {
    this.fetchUser()
    this.fetchData()
  },
  methods: {
    ...mapActions(['fetchUser', 'loginDialogOn']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred']),
    fetchData () {
      //
    },
    chartData (vals) {
      return {
        datasets: [
          {
            data: vals,
            backgroundColor: this.chartColors
          }
        ],
        labels: this.chartLabels
      }
    },
    lineData (vals) {
      return {
        labels: ['A', 'B', 'C', 'D', 'E'],
        datasets: [
          {
            label: 'Data One',
            data: [1, 5, 3, 4, 3],
            borderColor: 'green',
            backgroundColor: 'rgba(0, 255, 0, 0.4)',
            fill: false,
            tension: 0 // 線を真っ直ぐにする
          }
        ]
      }
    }
  }
}
</script>
