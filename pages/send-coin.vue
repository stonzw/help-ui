<template>
  <v-layout>
    <v-container v-if="isAuthenticated()">
      <v-card>
        <v-card-title>
          コインを送る
        </v-card-title>
        <v-card-subtitle>
          所持コイン：{{ userInfo.coin }}枚
        </v-card-subtitle>
        <v-card-text>
          <v-select
            v-model="selectedUser"
            :items="colleagues"
            item-text="name"
            item-value="id"
            label="送信先"
            dense
          />
          <v-text-field
            v-model="coinAmount"
          />
        </v-card-text>
        <v-btn
          @click="clickCoinButton"
          block
          color="primary"
        >
          送信する
        </v-btn>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import api from '~/plugins/api'
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
      imageUploading: false,
      messageDialog: false,
      message: { message: '', level: 'none' }
    }
  },
  computed: {
    ...mapState(['userInfo', 'colleagues'])
  },
  mounted () {
    this
      .fetchUser()
      .then(() => {
        this.fetchColleagues({ companyId: this.userInfo.company_id })
        this.profileDescription = this.userInfo.description
        this.profileImageUrl = this.userInfo.image
      })
  },
  methods: {
    ...mapActions(['fetchUser', 'fetchColleagues', 'setUserInfo']),
    ...mapGetters(['isAuthenticated', 'getUserInfo', 'getCred']),
    clickCoinButton () {
      api.post(
        'send-coin',
        {
          'sender_id': this.userInfo.id,
          'receiver_id': this.selectedUser,
          'coin': parseInt(this.coinAmount)
        },
        { headers: this.getCred() }
      ).then((x) => {
        this.setUserInfo({ data: x.data })
      })
    }
  }
}
</script>
