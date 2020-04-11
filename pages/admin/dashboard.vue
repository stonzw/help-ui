<template>
  <v-layout>
    <v-container>
      <v-row>
        <v-card v-for="item in departments" :key="`department-${item.id}`">
          <v-card-title>{{ item.name }}</v-card-title>
          <VueDoughnut :chart-data="enqueteData(item.vals)" :options="enqueteOptions" />
        </v-card>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default {
  head () {
    return {
      title: 'ダッシュボード'
    }
  },
  data () {
    return {
      enqueteOptions: {
        legend: {
          display: true
        },
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI
      },
      surveyData: {},
      departments: []
    }
  },
  mounted () {
    this.fetchUser()
    this.fetchData()
  },
  methods: {
    ...mapActions(['fetchUser', 'fetchUserInfo', 'loginDialogOn']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserInfo', 'getCred', 'isAdminUser']),
    enqueteData (vals) {
      return {
        labels: ['Human', 'Work', 'Health'],
        datasets: [
          {
            data: vals,
            backgroundColor: ['#A4A1FB', '#FC8373', '#85E388']
          }
        ]
      }
    },
    fetchData () {
      const companyId = this.getUserInfo().company_id
      axios.get(
        `http://localhost:3000/survey-summary`,
        { headers: this.getCred() }
      )
        .then((res1) => {
          axios.get(
            `http://localhost:3000/departments?company_id=${companyId}`,
            { headers: this.getCred() }
          )
            .then((res2) => {
              const survey = {}
              res1.data.map((element) => {
                survey[element.id] = element.vals
              })
              const departments = res2.data
              this.departments = departments.map((department) => {
                if (survey[department.id]) {
                  department.vals = survey[department.id]
                } else {
                  department.vals = [0, 0, 0]
                }
                return department
              })
            })
        })
    }
  }
}
</script>
