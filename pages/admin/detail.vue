<template>
  <v-layout v-if="!loading">
    <v-container>
      <h2 v-if="department">{{ department.name }}のHelp</h2>
      <h2 v-if="user_info">{{ user_info.name }}さんのHelp</h2>
      <v-row
        align="center"
        justify="center"
        class="d-flex"
      >
        <v-col v-for="item in relatedProblems" :key="`related-problem-${item.id}`" class="col-6 d-flex align-self-stretch">
          <v-card :href="item.url" class="align-self-stretch">
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
      <v-btn :to="`/admin/department/?departmentId=${departmentId}`" color="primary" block>
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
      loading: true,
      department: null,
      user_info: null,
      departmentId: null,
      relatedProblems: []
    }
  },
  mounted () {
    this.fetchUser()
    this.departmentId = this.$nuxt.$route.query.departmentId
    this.userId = this.$nuxt.$route.query.userId
    if (this.departmentId) {
      axios.get(
        `${process.env.API_URL}/departments/${this.departmentId}`,
        { headers: this.getCred() }
      ).then((res) => {
        this.department = res.data
        this.fetchDepartmentHelp()
      })
    }
    if (this.userId) {
      this.fetchUserHelp()
    }
  },
  methods: {
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserInfo', 'getCred']),
    unix2daystr (unix) {
      return moment.unix(unix).format('MM月DD日(締切)')
    },
    fetchDepartmentHelp () {
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
        this.loading = false
      })
    },
    fetchUserHelp () {
      axios.get(
        `${process.env.API_URL}/user_infos/${this.userId}`,
        { headers: this.getCred() }
      ).then((res) => {
        this.user_info = res.data
        this.departmentId = this.user_info.department_id
        this.loading = false
      })
      axios.get(
        `${process.env.API_URL}/search-user-problem?user_id=${this.userId}`,
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
        this.loading = false
      })
    }
  }
}
</script>
