<template>
  <v-layout>
    <v-container>
      <v-row class="main-wrapper">
        <div class="main-content col-12">
          <span>{{ deadlineStr() }}締切</span>
          <div class="image-wrapper">
            <img :src="imageURL" />
          </div>
          <v-card v-for="item in contents" :key="`answer-${item.id}`" elevation="0">
            <v-card-title>
              <h2 class="content-title">{{ headlines[item.id - 1] }}</h2>
            </v-card-title>
            <p v-if="editableId != item.id" class="text-content">
              {{ item.content }}
              <v-btn v-if="owner === getUser().id" @click="clickEditButton(item.id, item.content)" text block color="primary">
                編集する
                <v-icon>
                  mdi-pencil
                </v-icon>
              </v-btn>
            </p>
            <v-card-text v-else>
              <v-textarea v-model="textEditInput" outlined />
              <v-btn @click="clickEditSaveButton(item)" color="primary" class="margin-bottom" block>
                保存
              </v-btn>
              <v-btn @click="editableId=-1" color="red" dark block>
                キャンセル
              </v-btn>
            </v-card-text>
          </v-card>
          <h2>回答</h2>
          <v-card v-for="comment in comments" :key="`comment-${comment.id}`" class="comment" elevation="0">
            <v-card-text>
              <p v-if="isExpired() | comment.user_id == getUser().id">{{ comment.content }}</p>
              <v-img v-else :src="comment.image_url"></v-img>
            </v-card-text>
            <v-btn
              v-if="owner === getUser().id && isExpired()"
              @click="clickSendButton(comment.user_id)"
              text
              color="green"
              block
            >
              メッセージを送る
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
          </v-card>
          <v-card elevation="0" v-if="!isExpired()">
            <v-card-text>
              <v-form>
                <v-textarea v-model="commentContent" label="コメント" outlined />
                <v-btn
                  @click="click"
                  block
                  rounded
                  dark
                  color="primary"
                >
                  回答する
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </div>
        <div class="col-12">
          <h2>関連するお悩み</h2>
          <v-row>
            <v-col v-for="item in relatedProblems" :key="`related-problem-${item.id}`" class="col-6 d-flex flex-no-wrap">
              <v-card :href="item.url">
                <v-img
                  :src="item.image_url"
                ></v-img>
                <v-card-title>
                  {{ item.title }}
                </v-card-title>
                <v-card-subtitle>
                  {{ unix2daystr(item.deadline) }}
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-row>
      <v-dialog
        v-if="isAuthenticated()"
        v-model="messageDialog"
        max-width="100%"
      >
        <v-card>
          <v-card-title>
            メッセージ
          </v-card-title>
          <v-card-text>
            <span class="alert">メッセージを送信するとあなたの氏名や部署名が受信者に共有されます。</span>
            <v-form>
              <v-textarea v-model="message" label="" counter="100" outlined />
              <v-btn
                @click="sendMessage"
                color="primary"
                block
              >
                送信
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import moment from 'moment'
export default {
  head () {
    return {
      title: this.title
    }
  },
  data () {
    return {
      commentContent: '',
      owner: null,
      imageURL: '',
      sender: null,
      title: '',
      textEditInput: '',
      receiver: null,
      headlines: {},
      contents: {},
      comments: [],
      relatedProblems: [],
      deadline: 0,
      editableId: -1,
      messageDialog: false,
      messages: [
        { label: 'ありがとうございました。', value: 'ありがとうございました。' },
        { label: '悩みが解消されました。', value: '悩みが解消されました。' },
        { label: '会って相談に乗って欲しいです。', value: '会って相談に乗って欲しいです。' },
        { label: '会って感謝の気持ちを伝えたいです。', value: '会って感謝の気持ちを伝えたいです。' }
      ],
      message: '',
      i: 0
    }
  },
  mounted () {
    this.fetchUser()
    const helpId = this.$nuxt.$route.params.id
    axios.get(`${process.env.API_URL}/problems/${helpId}`, { headers: this.getCred() })
      .then((res) => {
        const companyId = res.data.company_id
        const problemId = res.data.id
        const genreId = res.data.genre_id
        this.imageURL = res.data.image_url
        this.deadline = res.data.deadline
        this.owner = res.data.user_id
        const query = `?company_id=${companyId}&problem_id=${problemId}`
        const url = `${process.env.API_URL}/search-answer${query}`
        axios.get(url, { headers: this.getCred() }).then(
          (answers) => {
            this.contents = answers.data.map(
              (x) => {
                if (x.question_id === 1) {
                  this.title = x.content
                }
                return { 'id': x.question_id, 'content': x.content }
              }
            )
          }
        )
        axios.get(`${process.env.API_URL}/questions`).then(
          (questions) => {
            this.headlines = questions.data.map((x) => { return x.answer_headline })
          }
        )
        axios.get(`${process.env.API_URL}/comments?problem_id=${helpId}`).then(
          (comments) => {
            this.comments = comments.data.map((x) => {
              x.image_url = `https://storage.googleapis.com/help-api/help/static/preopen-comment${1 + this.i % 3}.jpg`
              this.i += 1
              return x
            })
          }
        )
        axios.get(
          `${process.env.API_URL}/search-problem?company_id=${companyId}&genre_id=${genreId}`,
          { headers: this.getCred() }
        ).then((res) => {
          this.relatedProblems = res.data.map(
            (p) => {
              return {
                id: p.id,
                image_url: p.image_url,
                url: '/help/' + p.id,
                title: p.title,
                deadline: p.deadline
              }
            }
          )
        })
      })
  },
  methods: {
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserInfo', 'getCred']),
    click () {
      const helpId = this.$nuxt.$route.params.id
      const data = {
        'user_id': this.getUser().id,
        'problem_id': helpId,
        'content': this.commentContent
      }
      axios.post(`${process.env.API_URL}/comments`, data, { headers: this.getCred() })
        .then((res) => {
          this.commentContent = ''
          const helpId = this.$nuxt.$route.params.id
          axios.get(`${process.env.API_URL}/comments?problem_id=${helpId}`).then(
            (comments) => {
              this.comments = comments.data.map((x) => {
                x.image_url = `https://storage.googleapis.com/help-api/help/static/preopen-comment${1 + this.i % 3}.jpg`
                this.i += 1
                return x
              })
            }
          )
        })
    },
    isExpired () {
      return this.deadline < Date.now() / 1000
    },
    getShortTitle (title) {
      const MAXLEN = 9
      if (title.length < MAXLEN) { return title } else { return title.substr(0, MAXLEN - 1) + '...' }
    },
    clickSendButton (userId) {
      this.sender = this.getUser().id
      this.receiver = userId
      this.messageDialog = true
    },
    clickEditButton (editId, comment) {
      this.editableId = editId
      this.textEditInput = comment
    },
    clickEditSaveButton (answer) {
      const body = {
        content: this.textEditInput
      }
      const headers = this.getCred()
      axios.put(`${process.env.API_URL}/answers/${answer.id}`, body, { headers })
        .then((res) => {
          this.editableId = -1
          answer.content = this.textEditInput
        })
    },
    unix2daystr (unix) {
      return moment.unix(unix).format('MM月DD日(締切)')
    },
    deadlineStr () {
      return moment.unix(this.deadline).format('YYYY年MM月DD日 HH時mm分')
    },
    sendMessage () {
      const data = {
        sender_id: this.sender,
        receiver_id: this.receiver,
        content: this.message,
        checked: false,
        company_id: 1,
        department_id: 1,
        sender_name: this.getUserInfo().name,
        sender_email: this.getUser().email
      }
      if (this.owner === this.getUser().id) {
        axios.post(
          `${process.env.API_URL}/talks`,
          data,
          { headers: this.getCred() }
        ).then((res) => {
          this.messageDialog = false
        })
      }
    }
  }
}
</script>
<style scoped>
.main-wrapper {
  max-width: 764px;
  margin: auto;
}
.main-content {
  background-color: white;
}
.side-content {
  background-color: white;
}
.comment {
  margin-bottom: 1rem;
}
.comment p {
  color: #383838;
}
.alert {
  color: #ff0000;
}
.margin-bottom {
  margin-bottom: 1rem;
}
.content-title {
  font-weight: 700;
  font-size: 24px;
}
.image-wrapper {
  max-width: 600px;
  margin:auto;
}
</style>
