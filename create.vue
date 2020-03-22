<template>
  <v-layout>
    <v-container>
      <svg ref="svgCard" width="640" height="360" xmlns="http://www.w3.org/2000/svg">
        <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->

        <g>
          <title>background</title>
          <rect
            id="canvas_background"
            fill="#f45353"
            height="362"
            width="642"
            y="-1"
            x="-1"
          />
          <g
            id="canvasGrid"
            display="none"
            overflow="visible"
            y="0"
            x="0"
            height="100%"
            width="100%"
          >
            <rect
              fill="url(#gridpattern)"
              stroke-width="0"
              y="0"
              x="0"
              height="100%"
              width="100%"
            />
          </g>
        </g>
        <g>
          <title>Layer 1</title>
          <text
            id="svg_4"
            font-style="normal"
            font-weight="bold"
            xml:space="preserve"
            text-anchor="start"
            font-family="Helvetica, Arial, sans-serif"
            font-size="40"
            y="64.453125"
            x="32"
            stroke-width="0"
            stroke="#000"
            fill="#ffffff"
          >{{ getSvgTitle(helpTitle) }}</text>
          <text
            id="svg_6"
            stroke="#000"
            transform="matrix(38.48314666748047,0,0,1,-20376.77560710907,0) "
            xml:space="preserve"
            text-anchor="start"
            font-family="Helvetica, Arial, sans-serif"
            font-size="20"
            y="173.453125"
            x="532.5"
            stroke-width="0"
            fill="#ffffff"
          />
          <text
            id="svg_9"
            xml:space="preserve"
            text-anchor="start"
            font-family="Helvetica, Arial, sans-serif"
            font-size="22"
            y="129.453125"
            x="64.5"
            fill-opacity="null"
            stroke-opacity="null"
            stroke-width="0"
            stroke="#000"
            fill="#ffffff"
          >{{ getSvgText(helpContent, 0) }}</text>
          <text
            id="svg_12"
            xml:space="preserve"
            text-anchor="start"
            font-family="Helvetica, Arial, sans-serif"
            font-size="22"
            y="176.453125"
            x="63.5"
            fill-opacity="null"
            stroke-opacity="null"
            stroke-width="0"
            stroke="#000"
            fill="#ffffff"
          >{{ getSvgText(helpContent, 1) }}</text>
          <text
            id="svg_13"
            xml:space="preserve"
            text-anchor="start"
            font-family="Helvetica, Arial, sans-serif"
            font-size="22"
            y="229.453125"
            x="61.5"
            fill-opacity="null"
            stroke-opacity="null"
            stroke-width="0"
            stroke="#000"
            fill="#ffffff"
          >{{ getSvgText(helpContent, 2) }}</text>
          <text
            id="svg_14"
            xml:space="preserve"
            text-anchor="start"
            font-family="Helvetica, Arial, sans-serif"
            font-size="22"
            y="283.453125"
            x="59.5"
            fill-opacity="null"
            stroke-opacity="null"
            stroke-width="0"
            stroke="#000"
            fill="#ffffff"
          >{{ getSvgText(helpContent, 3) }}</text>
        </g>
      </svg>

      <v-text-field v-model="helpTitle" label="タイトル" />
      <v-text-field v-model="helpContent" label="詳細" />
      <v-btn :disabled="!processing" @click="click" block color="primary" dark>
        投稿する
      </v-btn>
    </v-container>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import firebase from '~/plugins/firebase'
export default {
  data () {
    return {
      helpTitle: '',
      helpContent: '',
      processing: true
    }
  },
  mounted () {
    this.fetchUser()
  },
  methods: {
    ...mapActions(['fetchUser']),
    ...mapGetters(['getUser']),
    uploadImageBase64 (imageBase64, docId) {
      const imagePath = `/users/${this.getUser().uid}/${docId}.png`
      return firebase
        .storage()
        .ref(imagePath)
        .putString(imageBase64, 'data_url')
    },
    putHelp (imageURL) {
      const data = {
        title: this.helpTitle,
        content: this.helpContent,
        owner: this.getUser().uid
      }
      return firebase
        .firestore()
        .collection('help')
        .add(data)
    },
    click () {
      if (this.helpTitle !== '' && this.helpContent !== '') {
        const svgData = new XMLSerializer().serializeToString(this.$refs.svgCard)
        const imageBase64Data = window.btoa(unescape(encodeURIComponent(svgData)))
        const imageBase64 = 'data:image/svg+xml;charset=utf-8;base64,' + imageBase64Data
        this.processing = true
        this.putHelp()
          .then((docRef) => {
            this.uploadImageBase64(imageBase64, docRef.id)
              .then((res) => {
                this.processing = false
                this.$nuxt.$router.push({ path: '/help/' + docRef.id })
              })
              .catch((err) => {
                console.error(err)
              })
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    getSvgTitle (title) {
      const MAXLEN = 15
      if (title.length < MAXLEN) { return title } else { return title.substr(0, MAXLEN - 1) + '...' }
    },
    getSvgText (text, idx) {
      const ONELINECOUNT = 23
      const LINENUM = 4
      if (idx === (LINENUM - 1) && LINENUM * ONELINECOUNT < text.length) {
        return text.substr(idx * ONELINECOUNT, ONELINECOUNT - 1) + '...'
      } else {
        return text.substr(idx * ONELINECOUNT, ONELINECOUNT)
      }
    }
  }
}
</script>
<style scoped>
/* CSSを書く */
</style>
