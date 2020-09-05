<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <h2>マイページ</h2>
      <v-card v-for="c in colleagues" :key="c.id" class="ma-3">
        <v-img max-width="200" v-if="c.image" :src="c.image" />
        <v-card-title>
          {{ c.name }}
        </v-card-title>
        <v-card-text>
          {{ c.description }}
        </v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
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
        this.fetchColleagues({
          companyId: this.userInfo.company_id
        })
      })
  },
  methods: {
    ...mapActions(['fetchUser', 'fetchColleagues', 'setUserInfo']),
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred'])
  }
}
</script>
<style scoped>
.comment-genre {
  max-width: 400px;
  margin: auto;
}
</style>
