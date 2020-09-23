<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <v-card>
        <v-card-title>サロン情報を変更</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="name"
            label="サロン名"
            outlined
          />
          <v-text-field
            v-model="message"
            label="サロンのスローガン"
            outlined
          />
          <v-text-field
            v-model="detail"
            label="サロンの紹介文"
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
      message: '',
      name: ''
    }
  },
  computed: {
    ...mapState(['userInfo', 'cred'])
  },
  mounted () {
    this.fetchUser().then((x) => {
      this.name = this.userInfo.company.name
      this.message = this.userInfo.company.message
      this.detail = this.userInfo.company.detail
    })
  },
  methods: {
    ...mapActions(['fetchUser', 'creaetUser', 'setUserInfo']),
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred']),
    clickRegisterButton () {
      const data = {
        name: this.name,
        message: this.message,
        detail: this.detail
      }
      api.put(`companies/${this.userInfo.company.id}`, data, { headers: this.cred })
        .then((res) => {
          console.log(res)
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
