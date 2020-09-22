<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <v-card>
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
            block
            @click="clickRegisterButton"
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
      loginUrl: 'http://www.help-knowledge.com/'
    }
  },
  computed: {
    ...mapState(['userInfo', 'cred'])
  },
  mounted () {
    this.fetchUser()
    this.userPassword = Math.random().toString(36).slice(-8)
  },
  methods: {
    ...mapActions(['fetchUser', 'creaetUser', 'setUserInfo']),
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred']),
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
