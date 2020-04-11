<template>
  <v-layout>
    <div class="wrapper">
      <div class="d-flex flex-column jumbotron">
        <v-container>
          <v-flex class="center">
            <h2 class="copy-write">
              あなたの悩みに寄り添える人が
            </h2>
            <h2 class="copy-write">
              ここにはいます
            </h2>
            <div>
              <h3 class="what">
                助け合いのプラットフォームHELP!
              </h3>
              <v-btn :to="'/create'" class="button-in-jumbo" x-large color="secondary" rounded>
                悩みを相談する
              </v-btn>
            </div>
          </v-flex>
        </v-container>
      </div>
      <v-container v-if="isAuthenticated()" class="d-flex flex-column">
        <div v-if="mode == 'all' | mode == 'human'" class="human-area">
          <h2>人間関係の悩み</h2>
          <v-row
            v-if="isAuthenticated()"
            align="center"
            justify="center"
          >
            <v-col v-for="item in getHumanProblem().slice(0, lastIdx)" :key="item.id" class="col-6">
              <v-card :href="item.url" elevation="0">
                <div class="d-flex flex-no-wrap">
                  <v-avatar
                    class="ma-3"
                    size="125"
                    tile
                    boarder
                  >
                    <v-img :src="item.image_url" />
                  </v-avatar>
                  <div class="detail-card">
                    <div class="help-title">
                      {{ item.title }}
                    </div>
                    <div><v-icon>mdi-calendar</v-icon>{{ unix2daystr(item.deadline) }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickHumanButton" color="secondary" rounded>
              人間関係の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="secondary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
        <div v-if="mode == 'all' | mode == 'work'" class="work-area">
          <h2>仕事の悩み</h2>
          <v-row
            v-if="isAuthenticated() & (mode == 'all' | mode == 'work')"
            align="center"
            justify="center"
          >
            <v-col v-for="item in getWorkProblem().slice(0, lastIdx)" :key="item.id" class="col-6">
              <v-card :href="item.url" elevation="0">
                <div class="d-flex flex-no-wrap">
                  <v-avatar
                    class="ma-3"
                    size="125"
                    tile
                    boarder
                  >
                    <v-img :src="item.image_url" />
                  </v-avatar>
                  <div class="detail-card">
                    <div class="help-title">
                      {{ item.title }}
                    </div>
                    <div><v-icon>mdi-calendar</v-icon>{{ unix2daystr(item.deadline) }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickWorkButton" color="secondary" rounded>
              仕事の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="secondary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
        <div v-if="(mode == 'all' | mode == 'health')" class="health-area">
          <h2>健康の悩み</h2>
          <v-row
            v-if="isAuthenticated() & (mode == 'all' | mode == 'health')"
            align="center"
            justify="center"
          >
            <v-col v-for="item in getHelthProblem().slice(0, lastIdx)" :key="item.id" class="col-6">
              <v-card :href="item.url" elevation="0">
                <div class="d-flex flex-no-wrap">
                  <v-avatar
                    class="ma-3"
                    size="125"
                    tile
                    boarder
                  >
                    <v-img :src="item.image_url" />
                  </v-avatar>
                  <div class="detail-card">
                    <div class="help-title">
                      {{ item.title }}
                    </div>
                    <div><v-icon>mdi-calendar</v-icon> {{ unix2daystr(item.deadline) }} </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickHealthButton" color="secondary" rounded>
              健康の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="secondary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
        <div v-if="(mode == 'all' | mode == 'other')" class="other-area">
          <h2>その他の悩み</h2>
          <v-row
            v-if="isAuthenticated() & (mode == 'all' | mode == 'other')"
            align="center"
            justify="center"
          >
            <v-col v-for="item in getOtherProblem().slice(0, lastIdx)" :key="item.id" class="col-6">
              <v-card :href="item.url" elevation="0">
                <div class="d-flex flex-no-wrap">
                  <v-avatar
                    class="ma-3"
                    size="125"
                    tile
                    boarder
                  >
                    <v-img :src="item.image_url" />
                  </v-avatar>
                  <div class="detail-card">
                    <div class="help-title">
                      {{ item.title }}
                    </div>
                    <div><v-icon>mdi-calendar</v-icon> {{ unix2daystr(item.deadline) }} </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickOtherButton" color="secondary" rounded>
              その他の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="secondary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
      </v-container>
      <v-container v-else />
    </div>
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
    if (this.isAuthenticated()) {
      this.fetchProblem()
    }
  },
  methods: {
    ...mapActions(['fetchUser', 'fetchUserInfo', 'login', 'logout', 'fetchProblem']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred', 'getWorkProblem', 'getHelthProblem', 'getHumanProblem', 'getOtherProblem']),
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
    clickOtherButton () {
      this.mode = 'other'
      this.lastIdx = this.getOtherProblem().length
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
  min-width: 90%;
}
.human-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  min-width: 90%;
}
.health-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  min-width: 90%;
}
.other-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  min-width: 90%;
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
.wrapper {
  width: 100%;
}
.jumbotron {
  background-color: #E3BBCC;
  text-align: center;
  color: white;
}
.what {
  margin-top: 2rem;
}
.button-in-jumbo {
  text-transform: none;
  font-weight: 700;
  font-size: 1rem;

}
</style>
