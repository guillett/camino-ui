import Vue from 'vue'
import { administration } from '../api/administrations'

export const state = {
  current: null
}

export const actions = {
  async get({ commit, dispatch }, id) {
    commit('loadingAdd', 'administration', { root: true })

    try {
      const data = await administration({ id })

      commit('set', data)
    } catch (e) {
      dispatch('apiError', e, { root: true })
      console.info(e)
    } finally {
      commit('loadingRemove', 'administration', { root: true })
    }
  }
}

export const mutations = {
  set(state, administration) {
    Vue.set(state, 'current', administration)
  },

  reset(state) {
    Vue.set(state, 'current', null)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
