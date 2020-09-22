<template>
  <v-layout>
    <div class="wrapper">
      <v-card id="jumbotron" class="d-flex flex-column jumbotron" color="secondary" elevation="0" rounded="false">
        <v-container v-if="userInfo">
          <v-flex class="center" v-if="userInfo.company">
            <h2 class="copy-write">
              {{ userInfo.company.message }}
            </h2>
            <h3>
              {{ userInfo.company.detail }}
            </h3>
          </v-flex>
        </v-container>
      </v-card>
      <v-container v-if="isAuthenticated()" class="d-flex flex-column">
        <div id="human-area" v-if="mode == 'all' | mode == 'human'">
          <h2>人間関係の悩み</h2>
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
                    <div><v-icon>mdi-calendar</v-icon>{{ unix2daystr(item.deadline) }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickHumanButton" color="primary" rounded>
              人間関係の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
        <div id="work-area" v-if="mode == 'all' | mode == 'work'">
          <h2>仕事の悩み</h2>
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
                    <div><v-icon>mdi-calendar</v-icon>{{ unix2daystr(item.deadline) }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickWorkButton" color="primary" rounded>
              仕事の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
        <div id="health-area" v-if="(mode == 'all' | mode == 'health')">
          <h2>健康の悩み</h2>
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
                    <div><v-icon>mdi-calendar</v-icon> {{ unix2daystr(item.deadline) }} </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickHealthButton" color="primary" rounded>
              健康の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
        <div id="other-area" v-if="(mode == 'all' | mode == 'other')">
          <h2>その他の悩み</h2>
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
                    <div><v-icon>mdi-calendar</v-icon> {{ unix2daystr(item.deadline) }} </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-btn v-if="mode == 'all'" @click="clickOtherButton" color="primary" rounded>
              その他の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
              <v-icon>mdi-chevron-left</v-icon>戻る
            </v-btn>
          </v-row>
        </div>
      </v-container>
      <v-container v-else />
      <v-dialog
        v-model="postHelpDialog"
        max-width="694px"
      >
        <v-card class="introduction">
          <h2>悩みを投稿してみよう！3つのステップで流れを紹介！</h2>
          <h3>あなたの悩みはどのカテゴリー？カテゴリーを探してみよう！</h3>
          <div class="intro-content">
            <p>
              あなたの悩みがどのカテゴリーに当てはまるかを確認しましょう！
            </p>
            <p>
              <ul>
                <li>人間関係？</li>
                <li>仕事の悩み？</li>
                <li>健康の悩み？</li>
              </ul>
            </p>
            <p>
              どれにも当てはまらない場合は「その他」でもOKです!
            </p>
          </div>
          <h3>カテゴリーからあなたの悩みに近いものを探してみましょう！</h3>
          <div class="intro-content">
            <p>
              表現方法、書き方などを参考にするために、あなたの悩みと同じカテゴリページから<br>
              あなたの悩みに近いものを探してみましょう！
            </p>
            <p>
              悩んでいるときは言語化もしにくいもの、<br>
              そんな時は遠慮なく色々な方の悩みを参考にして、気持ちをすっきりさせましょう!
            </p>
          </div>
          <h3>悩みを投稿しよう！</h3>
          <div class="intro-content-noline">
            <p>
              悩みの言語化・具体化ができたら、ぜひ悩みをしてください!
            </p>
            <p>
              「もし批判的なコメントがきたら怖い…」<br>
            </p>
            <p>
              安心してください!<br>
              批判的なコメントは公開されるまでに運営の方で削除します。
            </p>
            <p>
              あなたが安心して悩みを相談できる<br>
              サービスを私たちは目指しています。
            </p>
          </div>
          <div class="intro-last-content">
            あなたの悩みを公開し、残しておくことは、<br>
            今後、同じ悩みを持った仲間の役にたちます！
          </div>
          <v-btn
            id="modal-help-button"
            v-if="isAuthenticated()"
            @click="redirect()"
            class="top-help-btn"
            to="/create"
            color="primary"
            dark
            rounded
            block
          >
            悩みを相談
          </v-btn>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="answerHelpDialog"
        max-width="694px"
      >
        <v-card
          class="introduction"
        >
          <h2>あなたの経験は経験したことない人からすれば大きな価値があります。<br>経験を共有してみましょう！</h2>
          <h3>トップページから気になる悩みをクリック</h3>
          <div class="intro-content">
            <p>
              悩みは「仕事」、「人間関係」、「健康」、「その他」のカテゴリーに分けられています。<br>
              気になるカテゴリーでお悩みを探してみましょう。
            </p>
          </div>
          <h3>回答フォームからアドバイスを入力</h3>
          <div class="intro-content">
            <p>
              悩みの詳細を確認したらページ下部にある回答フォームから<br>
              あなたの経験、知恵を元にアドバイスを入力。
            </p>
          </div>
          <h3>回答を投稿する</h3>
          <div class="intro-content-noline">
            <p>「回答を投稿する」をクリックすると回答が投稿されます。</p>
            <p>
              回答期限までは他の人のコメントをみることができません。<br>
              回答期限を過ぎるとコメントが公開されます。
            </p>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </v-layout>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
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
      lastIdx: 4,
      answerHelpDialog: false,
      postHelpDialog: false
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
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred', 'getWorkProblem', 'getHealthProblem', 'getHumanProblem', 'getOtherProblem']),
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
