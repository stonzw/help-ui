<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <h2>{{ getUserInfo().name }}さんのマイページ</h2>
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
import { mapGetters, mapActions } from 'vuex'
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
      commentSummary: []
    }
  },
  mounted () {
    this.fetchUser()
    this.fetchProblemData()
    this.fetchCommentData()
  },
  methods: {
    ...mapActions(['fetchUser']),
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
