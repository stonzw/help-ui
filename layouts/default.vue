<template>
  <v-app>
    <v-app-bar
      id="header"
      app
    >
      <v-toolbar-title class="col-10">
        <a id='logo-link' href="/"><span id="logo">HELP!</span></a>
      </v-toolbar-title>
      <v-toolbar-title class="col-2">
        <v-btn
          v-if="isAuthenticated()"
          @click="logout"
          color="red"
          dark
          x-large
          rounded
        >
          ログアウト
        </v-btn>
        <v-btn
          v-else
          @click.stop="dialog = true"
          color="primary"
          dark
        >
          ログイン
        </v-btn>
      </v-toolbar-title>
    </v-app-bar>
    <v-content id="container">
      <nuxt />
      <v-dialog
        v-if="!isAuthenticated()"
        v-model="dialog"
        max-width="100%"
      >
        <v-card>
          <v-card-title>
            ログイン
          </v-card-title>
          <v-card-text>
          <v-form id="login-form">
            <v-text-field v-model="email" label="メールアドレス" outlined rounded />
            <v-text-field v-model="password" label="パスワード" outlined rounded />
            <v-btn
              @click="clickLoginButton"
              class="top-help-btn"
              color="red"
              dark
              x-large
              rounded
            >
              ログイン
            </v-btn>
          </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      email: '',
      password: '',
      dialog: false
    }
  },
  methods: {
    ...mapActions(['fetchUser', 'login', 'logout', 'login_redirect']),
    ...mapGetters(['isAuthenticated']),
    clickLoginButton () {
      this.login({ email: this.email, password: this.password })
    }
  }
}
</script>
<style>
#header {
  box-shadow: 0px 0px 0 #ffffff,
    0px 0px 0 #ffffff,
    0px 0px 0 #ffffff,
    0px 0px 0 #ffffff;
}
#logo-link {
  text-decoration: none;
}
#logo {
  color: white;
  font-size: 3rem;
  font-family: serif;
  text-shadow: 1px 1px 0 #ff0000,
    -1px -1px 0 #ff0000,
    1px 1px 0 #ff0000,
    -1px -1px 0 #ff0000;
}
#container {
  width: 568px;
  margin-right: auto;
  margin-left: auto;
}
.v-btn {
  text-transform: none;
  font-weight: 700;
  box-shadow: 0px 0px 0 #ffffff,
    0px 0px 0 #ffffff,
    0px 0px 0 #ffffff,
    0px 0px 0 #ffffff;
}
</style>
