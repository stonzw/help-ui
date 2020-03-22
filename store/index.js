import axios from 'axios'

export const state = () => ({
  user: null,
  cred: null,
  loginRes: null
})

export const getters = {
  isAuthenticated (state) {
    return !!state.user
  },
  getUser (state) {
    return state.user
  },
  getCred (state) {
    return state.cred
  }
}

export const mutations = {
  setUser (state, user) {
    state.user = user
  },
  setCred (state, cred) {
    state.cred = cred
  },
  setLoginRes (state, res) {
    state.res = res
  }
}

export const actions = {
  fetchUser ({ commit }) {
    const user = this.$cookies.get('user')
    const cred = this.$cookies.get('cred')
    if (user) {
      if (Date.now() / 1000 < cred.expiry) {
        commit('setUser', user)
        commit('setCred', cred)
      } else {
        commit('setUser', null)
        commit('setCred', null)
      }
    }
  },
  login ({ commit }, { email, password }) {
    const data = {
      email,
      password
    }
    axios.post(`${process.env.API_URL}/auth/sign_in`, data)
      .then(
        (res) => {
          const cred = {
            'access-token': res.headers['access-token'],
            'expiry': res.headers.expiry,
            'token-type': res.headers['token-type'],
            'uid': res.headers.uid,
            'client': res.headers.client
          }
          const user = res.data.data
          commit('setCred', cred)
          commit('setUser', user)
          commit('setLoginRes', res)
          this.$cookies.set('user', user, {
            path: '/',
            maxAge: 60 * 60 * 24
          })
          this.$cookies.set('cred', cred, {
            path: '/',
            maxAge: 60 * 60 * 24
          })
        }
      )
      .catch(
        (res) => {
          commit('setLoginRes', res)
        }
      )
  },
  logout ({ commit }) {
    commit('setUser', null)
    commit('setCred', null)
    this.$cookies.removeAll()
  }
}
