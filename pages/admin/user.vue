<template>
  <v-layout>
    <v-container>
      <v-row>
        <v-col v-for="depId in Object.keys(employeeInfos)" :key="`employee-infos-${depId}`" cols="12">
          <h2>{{ departmentId2Name[depId] }}</h2>
          <v-card v-for="userInfo in employeeInfos[depId]" :key="`employee-info-${userInfo.id}`">
            <v-card-title>{{ userInfo.name }}</v-card-title>
            <v-card-text v-if="editableId != userInfo.id">
              部署: {{ departmentId2Name[userInfo.department_id] }}
              <v-btn @click="clickEditButton(userInfo.id, userInfo.department_id)" text block color="green">
                部署を編集する
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
              <v-btn @click="clickEditSaveButton(userInfo, userInfo.id, userInfo.department_id)" color="primary" block>
                保存
              </v-btn>
              <v-btn @click="editableId=-1" color="red" dark block>
                キャンセル
              </v-btn>
            </v-card-text>
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
  data () {
    return {
      employeeInfos: {},
      editableId: -1,
      departments: [],
      departmentId2Name: {},
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
    fetchEmployeeInfos (userInfo) {
      const companyId = this.getUserInfo().company_id
      axios.get(
        `${process.env.API_URL}/departments?company_id=${companyId}`,
        { headers: this.getCred() }
      )
        .then((res) => {
          this.departments = res.data
          const employeeInfos = {}
          res.data.map((elem) => {
            this.departmentId2Name[elem.id] = elem.name
            employeeInfos[elem.id] = []
          })
          axios.get(
            `${process.env.API_URL}/search-user-info?company_id=${companyId}`,
            { headers: this.getCred() }
          )
            .then((res) => {
              res.data.map((elem) => {
                employeeInfos[elem.department_id].push(elem)
                this.employeeInfos = employeeInfos
              })
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
