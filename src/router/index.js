import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Administracion from '../views/Administracion'
import Calendario from '../views/Calendario'
import Paciente from '../views/Pacientes'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Administrador',
    name: 'Administrador',
    component: Administracion
  },
  {
    path: '/Citas',
    name: 'Citas',
    component: Calendario
  },
  {
    path: '/Pacientes',
    name: 'Pacientes',
    component: Paciente
  },
  {
    path: '/*',
    component: NotFound
  }
]

const router = new VueRouter({
  /*  mode: 'history',
   base: process.env.BASE_URL, */
  mode: 'hash',
  //base: process.env.BASE_URL,
  routes
})

export default router
