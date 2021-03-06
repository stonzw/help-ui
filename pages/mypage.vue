<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <h2>投稿の割合</h2>
      <v-row>
        <v-col cols="6">
          <v-card class="comment-genre">
            <v-card-title>
              投稿のカテゴリー
            </v-card-title>
            <v-card-text>
              <VueDoughnut :chart-data="commentChart(problemSummary)" :options="enqueteOptions" :width="400" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="comment-genre">
            <v-card-title>
              コメントしたカテゴリー
            </v-card-title>
            <v-card-text>
              <VueDoughnut :chart-data="commentChart(commentSummary)" :options="enqueteOptions" :width="400" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <h2>{{ getUserInfo().name }}さんの投稿一覧</h2>
      <v-row
        v-if="isAuthenticated()"
        align="center"
        justify="center"
      >
        <v-col v-for="item in problemData" :key="`my-problem-${item.id}`" class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
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
      <h2>{{ getUserInfo().name }}さんの投稿したコメント</h2>
      <div id="help-answer">
        <v-col v-for="comment in commentData" :key="`comment-${comment.id}`">
          <v-card :to="comment.problem.url" elevation="0">
            <v-card-title>
              {{ comment.content }}
            </v-card-title>
            <v-card-subtitle>
              「{{ comment.problem.title }}」への回答
            </v-card-subtitle>
          </v-card>
        </v-col>
      </div>
    </v-container>
    <v-dialog
      v-model="messageDialog"
      max-width="694px"
    >
      <v-card>
        <v-card-text>
          {{ message.message }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import moment from 'moment'
import api from '~/plugins/api'
function parseProblem (problems) {
  return problems.map((p) => {
    const item = p
    item.url = `/help/?helpId=${p.id}`
    return item
  })
}
export default {
  data () {
    return {
      enqueteOptions: {
        legend: {
          labels: {
            usePointStyle: true
          },
          display: true
        }
      },
      problemSummary: [],
      commentSummary: [],
      coinAmount: 0,
      selectedUser: null,
      problemData: null,
      commentData: null,
      profileDescription: '',
      profileImageUrl: '',
      imageUploading: false,
      messageDialog: false,
      message: { message: '', level: 'none' }
    }
  },
  computed: {
    ...mapState(['userInfo', 'colleagues'])
  },
  mounted () {
    this
      .fetchUser()
      .then(() => {
        this.fetchColleagues({ companyId: this.userInfo.company_id })
        this.profileDescription = this.userInfo.description
        this.profileImageUrl = this.userInfo.image
      })
    this.fetchProblemData()
    this.fetchCommentData()
  },
  methods: {
    ...mapActions(['fetchUser', 'fetchColleagues', 'setUserInfo']),
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred']),
    unix2daystr (unix) {
      return moment.unix(unix).format('MM月DD日(締切)')
    },
    fetchProblemData () {
      api.get(
        `/survey-my-problem`,
        { headers: this.getCred() }
      )
        .then((res) => {
          this.problemData = parseProblem(res.data.data)
          this.problemSummary = res.data.summary
        })
    },
    fetchCommentData () {
      api.get(
        `/survey-my-comment`,
        { headers: this.getCred() }
      )
        .then((res) => {
          this.commentData = res.data.data.comment
          const problems = parseProblem(res.data.data.problem)
          problems.map((item, idx) => {
            this.commentData[idx].problem = item
          })
          this.commentSummary = res.data.summary
        })
    },
    commentChart (data) {
      if (data) {
        return {
          labels: ['運営からのお知らせ', '活動報告', '質問', '募集', '雑記'],
          datasets: [
            {
              data: [data.info, data.act, data.question, data.bosyu, data.other],
              backgroundColor: ['#E38885', '#A4A1FB', '#FC8373', '#85E388', '#8372FC']
            }
          ]
        }
      }
    },
    clickProfileSendButton () {
      const data = { 'description': this.profileDescription }
      api.put(`user_infos/${this.userInfo.id}`, data, { headers: this.getCred() })
        .then((x) => {
          this.setUserInfo({ data: x.data })
          this.message = { message: '更新が完了しました.', level: 'success' }
          this.messageDialog = true
        })
    },
    clickProfileImageSendButton () {
      const data = { 'image': this.profileImageUrl }
      api.put(`user_infos/${this.userInfo.id}`, data, { headers: this.getCred() })
        .then((x) => {
          this.setUserInfo({ data: x.data })
          this.message = { message: '更新が完了しました.', level: 'success' }
          this.messageDialog = true
        })
    },
    clickCoinButton () {
      api.post(
        'send-coin',
        {
          'sender_id': this.userInfo.id,
          'receiver_id': this.selectedUser,
          'coin': parseInt(this.coinAmount)
        },
        { headers: this.getCred() }
      ).then((x) => {
        this.setUserInfo({ data: x.data })
      })
    },
    convertImageBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    onImageChange (e) {
      this.convertImageBase64(e)
        .then((image) => {
          this.imageBase64 = image
          this.imageUploading = true
          api.post(
            'upload-image',
            { 'base64_image': image },
            { headers: this.getCred() }
          ).then((x) => {
            this.profileImageUrl = x.data.image_url
            this.imageUploading = false
          })
        })
        .catch((error) => { this.setError(error, '画像のアップロードに失敗しました。') })
    }
  }
}
</script>
<style scoped>
.comment-genre {
  max-width: 400px;
  margin: auto;
}
</style>
