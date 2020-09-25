<template>
  <v-layout>
    <v-container>
      <v-card>
        <v-card-title>アンケートの回答が完了しました。</v-card-title>
        <v-card-text>
          <v-col>
            <v-btn :to="'/create'" block color="primary">
              投稿してみる
            </v-btn>
          </v-col>
          <v-col>
            <v-btn :to="'/'" block>
              トップに戻る
            </v-btn>
          </v-col>
        </v-card-text>
      </v-card>
      <div class="col-12">
        <h2>注目のページ</h2>
        <v-row>
          <v-col v-for="item in relatedProblems" :key="`related-problem-${item.id}`" class="col-12 col-md-4 col-lg-4 col-xl-4 d-flex flex-no-wrap">
            <v-card :href="item.url">
              <v-img
                :src="item.image_url"
              />
              <v-card-title>
                {{ item.title }}
              </v-card-title>
              <v-card-subtitle>
                {{ unix2daystr(item.deadline) }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import api from '~/plugins/api'
export default {
  data () {
    return {
      relatedProblems: []
    }
  },
  mounted () {
    this.fetchUser()
    this.fetchRelatedProblems()
  },
  methods: {
    ...mapActions(['fetchUser']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserInfo', 'getCred', 'getDepartments']),
    unix2daystr (unix) {
      return moment.unix(unix).format('MM月DD日(締切)')
    },
    fetchRelatedProblems () {
      const companyId = this.getUserInfo().company_id
      api.get(
        `search-problem?company_id=${companyId}`,
        { headers: this.getCred() }
      ).then((res) => {
        this.relatedProblems = res.data.map(
          (p) => {
            return {
              id: p.id,
              image_url: p.image_url,
              url: '/help/?helpId=' + p.id,
              title: p.title,
              deadline: p.deadline
            }
          }
        )
      })
    }
  }
}
</script>
