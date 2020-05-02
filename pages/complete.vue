<template>
  <v-layout>
    <v-container>
      <v-card>
        <v-card-title>アンケートの回答が完了しました。</v-card-title>
        <v-card-text>
          <v-col>
            <v-btn :to="'/create'" block color="primary">
              悩みを相談する
            </v-btn>
          </v-col>
          <v-col>
            <v-btn :to="'/'" block>
              トップに戻る
            </v-btn>
          </v-col>
        </v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {}
  },
  mounted () {
    this.fetchUser()
  },
  methods: {
    ...mapActions(['fetchUser'])
  }
}
</script>
