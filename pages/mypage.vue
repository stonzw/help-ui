<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <h2>マイページ</h2>
      <div v-if="imageUploading" class="text-center">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <div v-else-if="profileImageUrl">
        <v-img :src="profileImageUrl" :max-width="200" />
      </div>
      <v-file-input
        id="help-image"
        @change="onImageChange"
        accept="image/png, image/jpeg, image/bmp"
        placeholder="見出し画像(任意)"
        prepend-icon="mdi-camera"
      />
      <v-btn
        block
        @click="clickProfileImageSendButton"
        color="primary"
      >
        確定する
      </v-btn>
      <v-card>
        <v-card-title>
          紹介文
        </v-card-title>
        <v-card-text>
          <v-textarea
            id="help-detail"
            v-model="profileDescription"
            counter="200"
            outlined
          />
        </v-card-text>
        <v-btn
          block
          @click="clickProfileSendButton"
          color="primary"
        >
          送信する
        </v-btn>
      </v-card>
      <v-row>
        <v-col cols="6">
          <v-card class="comment-genre">
            <v-card-title>
              投稿したお悩みのカテゴリー
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
      <v-card>
        <v-card-title>
          コインを送る
        </v-card-title>
        <v-card-subtitle>
          所持コイン：{{ userInfo.coin }}枚
        </v-card-subtitle>
        <v-card-text>
          <v-select
            v-model="selectedUser"
            :items="colleagues"
            item-text="name"
            item-value="id"
            label="送信先"
            dense
          ></v-select>
          <v-text-field
            v-model="coinAmount"
          ></v-text-field>
        </v-card-text>
        <v-btn
          block
          @click="clickCoinButton"
          color="primary"
        >送信する</v-btn>
      </v-card>
      <h2>{{ getUserInfo().name }}さんの投稿したお悩み</h2>
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
      imageUploading: false
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
        console.log(this.userInfo)
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
          labels: ['Human', 'Work', 'Health'],
          datasets: [
            {
              data: [data.human, data.work, data.health],
              backgroundColor: ['#A4A1FB', '#FC8373', '#85E388']
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
        })
    },
    clickProfileImageSendButton () {
      const data = { 'image': this.profileImageUrl }
      api.put(`user_infos/${this.userInfo.id}`, data, { headers: this.getCred() })
        .then((x) => {
          this.setUserInfo({ data: x.data })
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
