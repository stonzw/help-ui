<template>
  <v-layout>
    <v-container v-if="department">
      <v-card-title>{{ department.name }}</v-card-title>
      <v-col v-for="item in departmentSurvey" :key="`user-${item.user.id}`">
        <v-card>
          <v-icon v-if="item.alert">mdi-alert</v-icon>
          <v-card-title>{{ item.user.name }}</v-card-title>
          <v-card-text>
            <VueLine :chart-data="enqueteData(item.survey)" :options="enqueteOptions" :width="2000"></VueLine>
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
export default {
  data () {
    return {
      department: null,
      departmentSurvey: null,
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
                display: false
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
    fetchDepartmentSurvey () {
      axios.get(
        `${process.env.API_URL}/department-summary?department_id=${this.departmentId}`,
        { headers: this.getCred() }
      )
        .then((res) => {
          this.departmentSurvey = res.data
        })
    },
    enqueteData (enquetes) {
      return {
        datasets: [
          {
            label: 'Work',
            data: enquetes.work,
            borderColor: '#A4A1FB',
            lineTension: false,
            fill: false
          },
          {
            label: 'Human',
            data: enquetes.human,
            borderColor: '#FC8373',
            lineTension: false,
            fill: false
          },
          {
            label: 'Health',
            data: enquetes.health,
            borderColor: '#85E388',
            lineTension: false,
            fill: false
          }
        ],
        labels: enquetes.date
      }
    }
  }
}
</script>
