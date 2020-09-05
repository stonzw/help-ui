<template>
  <v-layout>
    <v-container>
      <v-card>
        <v-progress-linear :value="progressValue" />
        <v-card-subtitle>
          <span class="progress-color display-1">
            {{ Math.min(idx + 1, 3) }} / {{ questions.length }}
          </span>
        </v-card-subtitle>
        <v-card-title class="d-flex justify-space-around">
          {{ nowTitle }}
        </v-card-title>
        <v-card-text v-if="idx=4">
          <v-col v-for="i in 5" :key="`button-${i}`">
            <div class="d-flex justify-space-around">
              <v-btn
                :disabled="processing"
                @click="clickAnswerButton(i)"
                :color="btnColors[i]"
                dark
                large
                width="50%"
              >
                {{ i }}.{{ ' '+ val2label[i] }}
              </v-btn>
            </div>
          </v-col>
        </v-card-text>
        <v-card-text v-else>
          <v-textarea :v-model="textInput" ></v-textarea>
        </v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import axios from 'axios'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import enqueteValue2Icon from '~/assets/enquete_value2icon.json'
import enqueteValue2Color from '~/assets/enquete_value2color.json'
import enqueteValue2Text from '~/assets/enquete_value2text.json'
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
      progressValue: 0,
      val2label: enqueteValue2Text,
      btnColors: enqueteValue2Color,
      btnIcons: enqueteValue2Icon
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
        this.nowTitle = this.questions[this.idx].enquete_headline
        this.progressValue = 100 * (this.idx / this.questions.length)
      })
    },
    clickAnswerButton (val) {
      this.startLoad()
      this.process = true
      const item = this.questions[this.idx]
      const data = {
        'content': `${val}`,
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
