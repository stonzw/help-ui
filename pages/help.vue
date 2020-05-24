<template>
  <v-layout>
    <v-container>
      <v-row v-if="visible" class="main-wrapper">
        <div class="main-content col-12">
          <div>
            <v-btn outlined>
              {{ genreId2Name[genreId] }}
            </v-btn>
          </div>
          <v-col class="d-xl-flex d-md-flex d-sm-flex justify-space-between">
            <div>{{ deadlineStr() }}締切</div>
            <div id="owner-header" v-if="isOwner">
              <v-btn
                :v-if="isOwner"
                @click="helpEditModal = !helpEditModal"
                border
                outlined
              >
                編集する
              </v-btn>
              <v-btn
                :v-if="isOwner"
                @click="helpDeleteModal = !helpDeleteModal"
                border
                outlined
              >
                削除する
              </v-btn>
            </div>
          </v-col>
          <v-dialog
            v-model="helpDeleteModal"
            max-width="694px"
          >
            <v-card>
              <v-card-title class="d-flex justify-space-around">
                相談内容を削除する
              </v-card-title>
              <v-card-text class="d-flex justify-space-around">
                <v-btn
                  id="delete-help-btn"
                  :disabled="processing"
                  @click="clickDeleteHelpButton"
                  dark
                  color="primary"
                >
                  削除する
                </v-btn>
                <v-btn
                  @click="helpDeleteModal = false"
                >
                  キャンセル
                </v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="helpEditModal"
            max-width="694px"
          >
            <v-card>
              <v-card-title>
                相談内容を編集する
              </v-card-title>
              <v-card-text>
                <v-form id="create-help-form">
                  <v-select
                    id="help-genre"
                    v-model="selectedGenre"
                    :items="genres"
                    item-text="label"
                    item-value="value"
                    label="悩みのカテゴリー"
                  />
                  <v-select
                    id="help-expiry"
                    v-model="selectedTime"
                    :items="howlong"
                    item-text="label"
                    item-value="value"
                    label="延長する"
                  />
                  <v-text-field
                    id="help-title"
                    v-model="helpTitle"
                    label="タイトル"
                    counter="25"
                    outlined
                  />
                  <v-btn
                    id="edit-help-btn"
                    :disabled="processing"
                    @click="clickHelpEditButton"
                    block
                    rounded
                    dark
                    color="primary"
                  >
                    編集する
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <div class="image-wrapper">
            <img :src="imageURL">
          </div>
          <div id="help-content">
            <v-card v-for="item in contents" :key="`answer-${item.id}`" elevation="0">
              <v-card-title>
                <h2 class="content-title">
                  {{ headlines[item.question_id - 1] }}
                </h2>
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
          </div>
          <h2 v-if="comments.length !== 0" class="answer-title">
            回答
          </h2>
          <div id="help-answer">
            <v-card v-for="comment in comments" :key="`comment-${comment.id}`" class="comment" elevation="0">
              <v-card-text>
                <p v-if="isExpired() | isOwner | comment.user_id == getUser().id" v-html="comment.content" class="text-content" />
                <div v-if="isExpired() | isOwner | comment.user_id == getUserInfo().id" class="comment-author" style="text-align: end;">
                  {{ getDepartments()[`${comment.user.department_id}`].name }}
                  {{ comment.user.name }}さんの回答
                </div>
                <v-img v-else :src="comment.image_url" />
              </v-card-text>
              <v-btn
                v-if="isOwner"
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
            <v-card v-if="!isExpired() & !isOwner" elevation="0">
              <v-card-text>
                <v-form id="answer-form">
                  <v-textarea
                    id="answer-text-area"
                    v-model="commentContent"
                    label="回答する"
                    outlined
                  />
                  <v-btn
                    id="answer-btn"
                    @click="clickCommentButton()"
                    block
                    rounded
                    outlined
                    color="primary"
                  >
                    回答する
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </div>
        </div>
        <v-btn :to="'/'" color="primary" block>
          <v-icon>mdi-chevron-left</v-icon>TOPに戻る
        </v-btn>
        <div class="col-12">
          <h2>関連するお悩み</h2>
          <v-row>
            <v-col v-for="item in relatedProblems" :key="`related-problem-${item.id}`" class="col-6 d-flex flex-no-wrap">
              <v-card :href="item.url">
                <v-img
                  :src="item.image_url"
                />
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
        <v-btn :to="'/'" color="primary" block>
          <v-icon>mdi-chevron-left</v-icon>TOPに戻る
        </v-btn>
      </v-row>
      <v-row v-else>
        このページは削除されました。
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
import api from '~/plugins/api'
function replaceLink (text) {
  const matchLink = text.match(/(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#_]+)/gi)
  matchLink.forEach((url) => {
    if (text.includes('youtube')) {
      const videoId = url.match(/\?v=[a-zA-Z0-9_-]+/gi)[0].slice(3)
      const iframe = `<iframe id="ytplayer" type="text/html" width="640" height="360" src='https://www.youtube.com/embed/${videoId}' frameborder="0"></iframe>`
      text = text.replace(url, iframe)
    } else {
      text = text.replace(url, `<a href='${url}' target='_blank'>${url}</a>`)
    }
  })
  return text
}
export default {
  head () {
    return {
      title: this.helpTitle
    }
  },
  data () {
    return {
      commentContent: '',
      owner: null,
      imageURL: '',
      sender: null,
      helpTitle: '',
      textEditInput: '',
      receiver: null,
      headlines: {},
      contents: {},
      comments: [],
      relatedProblems: [],
      deadline: 0,
      editableId: -1,
      messageDialog: false,
      message: '',
      i: 0,
      isOwner: false,
      helpEditModal: false,
      helpDeleteModal: false,
      selectedGenre: { label: '', value: null },
      selectedTime: { label: '延長しない', value: 0 },
      genreId: null,
      genreId2Name: { 1: '人間関係', 2: '仕事', 3: '健康', 4: 'その他' },
      genres: [
        { label: '人間関係', value: 1 },
        { label: '仕事', value: 2 },
        { label: '健康', value: 3 },
        { label: 'その他', value: 4 }
      ],
      howlong: [
        { label: '延長しない', value: 0 },
        { label: 'あと3日延長', value: 60 * 60 * 24 * 3 },
        { label: 'あと1週間延長', value: 60 * 60 * 24 * 7 },
        { label: 'あと2週間延長', value: 60 * 60 * 24 * 14 },
        { label: 'あと1ヶ月延長', value: 60 * 60 * 24 * 30 }
      ],
      processing: false,
      helpId: null,
      visible: true
    }
  },
  mounted () {
    this.fetchUser().then(() => {
      this.fetchDepartments()
    })
    const { helpId } = this.$nuxt.$route.query
    this.helpId = helpId
    axios.get(`${process.env.API_URL}/problems/${helpId}`, { headers: this.getCred() })
      .then((res) => {
        const companyId = res.data.company_id
        const problemId = res.data.id
        this.genreId = res.data.genre_id
        this.selectedGenre = { label: this.genreId2Name[this.genreId], value: this.genreId }
        this.imageURL = res.data.image_url
        this.deadline = res.data.deadline
        this.owner = res.data.user_id
        this.isOwner = this.getUserInfo().id === this.owner
        this.helpTitle = res.data.title
        this.visible = res.data.visible
        const query = `?company_id=${companyId}&problem_id=${problemId}`
        const url = `${process.env.API_URL}/search-answer${query}`
        axios.get(url, { headers: this.getCred() }).then(
          (answers) => {
            this.contents = answers.data
              .map(
                (x) => {
                  return { 'id': x.id, 'question_id': x.question_id, 'content': x.content }
                }
              ).sort((a, b) => { return a.question_id - b.question_id })
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
              x.image_url = `${process.env.BUCKET_URL}/help/static/preopen-comment${1 + this.i % 3}.jpg`
              this.i += 1
              x.content = replaceLink(x.content)
              return x
            })
          }
        )
        axios.get(
          `${process.env.API_URL}/search-problem?company_id=${companyId}&genre_id=${this.genreId}`,
          { headers: this.getCred() }
        ).then((res) => {
          this.relatedProblems = res.data.map(
            (p) => {
              return {
                id: p.id,
                image_url: p.image_url,
                url: '/help/?helpId=' + p.id,
                title: p.title,
                deadline: p.deadline
              }
            }
          )
        })
      })
  },
  methods: {
    ...mapActions(['fetchUser', 'fetchDepartments']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserInfo', 'getCred', 'getDepartments']),
    clickCommentButton () {
      const { helpId } = this.$nuxt.$route.query
      const data = {
        'user_id': this.getUser().id,
        'problem_id': helpId,
        'content': this.commentContent
      }
      axios.post(`${process.env.API_URL}/comments`, data, { headers: this.getCred() })
        .then((res) => {
          this.commentContent = ''
          const { helpId } = this.$nuxt.$route.query
          axios.get(`${process.env.API_URL}/comments?problem_id=${helpId}`).then(
            (comments) => {
              this.comments = comments.data.map((x) => {
                x.image_url = `https://storage.googleapis.com/help-api/help/static/preopen-comment${1 + this.i % 3}.jpg`
                this.i += 1
                x.content = replaceLink(x.content)
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
    clickDeleteHelpButton () {
      const data = {
        visible: false
      }
      const headers = this.getCred()
      api.put(
        `/problems/${this.helpId}`,
        data,
        { headers }
      )
        .then((res) => {
          this.processing = false
          this.helpDeleteModal = false
          document.location.reload()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    clickHelpEditButton () {
      const data = {
        title: this.helpTitle,
        genre_id: this.selectedGenre,
        deadline: this.deadline + this.selectedTime
      }
      const headers = this.getCred()
      api.put(
        `/problems/${this.helpId}`,
        data,
        { headers }
      )
        .then((res) => {
          this.processing = false
          this.helpEditModal = false
        })
        .catch((error) => {
          console.error(error)
        })
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
        .catch((error) => {
          console.error(error)
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
        company_id: this.getUserInfo().company_id,
        department_id: this.getUserInfo().department_id,
        sender_name: this.getUserInfo().name + ` (相談内容: ${this.helpTitle}」)`,
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
.comment-author{
  color: #6f6f6f;
  margin-top: -26px;
}
.answer-title {
  padding: 16px;
}
</style>
