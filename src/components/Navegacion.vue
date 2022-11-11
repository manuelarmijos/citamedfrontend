<template>
  <v-navigation-drawer app v-model="drawermodel" temporary>
    <v-list>
      <v-list-item class="d-flex justify-center">
        <v-list-item-avatar>
          <v-img :src="iconDoctor"></v-img>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <center>
              {{
                this.$store.state.dataUser.nombres +
                " " +
                this.$store.state.dataUser.apellidos
              }}
            </center>
          </v-list-item-title>
          <v-list-item-subtitle
            ><center>
              {{ this.$store.state.dataUser.correo }}
            </center></v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav dense>
      <div v-for="(link, i) in this.$store.state.items" :key="link.title">
        <v-list-item
          v-if="!link.hijo"
          :key="i"
          :to="link.vista"
          class="v-list-item"
        >
          <v-list-item-icon>
            <v-icon color="rgb(9 84 236)"> {{ link.icono }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="primary--text">
              {{ link.modulo }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group v-else :key="link.text" no-action class="submenu">
          <template v-slot:activator style="padding: 0">
            <v-list-item style="padding: 0">
              <v-list-item-icon>
                <v-icon color="rgb(9 84 236)"> {{ link.icono }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class="primary--text">
                  {{ link.modulo }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-item
            v-for="sublink in link.hijo"
            :to="sublink.vista"
            :key="sublink.text"
            style="padding-left: 40"
          >
            <v-list-item-icon>
              <v-icon color="rgb(9 84 236)"> {{ link.icono }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="primary--text">
                {{ sublink.modulo }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
var iconD = require("../assets/icond1.jpg");
export default {
  setup() {},
  data() {
    return {
      selectedItem: 1,
      drawer: this.$store.state.drawer,
      mini: true,
      nombre: "",
      correo: "",
      url_sistema1: process.env.VUE_APP_URL_SISTEMA1,
      url_img_user: process.env.VUE_APP_IMG_USUARIOS,
      iconDoctor: iconD,
    };
  },
  created() {
    this.drawer = this.$store.state.drawer;
    console.log("ruta");
    console.log(this.$router.history.current.path);
    if (this.$router.history.current.path == "/") {
      console.log("la ruta es /");
      if (this.$store.state.items[0].hijo) {
        this.$router
          .push(this.$store.state.items[0].hijo[0].vista)
          .catch(() => {});
      }
      this.$router.push(this.$store.state.items[0].vista).catch(() => {});
    } else {
      console.log("no es ");
      console.log(this.$router.history.current.path);
    }
  },
  computed: {
    mobile: function () {
      if (this.$vuetify.breakpoint.width < 900) return false;
      else return true;
    },
    drawermodel: {
      get() {
        return this.$store.state.drawer;
      },
      set(value) {
        this.$store.commit("updateMessage", value);
      },
    },
  },
  watch: {
    $route(to, from) {
      console.log("cambiando de ruta");
      console.log(to);
      console.log(from);
      console.log(this.$router.resolve(from.fullPath));
      var ruta = this.$router.resolve(from.fullPath);
      console.log(ruta.resolved.name);
      if (ruta.resolved.name == null) console.log("Módulo no existe");
      if (ruta.resolved.fullPath == "/")
        if (this.$store.state.items[0].hijo) {
          this.$router
            .push(this.$store.state.items[0].hijo[0].vista)
            .catch(() => {});
        } else
          this.$router.push(this.$store.state.items[0].vista).catch(() => {});
    },
  },
};
</script>

<style>
.sub .v-list--nav .v-list-item {
  padding: 0 0px;
}

.sub {
  padding: 0 0px;
}

.v-list--nav .v-list-item {
  padding: 0 8px;
}

.v-list-group__header .v-list-item .v-list-item--link .theme--light {
  padding: 0;
}

.v-application--is-ltr
  .v-list--dense.v-list--nav
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item {
  padding-left: 50px;
}
</style>
