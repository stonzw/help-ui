<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <h2>{{ getUserInfo().name }}さんのマイページ</h2>
      <v-card class="comment-genre">
        <v-card-title>
          コメントしたお悩み
        </v-card-title>
        <v-card-text>
          <VueDoughnut :chart-data="commentChart(commentData)" :options="enqueteOptions" width="400px" />
        </v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default {
  mounted () {
    this.fetchUser()
    this.fetchCommentData()
  },
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
      commentData: []
    }
  },
  methods: {
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred']),
    fetchCommentData () {
      axios.get(
        `${process.env.API_URL}/search-comment`,
        { headers: this.getCred() }
      )
        .then((res) => {
          this.commentData = res.data
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
