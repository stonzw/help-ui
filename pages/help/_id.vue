<template>
  <v-layout>
    <v-container>
      <h2>{{ helpTitle }}</h2>
      <img :src="imageURL">
      <p>{{ helpContent }}</p>
      <div v-for="item in contents" :key="item.id">
        <h2>{{ headlines[item.id - 1] }}</h2>
        {{ item.content }}
      </div>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default {
  data () {
    return {
      helpTitle: '',
      helpContent: '',
      owner: '',
      imageURL: '',
      headlines: {},
      contents: {},
      comments: []
    }
  },
  mounted () {
    this.fetchUser()
    const helpId = this.$nuxt.$route.params.id
    axios.get(`${process.env.API_URL}/problems/${helpId}`, { headers: this.getCred() })
      .then((res) => {
        const companyId = res.data.company_id
        const problemId = res.data.id
        this.imageURL = res.data.image_url
        const query = `?company_id=${companyId}&problem_id=${problemId}`
        const url = `${process.env.API_URL}/search-answer${query}`
        axios.get(url, { headers: this.getCred() }).then(
          (answers) => {
            this.contents = answers.data.map((x) => { return { 'id': x.question_id, 'content': x.content } })
          }
        )
        axios.get(`${process.env.API_URL}/questions`).then(
          (questions) => {
            this.headlines = questions.data.map((x) => { return x.answer_headline })
          }
        )
        axios.get(`${process.env.API_URL}/search-comments?problem_id=${problemId}`).then(
          (comments) => {
            this.headlines = comments.data.map((x) => { return x.content })
          }
        )
      })
  },
  methods: {
    ...mapActions(['fetchUser', 'loginDialogOn']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred']),
    fetchHelp (snap) {
      console.log(snap)
    }
  }
}
</script>
