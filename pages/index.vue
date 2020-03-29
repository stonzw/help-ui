<template>
  <v-layout>
    <v-container>
      <div class="work-area">
        <h2>仕事の悩み</h2>
        <v-row
          v-if="isAuthenticated()"
          align="center"
          justify="center"
        >
          <v-col v-for="item in workProblems" :key="item.id" class="col-12 col-md-6 col-lg-6 col-xl-6">
            <v-card :href="item.url" elevation="0">
              <img :src="item.image_url" width="100%">
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div class="human-area">
        <h2>人間関係の悩み</h2>
        <v-row
          v-if="isAuthenticated()"
          align="center"
          justify="center"
        >
          <v-col v-for="item in humanProblems" :key="item.id" class="col-12 col-md-6 col-lg-6 col-xl-6">
            <v-card :href="item.url" elevation="0">
              <img :src="item.image_url" width="100%">
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div class="health-area">
        <h2>健康の悩み</h2>
        <v-row
          v-if="isAuthenticated()"
          align="center"
          justify="center"
        >
          <v-col v-for="item in helthProblems" :key="item.id" class="col-12 col-md-6 col-lg-6 col-xl-6">
            <v-card :href="item.url" elevation="0">
              <img :src="item.image_url" width="100%">
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-layout>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  head () {
    return {
      title: 'トップページ'
    }
  },
  data () {
    return {
      workProblems: [],
      humanProblems: [],
      helthProblems: []
    }
  },
  computed () {
    this.fetchUser()
    this.fetchProblems()
  },
  mounted () {
    this.fetchUser()
    this.fetchProblems()
  },
  methods: {
    ...mapActions(['fetchUser', 'login', 'logout', 'login_redirect']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred']),
    fetchProblems () {
      const companyId = 1
      const workId = 2
      const humanId = 1
      const helthId = 3
      axios.get(
        `${process.env.API_URL}/search-problem?company_id=${companyId}&genre_id=${workId}`,
        { headers: this.getCred() }
      ).then((res) => {
        this.workProblems = res.data.map((p) => { return { 'id': p.id, 'image_url': p.image_url, 'url': '/help/' + p.id } })
      })
      axios.get(
        `${process.env.API_URL}/search-problem?company_id=${companyId}&genre_id=${humanId}`,
        { headers: this.getCred() }
      ).then((res) => {
        this.humanProblems = res.data.map((p) => { return { 'id': p.id, 'image_url': p.image_url, 'url': '/help/' + p.id } })
      })
      axios.get(
        `${process.env.API_URL}/search-problem?company_id=${companyId}&genre_id=${helthId}`,
        { headers: this.getCred() }
      ).then((res) => {
        this.helthProblems = res.data.map((p) => { return { 'id': p.id, 'image_url': p.image_url, 'url': '/help/' + p.id } })
      })
    }
  }
}
</script>
<style scoped>
/* CSSを書く */
.main-wrapper {
  margin: auto;
}
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
.work-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.work-area h2{
  padding: 3rem;
  position: relative;
  padding: 0.5em;
  background:#a5cbda;
  color: white;

}
.human-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.human-area h2{
  padding: 3rem;
  position: relative;
  padding: 0.5em;
  background: #d3a6ac;
  color: white;
}
.health-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.health-area h2{
  padding: 3rem;
  position: relative;
  padding: 0.5em;
  background: #a6d3c8;
  color: white;

}
</style>
