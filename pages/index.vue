<template>
  <v-layout>
    <v-container>
      <v-row
        class="fill-height"
        align="center"
        justify="center"
      >
        <v-btn
          @click="redirect()"
          class="top-help-btn"
          to="/create"
          color="red"
          dark
          x-large
          rounded
        >
          HELP!
          <v-icon>mdi-human-handsup</v-icon>
        </v-btn>

        <v-row
          v-if="isAuthenticated()"
          align="center"
          justify="center"
        >
          <v-card v-for="item in problems" :key="item.id" :href="item.url" width="80%">
            <img :src="item.image_url" width="100%">
          </v-card>
          {{ fetchProblems() }}
        </v-row>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  data () {
    return {
      problems: []
    }
  },
  mounted () {
    this.fetchUser()
    /// this.fetchProblems()
  },
  methods: {
    ...mapActions(['fetchUser', 'login', 'logout', 'login_redirect']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred']),
    redirect () {
      if (this.isAuthenticated()) {
        this.$nuxt.$router.push({ path: '/create' })
      }
    },
    fetchProblems () {
      const companyId = 1
      axios.get(
        `${process.env.API_URL}/search-problem?company_id=${companyId}`,
        { headers: this.getCred() }
      ).then((res) => {
        this.problems = res.data.map((p) => { return { 'id': p.id, 'image_url': p.image_url, 'url': '/help/' + p.id } })
        console.log(this.problems)
      })
    }
    // create_user () {
    //   const data = {
    //     email: 'example11a221@example.com',
    //     password: 'password',
    //     password_confirmation: 'password'
    //   }
    //   axios.post('http://localhost:3000/auth', data)
    //     .then(
    //       (res) => {
    //         const data = {
    //           'company_id': 1,
    //           'department_id': 1,
    //           'user_id': res.data.data.id,
    //           'role': 'admin'
    //         }
    //         const headers = this.getUser()
    //         axios.post('http://localhost:3000/user_infos', data, { headers })
    //           .then(res => console.log(res.data))
    //       }
    //     )
    //     .catch(res => console.log(res.data))
    // }
  }
}
</script>
<style scoped>
/* CSSを書く */
.copy-write {
  font-size: 2rem;
  font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS P Gothic", Verdana, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
}
.v-btn {
  min-width: 0px;
  padding-left: 3rem;
  margin-top: 2rem;
}
.help-list {
  margin-top: 1rem;
}
</style>
