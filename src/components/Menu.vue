<template>
  <div class="tema">
    <v-system-bar color="deep-purple darken-3"></v-system-bar>
    <v-app-bar color="#ffffff" dense dark height="60" app>
      <v-app-bar-nav-icon
        @click.stop="cambiarValor"
        color="#9575cd"
      ></v-app-bar-nav-icon>
      <br />

      <span style="color: black; font-size: 30px"
        >Sistema de Citas médicas</span
      >

      <v-img
        class="imgMenu"
        height="48px"
        width="48px"
        contain
        :src="imgS"
      ></v-img>

      <v-spacer></v-spacer>

      <div v-if="$vuetify.breakpoint.width < 900">
        <div class="text-center">
          <v-menu>
            <template v-slot:activator="{ on: menu, attrs }">
              <v-btn color="#9575cd" v-bind="attrs" v-on="{ ...menu }">
                Enlaces
              </v-btn>
              <!--  <span>Seleccione una opción</span> -->
            </template>
            <v-card>
              <v-list>
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  :href="item.enlace"
                  target="_blank"
                >
                  <v-icon color="#9575cd">{{ item.icon }}</v-icon
                  ><v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </div>
      <div v-else>
        <div>
          <b-nav class="items">
            <v-icon color="#9575cd">{{ iconS }}</v-icon
            ><b-nav-item @click="cerrarSesion">Cerrar Sesión</b-nav-item>
          </b-nav>
        </div>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import { mdiFileDocumentOutline } from "@mdi/js";
import { mdiExitToApp } from "@mdi/js";
var iconM = require("../assets/iconD5.jpg");

export default {
  name: "App",
  components: {},

  data: () => ({
    fecha: "2022-03-16",
    extended: false,
    picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    drawer: false,
    items: [
      {
        title: "Solicitudes",
        enlace: "https://www.google.com",
        icon: mdiFileDocumentOutline,
      },
      {
        title: "Contáctenos",
        enlace: "https://www.google.com",
        icon: mdiFileDocumentOutline,
      },
      {
        title: "Cerrar Sesión",
        enlace: "https://www.google.com",
        icon: mdiExitToApp,
      },
    ],
    iconM: mdiFileDocumentOutline,
    iconS: mdiExitToApp,
    imgS: iconM,
  }),

  computed: {
    mobile: function () {
      if (this.$vuetify.breakpoint.width < 900) return true;
      else return false;
    },
  },

  created() {
    this.calcularFecha();
    console.log("valor de drawer");
    console.log(this.$store.state.drawer);
  },

  methods: {
    calcularFecha: function () {},
    cambiarValor: function () {
      console.log("cambiando valor");
      this.$store.state.drawer = !this.$store.state.drawer;
      console.log(this.$store.state.drawer);
      console.log(this.$vuetify.breakpoint.mobile);
      console.log(this.$vuetify.breakpoint.mobile);
      console.log(this.$vuetify.breakpoint.width);
    },
    abrirEnlace: function (enlace) {
      window.open(enlace);
    },
    cerrarSesion: function () {
      console.log("cerrando sesion");
      this.$cookie.delete("user");
      this.$cookie.delete("iduser");
      this.$cookie.delete("correo");
      this.$cookie.delete("nombres");
      this.$cookie.delete("apellidos");
      this.$session.destroy();
      var ruta = window.location.origin + window.location.pathname;
      window.location.replace(ruta);
    },
  },
};
</script>

<style>
.data {
  margin-top: 300px;
}

.tema .theme--dark.v-picker__body {
  background: #ffffff;
}

.nav .nav-item a {
  color: #ffffff;
}

.tituloClipp {
  font-family: sans-serif;
  color: rgb(10, 84, 236);
  font-size: xx-large;
}

.colorBoton {
  color: rgb(10, 84, 236);
}

.nav .nav-item a {
  color: #999494;
  font-family: inherit;
}

.navbar-text {
  color: #999494;
  font-family: inherit;
}

.v-image .v-responsive .imgMenu {
  flex: initial;
}

.v-responsive {
  flex: initial;
}
</style>
