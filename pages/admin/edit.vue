<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <v-card>
        <v-card-title>サロン情報を変更</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="name"
            label="サロン名"
            outlined
          />
          <v-text-field
            v-model="message"
            label="サロンのスローガン"
            outlined
          />
          <v-text-field
            v-model="detail"
            label="サロンの紹介文"
            outlined
          />
          <v-label>トップページの画像</v-label>
          <div v-if="headerImageUrl">
            <v-img :src="headerImageUrl" :max-width="200" />
          </div>
          <v-file-input
            id="help-image"
            @change="onImageChange"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="新しい画像をアップロード"
            prepend-icon="mdi-camera"
          />
          <v-btn
            @click="clickRegisterButton"
            block
            color="primary"
          >
            送信する
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog
      v-model="completeDialog"
      max-width="694px"
    >
      <v-card class="pa-2">
        <v-card-title>
          会社情報の変更が完了しました。
        </v-card-title>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import api from '~/plugins/api'
export default {
  data () {
    return {
      message: '',
      detail: '',
      name: '',
      headerImageUrl: '',
      completeDialog: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'cred'])
  },
  mounted () {
    this.fetchUser().then((x) => {
      this.name = this.userInfo.company.name
      this.message = this.userInfo.company.message
      this.detail = this.userInfo.company.detail
      this.headerImageUrl = this.userInfo.company.header_image
    })
  },
  methods: {
    ...mapActions(['fetchUser', 'creaetUser', 'setUserInfo', 'setUserInfoCompany']),
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred', 'getHeaderImageURL']),
    clickRegisterButton () {
      const data = {
        name: this.name,
        message: this.message,
        detail: this.detail,
        header_image: this.headerImageUrl
      }
      api.put(`companies/${this.userInfo.company.id}`, data, { headers: this.cred })
        .then((res) => {
          this.setUserInfoCompany({ data: res.data })
          this.completeDialog = true
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
            this.headerImageUrl = x.data.image_url
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
