<template>
  <v-layout>
    <v-container>
      <v-form>
        <v-textarea v-model="textEditInput" outlined />
        <v-input v-model="output" />
        <v-btn @click="click">hoge</v-btn>
      </v-form>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default {
  data () {
    return {
      textEditInput: '',
      output: ''
    }
  },
  methods: {
    ...mapActions(['fetchUser', 'fetchDepartments']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getUserInfo', 'getCred', 'getDepartments']),
    click () {
      axios
        .get('http://localhost:3333/youtube/' + this.textEditInput)
        .then((res) => {
          console.log(res)
        })
    }
  },
  mounted () {
    this.fetchUser()
  }
}
</script>
