<template>
  <v-layout>
    <v-container>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          md="10"
          sm="10"
          xs="12"
        >
          <v-card>
            <v-card-title>
              投稿してみましょう
            </v-card-title>
            <v-card-text>
              <v-form
                id="create-help-form"
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-select
                  id="help-genre"
                  v-model="selectedGenre"
                  :items="genres"
                  :rules="[rules.required]"
                  item-text="label"
                  item-value="value"
                  label="投稿のカテゴリーを選択してください。"
                />
                <v-text-field
                  id="help-title"
                  v-model="helpTitle"
                  :rules="[rules.max25, rules.required]"
                  label="投稿のタイトルを入力してください。"
                  counter="25"
                  outlined
                />
                <v-textarea
                  id="help-detail"
                  v-model="helpContent"
                  :rules="[rules.max1000, rules.required]"
                  label="投稿内容"
                  counter="1000"
                  outlined
                />
                <v-file-input
                  id="help-image"
                  @change="onImageChange"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="見出し画像(任意)"
                  prepend-icon="mdi-camera"
                />
                <v-btn
                  id="create-help-btn"
                  :disabled="!processing"
                  @click="clickHelpButton"
                  block
                  rounded
                  dark
                  color="primary"
                >
                  投稿する
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import api from '~/plugins/api'
export default {
  head () {
    return {
      title: '投稿ページ'
    }
  },
  data () {
    return {
      helpTitle: '',
      helpUserInfo: '',
      helpContent: '',
      processing: true,
      selectedGenre: { label: '', value: null },
      selectedTime: { label: '', value: null },
      genres: [],
      rules: {
        required: value => !!value || 'Required.',
        max25: value => value.length <= 25 || '25文字以内で入力してください',
        max1000: value => value.length <= 1000 || '1000文字以内で入力してください'
      },
      valid: true,
      imageBase64: ''
    }
  },
  computed: ['userInfo'],
  mounted () {
    this.fetchGenre()
    this.fetchUser()
  },
  methods: {
    ...mapMutations(['startLoad', 'finishLoad']),
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'isAdminUser', 'getUser', 'getUserInfo', 'getCred']),
    validate () {
      this.$refs.form.validate()
    },
    fetchGenre () {
      if (this.isAdminUser()) {
        this.genres = [
          { label: '運営からのお知らせ', value: 1 },
          { label: '活動記録', value: 2 },
          { label: '質問', value: 3 },
          { label: '募集', value: 4 },
          { label: '雑記', value: 5 }
        ]
      } else {
        this.genres = [
          { label: '活動記録', value: 2 },
          { label: '質問', value: 3 },
          { label: '募集', value: 4 },
          { label: '雑記', value: 5 }
        ]
      }
    },
    putHelp () {
      this.validate()
      if (!this.valid) {
        return
      }
      const companyId = this.getUserInfo().company_id
      const departmentId = this.getUserInfo().department_id
      const data = {
        title: this.helpTitle,
        describe: this.helpContent,
        visible: true,
        user_id: this.getUser().id,
        genre_id: this.selectedGenre,
        company_id: companyId,
        department_id: departmentId,
        deadline: Math.floor(Date.now() / 1000) + 3600 * 24 * 365 * 3
      }
      if (this.imageBase64) {
        data.base64_image = this.imageBase64
      }
      this.startLoad()
      api.post(`/problems`, data, { headers: this.getCred() })
        .then(
          (res) => {
            const data1 = {
              content: this.helpTitle,
              department_id: departmentId,
              company_id: companyId,
              user_id: this.getUser().id,
              question_id: 1,
              problem_id: res.data.id
            }
            api.post('/answers', data1, { headers: this.getCred() })
              .then((res2) => {
                const data3 = {
                  content: this.helpContent,
                  department_id: departmentId,
                  company_id: companyId,
                  user_id: this.getUser().id,
                  question_id: 3,
                  problem_id: res.data.id
                }
                api.post('/answers', data3, { headers: this.getCred() })
                  .then((res4) => {
                    this.processing = false
                    this.$nuxt.$router.push({ path: '/help/?helpId=' + res.data.id })
                    this.finishLoad()
                  })
                  .catch(() => { this.finishLoad() })
              })
              .catch(() => { this.finishLoad() })
          })
        .catch(() => { this.finishLoad() })
    },
    clickHelpButton () {
      if (this.helpTitle !== '' && this.helpContent !== '') {
        this.processing = true
        this.putHelp()
      }
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
        .then((image) => { this.imageBase64 = image })
        .catch((error) => { this.setError(error, '画像のアップロードに失敗しました。') })
    }
  }
}
</script>
<style scoped>
/* CSSを書く */

#canvas {
  display: none;
}
#create-help-form {
  margin-top: 2rem;
}
</style>
