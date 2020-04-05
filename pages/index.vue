<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <div class="human-area">
        <h2>人間関係の悩み</h2>
        <v-row
          v-if="isAuthenticated()"
          align="center"
          justify="center"
        >
          <v-col v-for="item in getHumanProblem()" :key="item.id" class="col-12 col-md-6 col-lg-6 col-xl-6">
            <v-card :href="item.url" elevation="0">
              <img :src="item.image_url" width="100%">
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div class="work-area">
        <h2>仕事の悩み</h2>
        <v-row
          v-if="isAuthenticated()"
          align="center"
          justify="center"
        >
          <v-col v-for="item in getWorkProblem()" :key="item.id" class="col-12 col-md-6 col-lg-6 col-xl-6">
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
          <v-col v-for="item in getHelthProblem()" :key="item.id" class="col-12 col-md-6 col-lg-6 col-xl-6">
            <v-card :href="item.url" elevation="0">
              <img :src="item.image_url" width="100%">
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <v-container v-else>
    </v-container>
  </v-layout>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  head () {
    return {
      title: 'トップページ'
    }
  },
  mounted () {
    this.fetchUser()
    this.fetchUserInfo()
    if (this.isAuthenticated()) {
      this.fetchProblem()
    }
  },
  methods: {
    ...mapActions(['fetchUser', 'fetchUserInfo', 'login', 'logout', 'fetchProblem']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred', 'getWorkProblem', 'getHelthProblem', 'getHumanProblem'])
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
