<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <v-card>
        <v-card-title>パスワードを変更</v-card-title>
        <v-card-text>
          <v-form id="create-help-form">
            <v-text-field v-model="password1" label="新しいパスワード" type="password" outlined />
            <v-text-field v-model="password2" label="新しいパスワード(確認)" type="password" outlined />
            <v-btn
              @click="clickPasswordButton"
              block
              dark
              color="primary"
            >
              変更する
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog
      v-model="completeDialog"
      max-width="694px"
    >
      <v-card class="pa-2">
        <v-card-title>
          パスワード変更が完了しました。
        </v-card-title>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import api from '~/plugins/api'
export default {
  head () {
    return {
      title: '設定画面'
    }
  },
  data () {
    return {
      password1: '',
      password2: '',
      completeDialog: false
    }
  },
  computed () {
    this.fetchUser()
  },
  mounted () {
    this.fetchUser()
  },
  methods: {
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred']),
    clickPasswordButton () {
      const data = {
        email: this.getUser().email,
        password: this.password1,
        password_confirmation: this.password2
      }
      api.put('/auth/password', data, { headers: this.getCred() })
        .then(() => {
          this.completeDialog = true
        })
    }
  }
}
</script>
