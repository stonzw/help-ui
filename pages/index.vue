<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <div class="human-area" v-if="mode == 'all' | mode == 'human'">
        <h2>人間関係の悩み</h2>
        <v-row
          v-if="isAuthenticated()"
          align="center"
          justify="center"
        >
          <v-col v-for="item in getHumanProblem().slice(0, lastIdx)" :key="item.id" class="col-6">
            <v-card :href="item.url" elevation="0" >
              <div class="d-flex flex-no-wrap" >
                <v-avatar
                  class="ma-3"
                  size="125"
                  tile
                  boarder
                >
                  <v-img :src="item.image_url"></v-img>
                </v-avatar>
                <div class="detail-card">
                  <div class="help-title">{{ item.title }}</div>
                  <div><v-icon>mdi-calendar</v-icon>{{ unix2daystr(item.deadline) }}</div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col align="center" justify="center">
            <v-btn v-if="mode == 'all'" color="primary" rounded @click="clickHumanButton">人間関係の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon></v-btn>
            <v-btn v-else color="primary" rounded @click="clickResetButton"><v-icon>mdi-chevron-left</v-icon>戻る</v-btn>
          </v-col>
        </v-row>
      </div>
      <div class="work-area" v-if="mode == 'all' | mode == 'work'">
        <h2>仕事の悩み</h2>
        <v-row
          v-if="isAuthenticated() & (mode == 'all' | mode == 'work')"
          align="center"
          justify="center"
        >
          <v-col v-for="item in getWorkProblem().slice(0, lastIdx)" :key="item.id" class="col-6">
            <v-card :href="item.url" elevation="0">
              <div class="d-flex flex-no-wrap" >
                <v-avatar
                  class="ma-3"
                  size="125"
                  tile
                  boarder
                >
                  <v-img :src="item.image_url"></v-img>
                </v-avatar>
                <div class="detail-card">
                  <div class="help-title">{{ item.title }}</div>
                  <div><v-icon>mdi-calendar</v-icon>{{ unix2daystr(item.deadline) }}</div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col align="center" justify="center">
            <v-btn v-if="mode == 'all'" color="primary" rounded @click="clickWorkButton">仕事の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon></v-btn>
            <v-btn v-else color="primary" rounded @click="clickResetButton"><v-icon>mdi-chevron-left</v-icon>戻る</v-btn>
          </v-col>
        </v-row>
      </div>
      <div class="health-area" v-if="(mode == 'all' | mode == 'health')">
        <h2>健康の悩み</h2>
        <v-row
          v-if="isAuthenticated() & (mode == 'all' | mode == 'health')"
          align="center"
          justify="center"
        >
          <v-col v-for="item in getHelthProblem().slice(0, lastIdx)" :key="item.id" class="col-6">
            <v-card :href="item.url" elevation="0">
              <div class="d-flex flex-no-wrap" >
                <v-avatar
                  class="ma-3"
                  size="125"
                  tile
                  boarder
                >
                  <v-img :src="item.image_url"></v-img>
                </v-avatar>
                <div class="detail-card">
                  <div class="help-title">{{ item.title }}</div>
                  <div><v-icon>mdi-calendar</v-icon> {{ unix2daystr(item.deadline) }} </div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col align="center" justify="center">
            <v-btn v-if="mode == 'all'" color="primary" rounded @click="clickHealthButton">健康の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon></v-btn>
            <v-btn v-else color="primary" rounded @click="clickResetButton"><v-icon>mdi-chevron-left</v-icon>戻る</v-btn>
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
import moment from 'moment'

export default {
  head () {
    return {
      title: 'トップページ'
    }
  },
  data () {
    return {
      mode: 'all',
      lastIdx: 4
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
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred', 'getWorkProblem', 'getHelthProblem', 'getHumanProblem']),
    unix2daystr (unix) {
      return moment.unix(unix).format('YYYY年MM月DD日 締切')
    },
    clickHumanButton () {
      this.mode = 'human'
      this.lastIdx = this.getHumanProblem().length
    },
    clickWorkButton () {
      this.mode = 'work'
      this.lastIdx = this.getWorkProblem().length
    },
    clickHealthButton () {
      this.mode = 'health'
      this.lastIdx = this.getHelthProblem().length
    },
    clickResetButton () {
      this.mode = 'all'
      this.lastIdx = 4
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
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
}
.human-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
}
.health-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
}
.detail-card {
  height: 125px;
}
.help-title {
  height: 90px;
  overflow: hidden;
  vertical-align: top;
  font-weight: 600;
  padding-top: 10px;
}
</style>
