import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: false,
    selected: 0,
    mensaje: 'bienvenido',
    items: [],
    dataUser: []
  },
  mutations: {
    updateMessage(state, valor) {
      // mutate state
      console.log('cambiando valor')
     console.log(valor)
      state.drawer = valor
    }
  },
  actions: {
  },
  modules: {
  }
})
