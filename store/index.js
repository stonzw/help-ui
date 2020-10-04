import api from '~/plugins/api'

function parseProblem (res) {
  return res.data.map((p) => {
    const item = p
    item.url = `/help/?helpId=${p.id}`
    return item
  })
}

export const state = () => ({
  user: null,
  cred: null,
  loading: false,
  message: { 'message': null, 'level': null },
  userInfo: {},
  workProblem: [],
  humanProblem: [],
  healthProblem: [],
  otherProblem: [],
  departments: [],
  colleagues: [],
  title: ''
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
  getHealthProblem (state) {
    return state.healthProblem
  },
  getOtherProblem (state) {
    return state.otherProblem
  },
  isLoading (state) {
    return state.loading
  },
  getDepartments (state) {
    return state.departments
  },
  getColleagues (state) {
    return state.colleagues
  },
  getCompanyName (state) {
    if (state.userInfo) {
      if (state.userInfo.company) {
        return state.userInfo.company.name
      }
    }
    return ''
  },
  getCompanyMessage (state) {
    if (state.userInfo) {
      if (state.userInfo.company) {
        return state.userInfo.company.message
      }
    }
    return ''
  },
  getCompanyDetail (state) {
    if (state.userInfo) {
      if (state.userInfo.company) {
        return state.userInfo.company.detail
      }
    }
    return ''
  },
  getHeaderImageURL (state) {
    if (state.userInfo) {
      if (state.userInfo.company) {
        return state.userInfo.company.header_image
      }
    }
  }
}

export const mutations = {
  setUserInfo (state, data) {
    this.$cookies.set('user_info', data, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
    state.userInfo = data
    state.title = data.company.name
  },
  setUserInfoCompany (state, data) {
    state.userInfo.company = data
    this.$cookies.set('user_info', state.userInfo, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
    state.title = state.userInfo.company.name
  },
  setUserFromRes (state, res) {
    const user = res.data.data
    this.$cookies.set('user', user, {
      path: '/',
      maxAge: 60 * 60 * 24
    })
    state.user = user
  },
  setUserInfoFromRes (state, res) {
    this.$cookies.set('user_info', res.data, {
      path: '/',
      maxAge: 60 * 60 * 24
    })
    state.userInfo = res.data
  },
  setCredFromRes (state, res) {
    const cred = {
      'access-token': res.headers['access-token'],
      'expiry': res.headers.expiry,
      'token-type': res.headers['token-type'],
      'uid': res.headers.uid,
      'client': res.headers.client
    }
    this.$cookies.set('cred', cred, {
      path: '/',
      maxAge: 60 * 60 * 24
    })
    state.cred = cred
  },
  loadUserFromCookie (state) {
    const user = this.$cookies.get('user')
    const cred = this.$cookies.get('cred')
    const userInfo = this.$cookies.get('user_info')
    if (user) {
      if (Date.now() / 1000 < cred.expiry) {
        state.user = user
        state.userInfo = userInfo
        state.cred = cred
      } else {
        state.user = null
        state.userInfo = null
        state.cred = null
      }
    }
  },
  setTitle (state, title) {
    state.title = title
  },
  setMessage (state, msg) {
    state.message = msg
  },
  setWorkProblem (state, res) {
    state.workProblem = parseProblem(res)
  },
  setHumanProblem (state, res) {
    state.humanProblem = parseProblem(res)
  },
  setHealthProblem (state, res) {
    state.healthProblem = parseProblem(res)
  },
  setOtherProblem (state, res) {
    state.otherProblem = parseProblem(res)
  },
  startLoad (state) {
    state.loading = true
  },
  finishLoad (state) {
    state.loading = false
  },
  setDepartmentsFromRes (state, res) {
    state.departments = {}
    res.data.map((item) => {
      state.departments[item.id] = item
    })
  },
  setUserNull (state) {
    state.user = null
    state.userInfo = null
    state.cred = null
  },
  setColleagues (state, data) {
    state.colleagues = data
  }
}

export const actions = {
  async fetchUser ({ commit }) {
    await commit('loadUserFromCookie')
    return state.userInfo
  },
  async setUserInfo ({ commit }, { data }) {
    await commit('setUserInfo', data)
  },
  async setUserInfoCompany ({ commit }, { data }) {
    await commit('setUserInfoCompany', data)
  },
  async fetchColleagues ({ commit }, { companyId }) {
    const res = await api.get(
      `/search-user-info?company_id=${companyId}`,
      { headers: this.state.cred }
    )
    await commit('setColleagues', res.data)
  },
  async login ({ commit }, { email, password }) {
    const data = {
      email,
      password
    }
    commit('startLoad')
    try {
      const res = await api.post('/auth/sign_in', data)
      commit('setCredFromRes', res)
      commit('setUserFromRes', res)
      commit('setMessage', {
        'message': 'ログインに成功しました。',
        'level': 'success'
      })
      try {
        const res2 = await api.get(
          `/user_infos/${this.state.user.id}`,
          { headers: this.state.cred }
        )

        commit('setUserInfoFromRes', res2)
        document.location.reload()
        commit('finishLoad')
        return this.state.userInfo
      } catch (error) {
        commit('setMessage', {
          'message': 'ログインに失敗しました。メールアドレスとパスワードをご確認ください。',
          'level': 'error'
        })
        commit('finishLoad')
      }
    } catch (error) {
      commit('setMessage', {
        'message': 'ログインに失敗しました。メールアドレスとパスワードをご確認ください。',
        'level': 'error'
      })
      commit('finishLoad')
    }
  },
  logout ({ commit }) {
    this.$cookies.removeAll()
    commit('setUserNull')
  },
  async fetchDepartments ({ commit }) {
    const departmentsRes = await api.get(
      `/departments?company_id=${this.state.userInfo.company_id}`,
      { headers: this.state.cred }
    )
    commit('setDepartmentsFromRes', departmentsRes)
  },
  async fetchTitle ({ commit }, { companyId }) {
    const res = await api.get(`companies/${companyId}`)
    commit('setTitle', res.data.name)
  },
  async fetchProblem ({ commit }) {
    commit('startLoad')
    try {
      const workRes = await api.get(
        `/search-problem?genre_id=${process.env.WORK_ID}&company_id=${this.state.userInfo.company_id}`,
        { headers: this.state.cred }
      )
      commit('setWorkProblem', workRes)
    } catch (error) {
      commit('finishLoad')
    }
    try {
      const humanRes = await api.get(
        `/search-problem?genre_id=${process.env.HUMAN_ID}&company_id=${this.state.userInfo.company_id}`,
        { headers: this.state.cred }
      )
      commit('setHumanProblem', humanRes)
    } catch (error) {
      commit('finishLoad')
    }
    try {
      const healthRes = await api.get(
        `/search-problem?genre_id=${process.env.HEALTH_ID}&company_id=${this.state.userInfo.company_id}`,
        { headers: this.state.cred }
      )
      commit('setHealthProblem', healthRes)
    } catch (error) {
      commit('finishLoad')
    }
    try {
      const otherRes = await api.get(
        `/search-problem?genre_id=${process.env.OTHER_ID}&company_id=${this.state.userInfo.company_id}`,
        { headers: this.state.cred }
      )
      commit('setOtherProblem', otherRes)
      commit('finishLoad')
    } catch (error) {
      commit('finishLoad')
    }
    try {
      const otherRes = await api.get(
        `/search-problem?genre_id=5&company_id=${this.state.userInfo.company_id}`,
        { headers: this.state.cred }
      )
      commit('setOtherProblem', otherRes)
      commit('finishLoad')
    } catch (error) {
      commit('finishLoad')
    }
  }
}
