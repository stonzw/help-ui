<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <v-card>
        <v-alert v-if="message.level == 'error'" type="error">
          {{ message.message }}
        </v-alert>
        <v-card-title v-if="company">
          「{{ company.name }}」
          へ参加をリクエストする
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="email"
            label="メールアドレス"
            :rules="[rules.required]"
            outlined
          />
          <v-text-field
            v-model="password"
            type="password"
            :rules="[rules.required, rules.min]"
            outlined
            label="パスワード"
          />
          <v-text-field
            v-model="password2"
            type="password"
            :rules="[rules.required, rules.min]"
            outlined
            label="パスワード (確認)"
          />
          <v-text-field
            v-model="userName"
            :rules="[rules.required]"
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
      userId: null,
      message: { level: 'none', message: '' },
      profileDescription: '',
      loginUrl: 'http://www.help-knowledge.com/',
      departmentId: 1,
      selectedCompany: { 'name': '', 'id': -1 },
      password: '',
      password2: '',
      rules: {
        required: value => !!value || 'Required.',
        min: value => value.length >= 8 || '8 文字以上で入力ください'
      }
    }
  },
  computed: {
    ...mapState(['userInfo', 'cred', 'company'])
  },
  mounted () {
    this.fetchUser()
    this.fetchCompany({ companyId: this.$nuxt.$route.query.company_id })
  },
  methods: {
    ...mapActions(['fetchUser', 'creaetUser', 'setUserInfo', 'fetchCompany']),
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred']),
    sendInviteRequest () {
      const data = {
        department_id: this.departmentId,
        company_id: this.company.id,
        user_id: this.userId,
        name: this.userName,
        status: 'pending'
      }
      api.post('invite_requests', data)
        .then((res) => {
          console.log(res)
        })
    },
    clickRegisterButton () {
      if (this.password !== this.password2) {
        this.message.level = 'error'
        this.message.message = 'パスワードとパスワード (確認)が一致しません。'
        return
      }
      api.post('auth',
        {
          email: this.email,
          password: this.password,
          password_confirmation: this.password2
        }
      )
        .then((res) => {
          this.userId = res.data.data.id
          this.sendInviteRequest()
        })
        .catch((err) => {
          console.error(err)
          api.get(
            `get-email-user?email=${this.email}`,
            { headers: this.cred }
          ).then((res) => {
            this.userId = res.data.id
            this.sendInviteRequest()
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
