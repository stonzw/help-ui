<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <h2>マイページ</h2>
      <v-card v-for="c in colleagues" :key="c.id" class="ma-3">
        <v-card-title>
          {{ c.name }}
        </v-card-title>
        <v-card-text class="d-flex">
          <div class="mr-2">
            <v-img v-if="c.image" :src="c.image" width="200" height="200" />
          </div>
          <div>
            {{ c.description }}
          </div>
        </v-card-text>
        <v-card-subtitle>
          参加日: {{ parseDatetime(c.created_at) }}
        </v-card-subtitle>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import moment from 'moment'
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
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred']),
    parseDatetime (daystr) {
      return moment(daystr).format('YYYY-MM-DD')
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
