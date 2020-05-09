<template>
  <v-layout>
    <v-container>
      <v-row>
        <v-col v-for="item in departments" :key="`department-${item.id}`" cols="4">
          <v-card>
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-text>
              <span>ストレス度</span>
              <div class='d-flex justify-space-around'>
                <span>Human <span class="title">{{ `${item.vals[0]}`.slice(0, 3) }}</span> </span>
                <span>Work <span class="title">{{ `${item.vals[1]}`.slice(0, 3) }}</span></span>
                <span>Health <span class="title">{{ `${item.vals[2]}`.slice(0, 3) }}</span></span>
              </div>
              <VueHorizontalBar :chart-data="enqueteData(item.vals)" :options="enqueteOptions" />
            </v-card-text>
            <v-btn :to="`/admin/department/?departmentId=${item.id}`" color="primary" block>
              詳細を確認
            </v-btn>
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
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                beginAtZero: true,
                display: false
              }
            }
          ],
          yAxes: [
            {
              barPercentage: 0.7,
              gridLines: {
                display: false
              },
              ticks: {
                display: true
              }
            }
          ]
        }
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
        `${process.env.API_URL}/survey-summary`,
        { headers: this.getCred() }
      )
        .then((res1) => {
          axios.get(
            `${process.env.API_URL}/departments?company_id=${companyId}`,
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
