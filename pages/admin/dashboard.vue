<template>
  <v-layout>
    <v-container>
      <v-row>
        <v-col cols="4" v-for="item in departments" :key="`department-${item.id}`">
          <v-card>
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-text>
              <VueDoughnut :chart-data="enqueteData(item.vals)" :options="enqueteOptions" />
            </v-card-text>
            <v-btn :to="`/admin/department/${item.id}`" color="primary" block>詳細を確認</v-btn>
          </v-card>
        </v-col>
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
          display: true,
          labels: {
            usePointStyle: true
          }
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
    ...mapActions(['fetchUser']),
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
