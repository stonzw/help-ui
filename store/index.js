import axios from 'axios'

export const state = () => ({
  user: null,
  cred: null,
  loading: false,
  message: { 'message': null, 'level': null },
  userInfo: {},
  workProblem: [],
  humanProblem: [],
  helthProblem: [],
  otherProblem: []
})

export const getters = {
  isAuthenticated (state) {
    return !!state.user
  },
  isAdminUser (state) {
    if (state.userInfo) {
      return state.userInfo.role === 'admin' || state.userInfo.role === 'system_admin'
    }
    return false
  },
  getUser (state) {
    return state.user
  },
  getUserInfo (state) {
    return state.userInfo
  },
  getCred (state) {
    return state.cred
  },
  getMessage (state) {
    return state.message
  },
  getWorkProblem (state) {
    return state.workProblem
  },
  getHumanProblem (state) {
    return state.humanProblem
  },
  getHelthProblem (state) {
    return state.helthProblem
  },
  getOtherProblem (state) {
    return state.otherProblem
  },
  isLoading (state) {
    return state.loading
  }
}

export const mutations = {
  setUser (state, user) {
    state.user = user
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  setCred (state, cred) {
    state.cred = cred
  },
  setMessage (state, msg) {
    state.message = msg
  },
  setWorkProblem (state, problem) {
    state.workProblem = problem
  },
  setHumanProblem (state, problem) {
    state.humanProblem = problem
  },
  setHelthProblem (state, problem) {
    state.helthProblem = problem
  },
  setOtherProblem (state, problem) {
    state.otherProblem = problem
  },
  startLoad (state) {
    state.loading = true
  },
  finishLoad (state) {
    state.loading = false
  }
}

export const actions = {
  fetchUser ({ commit }) {
    const user = this.$cookies.get('user')
    const userInfo = this.$cookies.get('user_info')
    const cred = this.$cookies.get('cred')
    if (user) {
      if (Date.now() / 1000 < cred.expiry) {
        commit('setUser', user)
        commit('setUserInfo', userInfo)
        commit('setCred', cred)
      } else {
        commit('setUser', null)
        commit('setUserInfo', null)
        commit('setCred', null)
      }
    }
  },
  login ({ commit }, { email, password }) {
    const data = {
      email,
      password
    }
    commit('startLoad')
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
          commit('setMessage', {
            'message': 'ログインに成功しました。',
            'level': 'success'
          })
          this.$cookies.set('user', user, {
            path: '/',
            maxAge: 60 * 60 * 24
          })
          this.$cookies.set('cred', cred, {
            path: '/',
            maxAge: 60 * 60 * 24
          })
          axios.get(
            `${process.env.API_URL}/user_infos/${user.id}`,
            { headers: cred }
          ).then((res2) => {
            commit('setUserInfo', res2.data)
            this.$cookies.set('user_info', res2.data, {
              path: '/',
              maxAge: 60 * 60 * 24
            })
          })
          commit('finishLoad')
        }
      )
      .catch(
        (res) => {
          commit('setMessage', {
            'message': 'ログインに失敗しました。メールアドレスとパスワードをご確認ください。',
            'level': 'error'
          })
          commit('finishLoad')
        }
      )
  },
  logout ({ commit }) {
    commit('setUser', null)
    commit('setUserInfo', null)
    commit('setCred', null)
    this.$cookies.removeAll()
  },
  fetchProblem ({ commit }) {
    commit('startLoad')
    const companyId = 1
    const workId = 2
    axios.get(
      `${process.env.API_URL}/search-problem?company_id=${companyId}&genre_id=${workId}`,
      { headers: this.state.cred }
    ).then((res) => {
      const problem = res.data.map((p) => {
        const ret = p
        ret.url = `/help/${p.id}`
        return ret
      })
      commit('setWorkProblem', problem)
    }).catch(() => {
      commit('finishLoad')
    })
    const humanId = 1
    axios.get(
      `${process.env.API_URL}/search-problem?company_id=${companyId}&genre_id=${humanId}`,
      { headers: this.state.cred }
    ).then((res) => {
      const problem = res.data.map((p) => {
        const ret = p
        ret.url = `/help/${p.id}`
        return ret
      })
      commit('setHumanProblem', problem)
    })
    const helthId = 3
    axios.get(
      `${process.env.API_URL}/search-problem?company_id=${companyId}&genre_id=${helthId}`,
      { headers: this.state.cred }
    ).then((res) => {
      const problem = res.data.map((p) => {
        const ret = p
        ret.url = `/help/${p.id}`
        return ret
      })
      commit('setHelthProblem', problem)
      commit('finishLoad')
    })
    const otherId = 4
    axios.get(
      `${process.env.API_URL}/search-problem?company_id=${companyId}&genre_id=${otherId}`,
      { headers: this.state.cred }
    ).then((res) => {
      const problem = res.data.map((p) => {
        const ret = p
        ret.url = `/help/${p.id}`
        return ret
      })
      commit('setOtherProblem', problem)
      commit('finishLoad')
    })
  }
}
