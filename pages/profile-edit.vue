<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <h2>プロフィールを編集</h2>
      <v-card class="mb-6">
        <v-card-text>
          <div v-if="imageUploading" class="text-center">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            />
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
        </v-card-text>
        <v-btn
          @click="clickProfileImageSendButton"
          block
          color="primary"
          :disabled="imageUploading"
        >
          プロフィール画像を確定する
        </v-btn>
      </v-card>
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
          @click="clickProfileSendButton"
          block
          color="primary"
        >
          紹介文を確定する
        </v-btn>
      </v-card>
    </v-container>
    <v-dialog
      v-model="completeDialog"
      max-width="694px"
    >
      <v-card class="pa-2">
        <v-card-title>
          変更が完了しました。
        </v-card-title>
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
      completeDialog: false,
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
      const data = { 'description': this.profileDescription, 'company_id': this.userInfo.company_id }
      api.put(`user_infos/${this.userInfo.id}`, data, { headers: this.getCred() })
        .then((x) => {
          this.setUserInfo({ data: x.data })
          this.message = { message: '更新が完了しました.', level: 'success' }
          this.completeDialog = true
        })
    },
    clickProfileImageSendButton () {
      const data = { 'image': this.profileImageUrl, 'company_id': this.userInfo.company_id }
      api.put(`user_infos/${this.userInfo.id}`, data, { headers: this.getCred() })
        .then((x) => {
          this.setUserInfo({ data: x.data })
          this.message = { message: '更新が完了しました.', level: 'success' }
          this.completeDialog = true
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
