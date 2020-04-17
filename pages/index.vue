<template>
  <v-layout>
    <div class="wrapper">
      <div class="d-flex flex-column jumbotron">
        <v-container>
          <v-flex class="center">
            <h2 class="copy-write">
              誰かを助けたり誰かに助けられたり
            </h2>
            <div>
              <h3 class="what">
                助け合いのプラットフォームHELP!
              </h3>
              <v-btn @click="postHelpDialog = !postHelpDialog" class="button-in-jumbo" x-large color="primary" rounded>
                悩みがある人へ
              </v-btn>
              <v-btn @click="answerHelpDialog = !answerHelpDialog" class="button-in-jumbo" x-large color="primary" rounded>
                人を助けたい人へ
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
            <v-btn v-if="mode == 'all'" @click="clickHumanButton" color="primary" rounded>
              人間関係の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
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
            <v-btn v-if="mode == 'all'" @click="clickWorkButton" color="primary" rounded>
              仕事の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
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
            <v-btn v-if="mode == 'all'" @click="clickHealthButton" color="primary" rounded>
              健康の悩みをもっとみる<v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else @click="clickResetButton" color="primary" rounded>
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
      >
        <v-card>
          <v-card-title>
            悩みを文章にするには？
          </v-card-title>
          <v-card-text>
            悩みはあるけどそれを文章にするのは難しかったりします。<br>
            ここでは悩みを文章にしてみてHelp!に投稿するまでの流れを紹介します。
          </v-card-text>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                1.悩みをカテゴリーに当てはめる
              </v-list-item-title>
              <v-list-item-subtitle>
                あなたの「悩み」は「人間関係？」「仕事の悩み？」「健康の悩み？」どれかに当てはめてみましょう。<br>
                あなたの悩みはどのカテゴリーに当てはまりますか？<br>
                どれにも当てはまらない場合は「その他」でも良いです。
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                2. あなたの悩みに近い悩みを探してみます。
              </v-list-item-title>
              <v-list-item-subtitle>
                あなたの悩みのカテゴリーが決まったら似たような悩みをHelp!で探してみましょう。<br>
                まずは当てはめたカテゴリーの悩みをみてみましょう。
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                3. 「悩みを相談」を言語化する
              </v-list-item-title>
              <v-list-item-subtitle>
                似ている悩みがあればそれを参考にあなたの悩みを言語化してみましょう。<br>
                似ている悩みがなくても相談の大枠は同じなので読みやすい悩みを参考に言語化します。
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                4. 悩みを投稿する
              </v-list-item-title>
              <v-list-item-subtitle>
                最後に悩みを投稿します。<br>
                トップページの「悩みを相談」をクリックして項目を入力します。<br>
                もし批判的なコメントがきたら怖い。<br>
                安心してください批判的なコメントは公開されるまでに運営の方で削除します。<br>
                あなたが安心して悩みを相談できるサービスを私たちは目指しています。
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            あなたの悩みを公開し、残しておくことは、今後、同じ悩みを持った仲間の役にたちます！
          </v-list-item>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="answerHelpDialog"
      >
        <v-card>
          <v-card-title>
            あなたの経験は誰かの大きな助けになります!
          </v-card-title>
          <v-card-text>
            あなたの経験は経験したことない人からすれば大きな価値があります。
          </v-card-text>
          <v-list-item>
            <v-list-item-content>
              1. トップページから気になる悩みをクリック
              <v-list-item-subtitle>
                ※悩みは「仕事」、「人間関係」、「健康」、「その他」のカテゴリーに分けられています。気になるカテゴリーでお悩みを探してみましょう。
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              2. 悩みの詳細を確認したらフォームにあなたの経験、知恵を元にアドバイスを入力
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              3. 回答するをクリックすると回答が投稿されます
              <v-list-item-subtitle>
                ※回答期限までは他の人のコメントをみることができません。回答期限を過ぎるとコメントが公開されます。
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-dialog>
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
  methods: {
    ...mapActions(['fetchUser', 'login', 'logout', 'fetchProblem']),
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
