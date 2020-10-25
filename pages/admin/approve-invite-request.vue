<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <v-card>
        <v-card-text v-for="req in inviteRequests" :key="req.id">
          {{ req.name }}
          <v-btn v-if="req.status==='pending'" @click="clickApproveButton(req)">
            承認する
          </v-btn>
        </v-card-text>
        <v-card-title>登録メールを送信</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="email"
            label="メールアドレス"
            outlined
          />
          <v-text-field
            v-model="userName"
            label="氏名"
            outlined
          />
          <v-btn
            @click="clickRegisterButton"
            block
            color="primary"
          >
            送信する
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import api from '~/plugins/api'
export default {
  data () {
    return {
      email: '',
      userName: '',
      userPassword: '',
      userId: null,
      profileDescription: '',
      loginUrl: 'http://www.help-knowledge.com/',
      inviteRequests: []
    }
  },
  computed: {
    ...mapState(['userInfo', 'cred'])
  },
  mounted () {
    this
      .fetchUser()
      .then((x) => {
        this.fetchInviteRequests()
      })
  },
  methods: {
    ...mapActions(['fetchUser', 'creaetUser', 'setUserInfo']),
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred']),
    clickApproveButton (req) {
      req.status = 'approved'
      api
        .put(`invite_requests/${req.id}`, req, { headers: this.cred })
        .then((x) => {
          console.log(x)
        })
      const data = {
        department_id: req.department_id,
        company_id: req.company_id,
        user_id: req.userId,
        role: 'normal',
        name: req.name
      }
      api.post('user_infos', data, { headers: this.cred })
        .then((res) => {
          api.post(
            'send-email',
            {
              community: req.company.name,
              login_url: this.loginUrl,
              email: req.email,
              name: req.userName,
              password: 'ご登録いただいたパスワード'
            },
            { headers: this.cred }
          )
        })
    },
    sendEmail () {
      const data = {
        department_id: this.userInfo.department_id,
        company_id: this.userInfo.company_id,
        user_id: this.userId,
        role: 'normal',
        name: this.userName
      }
      api.post('user_infos', data, { headers: this.cred })
        .then((res) => {
          api.post(
            'send-email',
            {
              community: this.userInfo.company.name,
              login_url: this.loginUrl,
              email: this.email,
              name: this.userName,
              password: this.userPassword
            },
            { headers: this.cred }
          )
        })
    },
    fetchInviteRequests () {
      api
        .get(
          `invite_requests?company_id=${this.userInfo.company_id}`,
          { headers: this.cred }
        )
        .then((x) => {
          this.inviteRequests = x.data
        })
    },
    clickCancelButton (req) {
      req.status = 'pending'
      api
        .put(`invite_requests/${req.id}`, req, { headers: this.cred })
        .then((x) => {
          console.log(x)
        })
    },
    clickRegisterButton () {
      api.post('auth',
        {
          email: this.email,
          password: this.userPassword,
          password_confirmation: this.userPassword
        }
      )
        .then((res) => {
          this.userId = res.data.data.id
          this.sendEmail()
        })
        .catch((err) => {
          console.error(err)
          api.get(
            `get-email-user?email=${this.email}`,
            { headers: this.cred }
          ).then((res) => {
            this.userId = res.data.id
            this.sendEmail()
          })
        })
    }
  }
}
</script>
<style scoped>
.comment-genre {
  max-width: 400px;
  margin: auto;
}
</style>
