<template>
  <v-layout>
    <v-container>
      <v-row>
        <v-col cols="12" v-for="depId in Object.keys(employeeInfos)" :key="`employee-infos-${depId}`">
          <h2>{{ departmentId2Name[depId] }}</h2>
          <v-card v-for="userInfo in employeeInfos[depId]" :key="`employee-info-${userInfo.id}`">
            <v-card-title>{{ userInfo.name }}</v-card-title>
            <v-card-text v-if="editableId != userInfo.id">
              部署: {{ departmentId2Name[userInfo.department_id] }}
              <v-btn text block color="green" @click="clickEditButton(userInfo.id, userInfo.department_id)">
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
              <v-btn color="primary" block @click="clickEditSaveButton(userInfo, userInfo.id, userInfo.department_id)">保存</v-btn>
              <v-btn color="red" dark block @click="editableId=-1">キャンセル</v-btn>
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
