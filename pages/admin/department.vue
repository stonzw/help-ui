<template>
  <v-layout>
    <v-container v-if="department">
      <v-card-title>{{ department.name }}のアンケート結果の推移</v-card-title>
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
      <v-card-title>{{ department.name }}のhelp</v-card-title>
      <v-row>
        <v-col v-for="item in relatedProblems" :key="`related-problem-${item.id}`" class="col-6 d-flex flex-no-wrap">
          <v-card :href="item.url">
            <v-img
              :src="item.image_url"
            ></v-img>
            <v-card-title>
              {{ item.title }}
            </v-card-title>
            <v-card-subtitle>
              {{ unix2daystr(item.deadline) }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
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
      )
        .then((res) => {
          this.departmentSurvey = res.data
        })

      axios.get(
        `${process.env.API_URL}/search-department-problem?department_id=${this.departmentId}`,
        { headers: this.getCred() }
      ).then((res) => {
        this.relatedProblems = res.data.map(
          (p) => {
            return {
              id: p.id,
              image_url: p.image_url,
              url: '/help/?helpId=' + p.id,
              title: p.title,
              deadline: p.deadline
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
            borderColor: '#A4A1FB',
            lineTension: false,
            spanGaps: true,
            fill: false
          },
          {
            label: 'Human',
            data: enquetes.human,
            borderColor: '#FC8373',
            lineTension: false,
            spanGaps: true,
            fill: false
          },
          {
            label: 'Health',
            data: enquetes.health,
            borderColor: '#85E388',
            lineTension: false,
            spanGaps: true,
            fill: false
          }
        ],
        labels
      }
    }
  }
}
</script>
