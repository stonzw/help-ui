<template>
  <v-layout>
    <v-container>
      <v-row class="main-wrapper">
        <div class="main-content col-8 col-xs-12">
          <span>{{ deadlineStr() }}締切</span>
          <img :src="imageURL">
          <v-card v-for="item in contents" :key="item.id">
            <v-card-title>
              {{ headlines[item.id - 1] }}
            </v-card-title>
            <p class="text-content" v-if="editableId != item.id">
              {{ item.content }}
              <v-btn text block color="green" @click="clickEditButton(item.id, item.content)">
                編集する
                <v-icon>
                  mdi-pencil
                </v-icon>
              </v-btn>
            </p>
            <v-card-text v-else>
              <v-textarea v-model="textEditInput" outlined></v-textarea>
              <v-btn color="primary" class="margin-bottom" block @click="clickEditSaveButton(item)">保存</v-btn>
              <v-btn color="red" dark block @click="editableId=-1">キャンセル</v-btn>
            </v-card-text>
          </v-card>
          <h2>コメント</h2>
          <v-card v-for="comment in comments" :key="'comment-' + comment.id" class="comment">
            <v-card-text>
              <p>{{ comment.content }}</p>
            </v-card-text>
            <v-btn
              v-if="owner === getUser().id"
              @click="clickSendButton(comment.user_id)"
              text
              color="green"
              block
            >
              メッセージを贈る
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
          </v-card>
          <v-card>
            <v-card-text>
              <v-form>
                <v-textarea v-model="commentContent" label="コメント" outlined />
                <v-btn
                  @click="click"
                  block
                  rounded
                  dark
                  color="red"
                >
                  コメントする
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </div>
        <div class="side-content col-3 col-xs-12">
          <h2>関連するお悩み</h2>
          <v-card :href="item.url" v-for="item in relatedProblems" :key="item.id" elevation="0">
            <img :src="item.image_url" width="100%">
          </v-card>
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
              <v-select
                v-model="selectedMessage"
                :items="messages"
                item-text="label"
                item-value="value"
                label="本文"
              />
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
      selectedMessage: { label: '', value: null }
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
            this.comments = comments.data.map((x) => { return x })
          }
        )
        axios.get(
          `${process.env.API_URL}/search-problem?company_id=${companyId}&genre_id=${genreId}`,
          { headers: this.getCred() }
        ).then((res) => {
          this.relatedProblems = res.data.map((p) => { return { 'id': p.id, 'image_url': p.image_url, 'url': '/help/' + p.id } })
        })
      })
  },
  methods: {
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred']),
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
              this.comments = comments.data.map((x) => { return x })
            }
          )
        })
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
    deadlineStr () {
      return moment.unix(this.deadline).format('YYYY年MM月DD日 HH時mm分')
    },
    sendMessage () {
      const data = {
        sender_id: this.sender,
        receiver_id: this.receiver,
        content: this.selectedMessage,
        checkeed: false,
        company_id: 1,
        department_id: 1
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
</style>
