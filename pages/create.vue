<template>
  <v-layout>
    <v-container>
      <svg id="canvas" ref="svgCard" width="640" height="360" xmlns="http://www.w3.org/2000/svg">
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
      <v-form id="create-help-form">
        <v-select
          v-model="selectedGenre"
          :items="genres"
          item-text="label"
          item-value="value"
          label="どんな悩みですか?"
        />
        <v-text-field v-model="helpTitle" label="20文字程度でどんな悩みか教えてください" outlined rounded />
        <v-textarea v-model="helpContent" label="もっと詳しく教えてください" outlined rounded />
        <v-btn
          :disabled="!processing"
          @click="click"
          block
          rounded
          dark
          color="red"
        >
          相談してみる
        </v-btn>
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
      helpTitle: '',
      helpContent: '',
      processing: true,
      selectedGenre: { label: '', value: null },
      genres: [
        { label: '人間関係', value: 1 },
        { label: '仕事', value: 2 },
        { label: '健康', value: 3 }
      ]
    }
  },
  mounted () {
    this.fetchUser()
  },
  methods: {
    ...mapActions(['fetchUser', 'loginDialogOn']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred']),
    putHelp (imageBase64) {
      const data = {
        user_id: this.getUser().id,
        genre_id: this.selectedGenre,
        base64_image: imageBase64,
        company_id: 1
      }

      axios.post(`${process.env.API_URL}/problems`, data, { headers: this.getCred() })
        .then(
          (res) => {
            const data1 = {
              content: this.helpTitle,
              department_id: 1,
              company_id: 1,
              user_id: this.getUser().id,
              question_id: 1,
              problem_id: res.data.id
            }
            console.log(res)

            axios.post(`${process.env.API_URL}/answers`, data1, { headers: this.getCred() })
              .then((res2) => {
                const data2 = {
                  content: this.helpContent,
                  department_id: 1,
                  company_id: 1,
                  user_id: this.getUser().id,
                  question_id: 2,
                  problem_id: res.data.id
                }
                console.log(res2)
                axios.post(`${process.env.API_URL}/answers`, data2, { headers: this.getCred() })
                  .then((res3) => {
                    this.processing = false
                    this.$nuxt.$router.push({ path: '/help/' + res.data.id })
                    console.log(res3)
                  })
                  .catch(err => console.log(err))
              })
              .catch(err => console.log(err))
          })
        .catch(err => console.log(err))
    },
    click () {
      if (this.helpTitle !== '' && this.helpContent !== '') {
        const svgData = new XMLSerializer().serializeToString(this.$refs.svgCard)
        const imageBase64Data = window.btoa(unescape(encodeURIComponent(svgData)))
        this.processing = true
        this.putHelp(imageBase64Data)
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

#canvas {
  display: none;
}
#create-help-form {
  margin-top: 2rem;
}
.v-btn {
}
</style>
