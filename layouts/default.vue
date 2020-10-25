<template>
  <v-app>
    <v-app-bar
      id="header"
      app
    >
      <v-toolbar-title>
        <span id="logo">{{ getCompanyName() }}</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        id="header-help-btn"
        v-if="isAuthenticated()"
        @click="redirect()"
        class="top-help-btn"
        to="/create"
        color="primary"
        dark
        large
        rounded
      >
        投稿する
      </v-btn>
      <v-btn
        v-else
        @click.stop="loginDialog = true"
        color="primary"
        dark
        rounded
      >
        ログイン
      </v-btn>

      <v-badge
        :content="notificationCount"
        :value="0<notificationCount"
        bottom
        overlap
      >
        <v-app-bar-nav-icon
          v-if="isAuthenticated()"
          @click.stop="rightDrawer = !rightDrawer"
        />
      </v-badge>
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
              <v-icon>mdi-arrow-up</v-icon>
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
              <v-list-item-title>投稿する</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/profile'" router link>
            <v-list-item-action>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>みんなのプロフィール</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/profile-edit'" router link>
            <v-list-item-action>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>プロフィールの編集</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/mypage'" router link>
            <v-list-item-action>
              <v-icon>mdi-account</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>活動記録</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/enter'" router link>
            <v-list-item-action>
              <v-icon>mdi-reload</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>サロン切り替え</v-list-item-title>
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

          <v-list-item to="/password-change">
            <v-list-item-action>
              <v-icon>mdi-account-key</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>パスワードを変更</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/send-coin">
            <v-list-item-action>
              <v-icon>mdi-ray-start-arrow</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>コインを送る</v-list-item-title>
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

          <v-list-item v-if="isAdminUser()" :to="'/admin/edit'" router link>
            <v-list-item-action>
              <v-icon>mdi-account-multiple-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>コミュニティ情報の編集</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="isAdminUser()" :to="'/admin/sendmail'" router link>
            <v-list-item-action>
              <v-icon>mdi-account-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>招待メールの送信</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

      </v-list>
    </v-navigation-drawer>
    <v-content>
      <nuxt />
      <v-dialog
        v-if="!isLoading() & isAuthenticated()"
        v-model="notificationDialog"
        max-width="100%"
      >
        <v-card color="#fafafa">
          <v-card-title>
            メッセージ
          </v-card-title>
          <v-col>
            <v-card v-for="m in messages" :key="m.id" outlined>
              <v-card-text>
                <v-icon v-if="!m.checked">
                  mdi-new-box
                </v-icon>
                {{ m.content }}
              </v-card-text>
              <v-card-subtitle>
                From: {{ m.department_name }} {{ m.sender_name }} さん({{ m.sender_email }})
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-card>
      </v-dialog>
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
              <v-text-field id="email" v-model="email" label="メールアドレス" outlined />
              <v-text-field id="password" v-model="password" label="パスワード" type="password" outlined />
              <v-btn
                @click="clickLoginButton"
                class="top-help-btn"
                color="primary"
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
      <v-overlay
        v-if="isLoading()"
        max-width="100%"
      >
        <v-progress-circular
          :color="loadingColor"
          size="100"
          width="5"
          indeterminate
        />
      </v-overlay>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import api from '~/plugins/api'
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
  computed: mapState(['userInfo']),
  mounted () {
    this.fetchUser().then(() => {
      if (this.isAuthenticated()) {
        const receiverId = this.getUser().id
        if (!this.messages) {
          api.get(`/talks?receiver_id=${receiverId}`, { headers: this.getCred() })
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
    })
  },
  methods: {
    ...mapActions(['login', 'logout', 'fetchTitle', 'fetchUser']),
    ...mapGetters(['isAuthenticated', 'isAdminUser', 'getUser', 'getCred', 'getMessage', 'isLoading', 'getCompanyName']),
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
            api.put(
              `/talks/${talkId}`,
              { checked: true },
              { headers: this.getCred() }
            ).then((res) => { this.notificationCount -= 1 })
          }
        }
      )
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
  font-family: "Montserrat","游ゴシック",YuGothic,"ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN","メイリオ",Meiryo,sans-serif;
  font-weight: 700;
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
  text-indent: 1em;
}
</style>
