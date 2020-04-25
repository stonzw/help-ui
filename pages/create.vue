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
              相談してみましょう
            </v-card-title>
            <v-card-text>
              <v-form id="create-help-form">
                <v-select
                  v-model="selectedGenre"
                  :items="genres"
                  item-text="label"
                  item-value="value"
                  label="どんな悩みですか?"
                />
                <v-select
                  v-model="selectedTime"
                  :items="howlong"
                  item-text="label"
                  item-value="value"
                  label="いつまでに答えて欲しいですか？"
                />
                <v-text-field v-model="helpTitle" label="25文字以内でどんな悩みか教えてください。 (例: 人間関係で悩んでいます)" counter="25" outlined />
                <v-textarea v-model="helpUserInfo" label="公開できる範囲であなたのことを教えてください。 (例: 入社3年目のエンジニア職で...)" counter="200" outlined />
                <v-textarea v-model="helpContent" label="悩みについてもっと詳しく教えてください。 " counter="200" outlined />
                <v-file-input
                  :rules="rules"
                  @change="onImageChange"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="見出し画像(任意)"
                  prepend-icon="mdi-camera"
                />
                <v-btn
                  :disabled="!processing"
                  @click="clickHelpButton"
                  block
                  rounded
                  dark
                  color="primary"
                >
                  相談してみる
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
import axios from 'axios'
export default {
  head () {
    return {
      title: '相談ページ'
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
      genres: [
        { label: '人間関係', value: 1 },
        { label: '仕事', value: 2 },
        { label: '健康', value: 3 },
        { label: 'その他', value: 4 }
      ],
      howlong: [
        { label: '3日', value: 60 * 60 * 24 * 3 },
        { label: '1週間', value: 60 * 60 * 24 * 7 },
        { label: '2週間', value: 60 * 60 * 24 * 14 },
        { label: '1ヶ月', value: 60 * 60 * 24 * 30 }
      ],
      rules: [
        value => !value || value.size < 2000000 || '画像のサイズの上限は 2 MB　です。'
      ],
      imageBase64: ''
    }
  },
  mounted () {
    this.fetchUser()
  },
  methods: {
    ...mapMutations(['startLoad', 'finishLoad']),
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred']),
    putHelp () {
      const data = {
        title: this.helpTitle,
        describe: this.helpContent,
        visible: true,
        user_id: this.getUser().id,
        genre_id: this.selectedGenre,
        company_id: 1,
        department_id: 1,
        deadline: Math.floor(Date.now() / 1000) + this.selectedTime
      }
      if (this.imageBase64) {
        data.base64_image = this.imageBase64
      }
      this.startLoad()
      axios.post(`${process.env.API_URL}/problems`, data, { headers: this.getCred() })
        .then(
          (res) => {
            const data1 = {
              content: this.helpTitle,
              department_id: 1,
              company_id: 1,
              user_id: this.getUser().id,
              question_id: 1,
              problem_id: res.data.id
            }

            axios.post(`${process.env.API_URL}/answers`, data1, { headers: this.getCred() })
              .then((res2) => {
                const data2 = {
                  content: this.helpUserInfo,
                  department_id: 1,
                  company_id: 1,
                  user_id: this.getUser().id,
                  question_id: 2,
                  problem_id: res.data.id
                }
                axios.post(`${process.env.API_URL}/answers`, data2, { headers: this.getCred() })
                  .then((res3) => {
                    const data3 = {
                      content: this.helpContent,
                      department_id: 1,
                      company_id: 1,
                      user_id: this.getUser().id,
                      question_id: 3,
                      problem_id: res.data.id
                    }
                    axios.post(`${process.env.API_URL}/answers`, data3, { headers: this.getCred() })
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
