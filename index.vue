<template>
  <v-layout>
    <v-container>
      <v-row
        class="fill-height"
        align="center"
        justify="center"
      >
        <div class="display-3">
          Twitterで助けを求めよう！
        </div>
      </v-row>
      <v-row
        class="fill-height"
        align="center"
        justify="center"
      >
        <v-btn
          v-if="isAuthenticated()"
          to="/create"
          color="red"
          dark
          x-large
        >
          HELP!
          <v-icon>mdi-human-handsup</v-icon>
        </v-btn>
        <v-btn
          v-else
          @click="login"
          color="#55acee"
          dark
          x-large
        >
          Twitterでログイン
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
        <v-btn
          v-if="isAuthenticated()"
          @click="logout"
          color="red"
          dark
          x-large
        >
          ログアウト
          <v-icon>mdi-human-handsup</v-icon>
        </v-btn>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  mounted () {
    this.fetchUser()
  },
  methods: {
    ...mapActions(['fetchUser', 'login', 'logout']),
    ...mapGetters(['isAuthenticated'])
  }
}
</script>
<style scoped>
/* CSSを書く */
</style>
