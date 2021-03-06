<template>
  <v-layout>
    <v-container v-if="department">
      <v-card-title>{{ department.name }}のアンケート結果の推移</v-card-title>
      <v-col v-for="item in departmentSurvey" :key="`user-${item.user.id}`">
        <v-card :to="item.url">
          <v-icon v-if="item.alert">
            mdi-alert
          </v-icon>
          <v-card-title>
            {{ item.user.name }}
            <v-spacer />
            <span class="body-2"><v-icon>mdi-human-handsup</v-icon>お悩み数 <span class="title">{{ item.help }}</span></span>
            <span>&nbsp;&nbsp;</span>
            <span class="body-2"><v-icon>mdi-comment</v-icon>コメント数 <span class="title">{{ item.comment }}</span></span>
          </v-card-title>
          <v-card-text>
            <VueBar :chart-data="enqueteData(item.survey)" :options="enqueteOptions" :width="2000" />
          </v-card-text>
          <v-card-subtitle class="d-flex justify-space-between">
            <span v-for="i in 5" :key="`legend-${i}`">
              {{ `${i}: ${enqueteValue2Text[i]}` }}
            </span>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-btn :to="'/admin/dashboard'" color="primary" block>
        <v-icon>mdi-chevron-left</v-icon>戻る
      </v-btn>
    </v-container>
  </v-layout>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import api from '~/plugins/api'
import enqueteValue2Icon from '~/assets/enquete_value2icon.json'
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
                display: true
              },
              ticks: {
                display: true,
                beginAtZero: true,
                min: 0,
                max: 5,
                stepSize: 1,
                fontSize: 17
              }
            }
          ]
        }
      },
      enqueteValue2Text: {
        1: '理想的な状況',
        2: '理想的な状況',
        3: '普通',
        4: '不満を抱えている',
        5: 'かなり不満を抱えている'
      },
      enqueteValue2Icon
    }
  },
  mounted () {
    this.fetchUser().then(() => {
      this.departmentId = this.$nuxt.$route.query.departmentId
      api.get(
        `/departments/${this.departmentId}`,
        { headers: this.getCred() }
      ).then((res) => {
        this.department = res.data
        this.fetchDepartmentSurvey()
      })
    })
  },
  computed: mapState(['userInfo']),
  methods: {
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserInfo', 'getCred']),
    unix2daystr (unix) {
      return moment.unix(unix).format('MM月DD日(締切)')
    },
    fetchDepartmentSurvey () {
      api.get(
        `/department-summary?department_id=${this.departmentId}&company_id=${this.userInfo.company_id}`,
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
