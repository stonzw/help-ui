<template>
  <v-layout>
    <div class="wrapper">
      <v-card id="jumbotron" class="d-flex flex-column jumbotron" color="secondary" elevation="0" rounded="false">
        <v-container>
          <v-flex class="center">
            <h2 class="copy-write">
              {{ getCompanyMessage() }}
            </h2>
            <h3>
              {{ getCompanyDetail() }}
            </h3>
          </v-flex>
        </v-container>
      </v-card>
      <v-container v-if="isAuthenticated()" class="d-flex flex-column">
        <div id="human-area" v-if="mode == 'all' | mode == 'human'">
          <h2>{{ genreid2name[1] }}</h2>
          <v-row
            v-if="isAuthenticated()"
            align="center"
            justify="center"
          >
            <v-col v-for="item in getHumanProblem().slice(0, lastIdx)" :key="item.id" class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
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
                    <div><v-icon>mdi-calendar</v-icon>{{ iso2daystr(item.created_at) }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickHumanButton" color="primary" rounded>
              {{ genreid2name[1] }}をもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
        <div id="work-area" v-if="mode == 'all' | mode == 'work'">
          <h2>{{ genreid2name[2] }}</h2>
          <v-row
            v-if="isAuthenticated() & (mode == 'all' | mode == 'work')"
            align="center"
            justify="center"
          >
            <v-col v-for="item in getWorkProblem().slice(0, lastIdx)" :key="item.id" class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
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
                    <div><v-icon>mdi-calendar</v-icon>{{ iso2daystr(item.deadline) }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickWorkButton" color="primary" rounded>
              {{ genreid2name[2] }}をもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
        <div id="health-area" v-if="(mode == 'all' | mode == 'health')">
          <h2>{{ genreid2name[3] }}</h2>
          <v-row
            v-if="isAuthenticated() & (mode == 'all' | mode == 'health')"
            align="center"
            justify="center"
          >
            <v-col v-for="item in getHealthProblem().slice(0, lastIdx)" :key="item.id" class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
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
                    <div><v-icon>mdi-calendar</v-icon> {{ iso2daystr(item.deadline) }} </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickHealthButton" color="primary" rounded>
              {{ genreid2name[3] }}をもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
        <div id="other-area" v-if="(mode == 'all' | mode == 'other')">
          <h2>{{ genreid2name[4] }}</h2>
          <v-row
            v-if="isAuthenticated() & (mode == 'all' | mode == 'other')"
            align="center"
            justify="center"
          >
            <v-col v-for="item in getOtherProblem().slice(0, lastIdx)" :key="item.id" class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
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
                    <div><v-icon>mdi-calendar</v-icon> {{ iso2daystr(item.deadline) }} </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickOtherButton" color="primary" rounded>
              {{ genreid2name[4] }}をもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
      </v-container>
    </div>
  </v-layout>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import genreid2name from '~/assets/genreid2name'

export default {
  head () {
    return {
      title: 'トップページ - ' + this.getCompanyName()
    }
  },
  data () {
    return {
      mode: 'all',
      lastIdx: 4,
      answerHelpDialog: false,
      postHelpDialog: false,
      genreid2name
    }
  },
  mounted () {
    this.fetchUser()
    if (this.isAuthenticated()) {
      this.fetchProblem()
    }
  },
  computed: mapState(['title', 'userInfo']),
  methods: {
    ...mapActions(['fetchUser', 'login', 'logout', 'fetchProblem']),
    ...mapGetters([
      'isAuthenticated',
      'getUser',
      'getCred',
      'getWorkProblem',
      'getHealthProblem',
      'getHumanProblem',
      'getOtherProblem',
      'getCompanyName',
      'getCompanyMessage',
      'getCompanyDetail'
    ]),
    iso2daystr (iso) {
      return moment(iso).format('YYYY年MM月DD日 投稿')
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
      this.lastIdx = this.getHealthProblem().length
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
#work-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  min-width: 90%;
}
#human-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  min-width: 90%;
}
#health-area {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  min-width: 90%;
}
#other-area {
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
.modal-wrapper {
  max-width: 694px;
  margin: auto;
}
.introduction {
  padding: 2rem;
  counter-reset: count;
}
.introduction h2 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.introduction h3 {
  color: #E38687;
}
.introduction h3::before {
  counter-increment: count;
  color: #E38687;
  content: 'Step' counter(count) '. ';
}
.intro-content {
  padding: 1rem;
  line-height: 1.8rem;
  border-left: solid 10px #fff2f7;
}
.intro-content-noline {
  padding: 1rem;
  line-height: 1.8rem;
  border-left: none 10px #fff2f7;
}
.introduction p {
  color: #383838;
}
.intro-last-content {
  font-size: 1.4rem;
  font-weight: 700;
  margin-left: 2rem;
}
</style>
