<template>
  <v-app>
    <v-app-bar
      id="header"
      app
    >
      <v-toolbar-title>
        <span id="logo">HELP!</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="isAuthenticated()"
        @click="redirect()"
        class="top-help-btn"
        to="/create"
        color="secondary"
        dark
        large
        rounded
      >
        悩みを相談
      </v-btn>
      <v-btn
        v-else
        @click.stop="loginDialog = true"
        color="secondary"
        dark
        rounded
      >
        ログイン
      </v-btn>
      <v-app-bar-nav-icon
        v-if="isAuthenticated()"
        @click.stop="rightDrawer = !rightDrawer"
      />
    </v-app-bar>
    <v-navigation-drawer
      v-model="rightDrawer"
      fixed
      temporary
      right
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group>
          <v-list-item :to="'/'" router link>
            <v-list-item-action>
              <v-icon>mdi-desktop-mac</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>トップページ</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/create'" router link>
            <v-list-item-action>
              <v-icon>mdi-human-handsup</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>悩みを相談する</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="clickNotification">
            <v-list-item-action>
              <v-badge
                :content="notificationCount"
                :value="0<notificationCount"
              >
                <v-icon>mdi-email</v-icon>
              </v-badge>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>メッセージを確認</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/settings">
            <v-list-item-action>
              <v-icon>mdi-account</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>パスワードを変更</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <nuxt />
      <v-dialog
        v-if="!isAuthenticated()"
        v-model="loginDialog"
        max-width="100%"
      >
        <v-card>
          <v-card-title>
            ログイン
          </v-card-title>
          <v-card-text>
            <v-alert v-if="getMessage().level == 'error'" type="error">
              {{ getMessage().message }}
            </v-alert>
            <v-form id="login-form">
              <v-text-field v-model="email" label="メールアドレス" outlined />
              <v-text-field v-model="password" label="パスワード" type="password" outlined />
              <v-btn
                @click="clickLoginButton"
                class="top-help-btn"
                color="red"
                dark
                x-large
                rounded
              >
                ログイン
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-if="isAuthenticated()"
        v-model="notificationDialog"
        max-width="100%"
      >
        <v-card>
          <v-card-title>
            メッセージ
          </v-card-title>
          <v-card-text v-for="m in messages" :key="m.id">
            <v-icon v-if="!m.checked">
              mdi-new-box
            </v-icon>
            {{ m.content }}
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-overlay
        v-if="isLoading()"
        max-width="100%"
      >
        <v-progress-circular
          size="100"
          width="5"
          :color="loadingColor"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
export default {
  data () {
    return {
      email: '',
      password: '',
      loginDialog: false,
      notificationDialog: false,
      messages: null,
      notificationCount: 0,
      rightDrawer: false,
      loadingColor: `${process.env.THEMA_COLOR}`
    }
  },
  methods: {
    ...mapActions(['fetchUser', 'login', 'logout']),
    ...mapGetters(['isAuthenticated', 'getUser', 'getCred', 'getMessage', 'isLoading']),
    clickLoginButton () {
      this.login(
        {
          email: this.email,
          password: this.password
        }
      )
    },
    redirect () {
      if (this.isAuthenticated()) {
        this.$nuxt.$router.push({ path: '/create' })
      }
    },
    clickNotification () {
      this.notificationDialog = true
      this.messages.forEach(
        (m) => {
          if (!m.checked) {
            const talkId = m.id
            axios.put(
              `${process.env.API_URL}/talks/${talkId}`,
              { checked: true },
              { headers: this.getCred() }
            ).then((res) => { this.notificationCount -= 1 })
          }
        }
      )
    }
  },
  mounted () {
    if (this.isAuthenticated()) {
      const receiverId = this.getUser().id
      if (!this.messages) {
        axios.get(`${process.env.API_URL}/talks?receiver_id=${receiverId}`, { headers: this.getCred() })
          .then((res) => {
            this.messages = res.data.reverse()
            res.data.forEach((data) => {
              if (!data.checked) {
                this.notificationCount += 1
              }
            })
          })
      }
    } else {
      this.loginDialog = true
    }
  }
}
</script>
<style>
#header {
  box-shadow: 0px 0px 0 #ffffff,
    0px 0px 0 #ffffff,
    0px 0px 0 #ffffff,
    0px 0px 0 #ffffff;
}
#logo-link {
  text-decoration: none;
}
#logo {
  color:#000000;
  font-size: 2rem;
  font-family: serif;
}
img {
  width: 100%;
}
.v-btn {
  text-transform: none;
  font-weight: 700;
  box-shadow: 0px 0px 0 #ffffff,
    0px 0px 0 #ffffff,
    0px 0px 0 #ffffff,
    0px 0px 0 #ffffff;
}
.text-content {
  font-size: 18px;
  padding: 10px;
  padding-left: 23px;
  padding-right: 23px;
  color: #383838;
  padding-bottom: 20px;
  line-height: 36px;
}
</style>
