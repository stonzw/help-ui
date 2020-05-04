<template>
  <v-layout>
    <v-container v-if="department">
      <v-card-title>{{ department.name }}のアンケート結果の推移</v-card-title>
      <v-col v-for="item in departmentSurvey" :key="`user-${item.user.id}`">
        <v-card :to="item.url">
          <v-icon v-if="item.alert">
            mdi-alert
          </v-icon>
          <v-card-title>{{ item.user.name }}</v-card-title>
          <v-card-text>
            <VueBar :chart-data="enqueteData(item.survey)" :options="enqueteOptions" :width="2000" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-btn :to="'/admin/dashboard'" color="primary" block>
        <v-icon>mdi-chevron-left</v-icon>戻る
      </v-btn>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import moment from 'moment'
export default {
  data () {
    return {
      department: null,
      departmentSurvey: null,
      relatedProblems: [],
      enqueteOptions: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                beginAtZero: true,
                display: true
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                display: true,
                beginAtZero: true,
                stepSize: 1
              }
            }
          ]
        }
      }
    }
  },
  mounted () {
    this.fetchUser()
    this.departmentId = this.$nuxt.$route.query.departmentId
    axios.get(
      `${process.env.API_URL}/departments/${this.departmentId}`,
      { headers: this.getCred() }
    ).then((res) => {
      this.department = res.data
      this.fetchDepartmentSurvey()
    })
  },
  methods: {
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserInfo', 'getCred']),
    unix2daystr (unix) {
      return moment.unix(unix).format('MM月DD日(締切)')
    },
    fetchDepartmentSurvey () {
      axios.get(
        `${process.env.API_URL}/department-summary?department_id=${this.departmentId}`,
        { headers: this.getCred() }
      ).then((res) => {
        this.departmentSurvey = res.data.map(
          (val, idx) => {
            if (idx === 0) {
              val.url = `/admin/detail/?departmentId=${val.user.user_id}`
              return val
            } else {
              val.url = `/admin/detail/?userId=${val.user.user_id}`
              return val
            }
          }
        )
      })
    },
    enqueteData (enquetes) {
      const labels = enquetes.date.map(
        (d) => {
          return moment(d).format('YYYY-MM-DD')
        }
      )
      return {
        datasets: [
          {
            label: 'Work',
            data: enquetes.work,
            backgroundColor: 'rgba(164, 161, 251)',
            spanGaps: true,
            fill: false,
            barPercentage: 0.4
          },
          {
            label: 'Human',
            data: enquetes.human,
            backgroundColor: 'rgba(252, 131, 115)',
            lineTension: false,
            spanGaps: true,
            fill: false,
            barPercentage: 0.4
          },
          {
            label: 'Health',
            data: enquetes.health,
            backgroundColor: 'rgba(133, 227, 136)',
            lineTension: false,
            spanGaps: true,
            fill: false,
            barPercentage: 0.4
          }
        ],
        labels
      }
    }
  }
}
</script>
