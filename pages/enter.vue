<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <v-card>
        <v-card-title>
          サロンを切り替える
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedCommunity"
            :items="communityList"
            item-text="label"
            item-value="value"
            label="サロン"
          />
        </v-card-text>
        <v-btn @click="changeCommunity" block>
          確定する
        </v-btn>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import api from '~/plugins/api'
export default {
  data () {
    return {
      userInfoList: null,
      communityList: null,
      selectedCommunity: null
    }
  },
  computed: {
    ...mapState(['userInfo', 'cred'])
  },
  mounted () {
    this.fetchUser()
    this.fetchUserInfoList()
  },
  methods: {
    ...mapActions(['fetchUser', 'creaetUser', 'setUserInfo']),
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred']),
    fetchUserInfoList () {
      api.get('get-my-user-infos', { headers: this.cred })
        .then((x) => {
          this.userInfoList = x.data
          this.communityList = this.userInfoList
            .map((x) => {
              if (this.userInfo.company_id === x.company.id) {
                this.selectedCommunity = { label: x.company.name, value: x.company.id }
              }
              return { label: x.company.name, value: x.company.id }
            })
        })
    },
    changeCommunity () {
      this.userInfoList.map((x) => {
        if (x.company.id === this.selectedCommunity) {
          this.setUserInfo({ data: x })
        }
      })
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
