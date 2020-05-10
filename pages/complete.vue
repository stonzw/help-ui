<template>
  <v-layout>
    <v-container>
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
