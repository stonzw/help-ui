<template>
  <v-layout>
    <v-container>
      <v-row>
        <v-col cols="12" v-for="user_info in employeeInfos" :key="`employee-info${user_info.id}`">
          <v-card>
            <v-card-title>
              {{ user_info.name }}
            </v-card-title>
            <v-card-text v-if="editableId != user_info.id">
              部署: {{ departmentId2Name[user_info.department_id] }}
              <v-btn text block color="green" @click="clickEditButton(user_info.id, user_info.department_id)">
                編集する
                <v-icon>
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-card-text>
            <v-card-text v-else>
              <v-select
                v-model="selectedDepartment"
                :items="departments"
                item-text="name"
                item-value="id"
              />
              <v-btn color="primary" block @click="clickEditSaveButton(user_info, user_info.id, user_info.department_id)">保存</v-btn>
              <v-btn color="red" dark block @click="editableId=-1">キャンセル</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <line-chart :chart-data="lineData()" :options="chartOptions" />
          </v-card>
        </v-col>
        <v-col v-for="item in chartValuesTable" :key="`chart${item.id}`" cols="4">
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
import axios from 'axios'
export default {
  head () {
    return {
      title: 'ダッシュボード'
    }
  },
  data () {
    return {
      chartValuesTable: [
        { 'id': 1, 'vals': [30, 30, 30] },
        { 'id': 2, 'vals': [40, 50, 60] },
        { 'id': 3, 'vals': [40, 5, 6] }
      ],
      chartColors: [
        colors.red.lighten1,
        colors.blue.lighten1,
        colors.yellow.lighten1
      ],
      departmentId2Name: {},
      chartLabels: ['人', '仕事', '健康'],
      chartOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic'
        }
      },
      employeeInfos: [],
      editableId: -1,
      departments: [],
      selectedDepartment: {}
    }
  },
  mounted () {
    this.fetchUser()
    this.fetchEmployeeInfos()
  },
  methods: {
    ...mapActions(['fetchUser', 'fetchUserInfo', 'loginDialogOn']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserInfo', 'getCred', 'isAdminUser']),
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
    lineData () {
      return {
        labels: ['2020-02-01', '2020-02-08', '2020-02-15', '2020-02-22', '2020-03-01'],
        datasets: [
          {
            label: 'ログインユーザー数',
            data: [10, 8, 12, 7, 6],
            borderColor: 'red',
            backgroundColor: 'rgba(0, 255, 0, 0.4)',
            fill: false,
            tension: 0 // 線を真っ直ぐにする
          },
          {
            label: '回答ユーザー数',
            data: [7, 5, 8, 4, 5],
            borderColor: 'green',
            backgroundColor: 'rgba(0, 255, 0, 0.4)',
            fill: false,
            tension: 0 // 線を真っ直ぐにする
          },
          {
            label: '質問投稿ユーザー数',
            data: [6, 4, 8, 2, 5],
            borderColor: 'yellow',
            backgroundColor: 'rgba(0, 255, 0, 0.4)',
            fill: false,
            tension: 0 // 線を真っ直ぐにする
          }
        ]
      }
    },
    fetchEmployeeInfos (userInfo) {
      const companyId = this.getUserInfo().company_id
      axios.get(
        `http://localhost:3000/departments?company_id=${companyId}`,
        { headers: this.getCred() }
      )
        .then((res) => {
          this.departments = res.data
          res.data.map((elem) => {
            this.departmentId2Name[elem.id] = elem.name
          })
          axios.get(
            `http://localhost:3000/search-user-info?company_id=${companyId}`,
            { headers: this.getCred() }
          )
            .then((res) => {
              this.employeeInfos = res.data
            })
        })
    },
    clickEditButton (userId, departmentId) {
      this.editableId = userId
      this.selectedDepartment = {
        'id': departmentId,
        'name': this.departmentId2Name[departmentId]
      }
    },
    clickEditSaveButton (userInfo, departmentId) {
      const body = {
        department_id: this.selectedDepartment
      }
      const headers = this.getCred()
      axios.put(`${process.env.API_URL}/user_infos/${userInfo.id}`, body, { headers })
        .then((res) => {
          userInfo.department_id = this.selectedDepartment
          this.editableId = -1
        })
    }
  }
}
</script>
