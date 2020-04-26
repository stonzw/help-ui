<template>
  <v-layout>
    <v-container>
        <v-card>
          <v-progress-linear :value="progressValue">
          </v-progress-linear>
          <v-card-subtitle>
            <span class="progress-color">
              {{ Math.min(idx + 1, 3) }} / {{ questions.length }}
            </span>
          </v-card-subtitle>
          <v-card-title :class="'d-flex justify-space-around'">{{ nowTitle }}</v-card-title>
          <v-card-text :class="'d-flex justify-space-around'">
            <v-btn
              :disabled="processing"
              @click="clickAnswerNGButton"
              dark
              rounded
              large
              color="#86abe3"
            ><v-icon>mdi-emoticon-sad</v-icon>悩んでいます</v-btn>
            <v-btn
              :disabled="processing"
              @click="clickAnswerOKButton"
              rounded
              large
              color="primary"
            ><v-icon>mdi-emoticon-happy</v-icon>大丈夫です</v-btn>
          </v-card-text>
        </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import axios from 'axios'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  head () {
    return {
      title: '調査ページ'
    }
  },
  data () {
    return {
      questions: [],
      answers: [],
      processing: false,
      enqueteId: undefined,
      nowTitle: '',
      idx: 0,
      progressValue: 0
    }
  },
  mounted () {
    const { enqueteId } = this.$nuxt.$route.query
    this.fetchUser()
    axios
      .get(
        `${process.env.API_URL}/search-enquete-questions?enquete_id=${enqueteId}`,
        { headers: this.getCred() }
      )
      .then((res) => {
        this.questions = res.data
        this.answers = res.data.map((item) => {
          item.content = 0
          return item
        })
        this.enqueteId = enqueteId
        this.nowTitle = res.data[this.idx].answer_headline
      })
  },
  methods: {
    ...mapMutations(['startLoad', 'finishLoad']),
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserInfo', 'getCred']),
    sendSuvey (data) {
      axios.post(
        `${process.env.API_URL}/surveys`,
        data,
        { headers: this.getCred() }
      ).then(() => {
        this.finishLoad()
        if (this.idx === (this.questions.length - 1)) {
          this.$nuxt.$router.push({ path: '/complete' })
        }
        this.process = false
        this.idx += 1
        this.nowTitle = this.questions[this.idx].answer_headline
        this.progressValue = 100 * (this.idx / this.questions.length)
      })
    },
    clickAnswerOKButton () {
      this.startLoad()
      this.process = true
      const item = this.questions[this.idx]
      const data = {
        'content': '0',
        'department_id': this.getUserInfo().department_id,
        'company_id': this.getUserInfo().company_id,
        'user_id': this.getUserInfo().id,
        'question_id': item.id,
        'enquete_id': this.enqueteId
      }
      this.sendSuvey(data)
    },
    clickAnswerNGButton () {
      this.startLoad()
      this.process = true
      const item = this.questions[this.idx]
      const data = {
        'content': '1',
        'department_id': this.getUserInfo().department_id,
        'company_id': this.getUserInfo().company_id,
        'user_id': this.getUserInfo().id,
        'question_id': item.id,
        'enquete_id': this.enqueteId
      }
      this.sendSuvey(data)
    }
  }
}
</script>
<style scoped>
.progress-color {
  color: #E38687;
}
</style>
