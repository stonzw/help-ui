<template>
  <v-layout>
    <v-container>
      <h2>{{ helpTitle }}</h2>
      <v-img :src="imageURL" width="100%"></v-img>
      <p>{{ helpContent }}</p>
      <v-btn
        :href="buildTweetLink()"
        color="#55acee"
        dark
        x-large
      >
        Tweet
        <v-icon>mdi-tweet</v-icon>
      </v-btn>
    </v-container>
  </v-layout>
</template>
<script>
import firebase from '~/plugins/firebase'
export default {
  data () {
    return {
      helpRef: undefined,
      helpTitle: '',
      helpContent: '',
      owner: '',
      imageURL: ''
    }
  },
  mounted () {
    const helpId = this.$nuxt.$route.params.id
    this.helpRef = firebase
      .firestore()
      .collection('help')
      .doc(helpId)
    this.helpRef.onSnapshot(this.fetchHelp)
  },
  methods: {
    fetchHelp (snap) {
      if (snap.exists) {
        const help = snap.data()
        this.helpTitle = help.title
        this.helpContent = help.content
        this.owner = help.owner
        this.imageRef = firebase
          .storage()
          .ref(`/users/${this.owner}/${snap.id}.png`)
          .getDownloadURL()
          .then((url) => {
            this.imageURL = url
          })
      }
    },
    buildTweetLink () {
      if (process.browser) {
        const currentURL = window.location.href
        const hashTags = encodeURI('help,ヘルプ')
        const tweetURL = 'https://twitter.com/intent/tweet'
        const msgLen = 140 - hashTags.split(',').length - hashTags.length - 1 - currentURL.length
        console.log(msgLen)
        const msg = ([this.helpTitle, this.helpContent].join('\n')).substr(0, msgLen)
        const query = `?text=${msg}&url=${currentURL}&hashtags=${hashTags}`
        return tweetURL + query
      }
    }
  }
}
</script>
