<template>
  <v-app>
    <div v-if="!verifacado">
      <v-tabs fixed-tabs color="deep-purple accent-4" center v-model="tab">
        <v-tab href="#administrador"> Administrador </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="administrador">
          <v-card
            class="mx-auto mt-10 title"
            elevation="24"
            rounded
            :max-width="$vuetify.breakpoint.width < 900 ? '300' : '380'"
          >
            <v-progress-linear
              :active="loadingSesion"
              color="deep-purple accent-4"
              :indeterminate="loadingSesion"
              rounded
              height="6"
            ></v-progress-linear>

            <v-img :src="imgS"></v-img>
            <div style="text-align: end">
              <v-card-title>Iniciar Sesión</v-card-title>
            </div>

            <v-card-text>
              <v-form ref="form" v-model="valido" lazy-validation>
                <v-text-field
                  v-model="name"
                  :counter="10"
                  :rules="nameRules"
                  label="Usuario"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="pasword"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="paswordRules"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Contraseña"
                  hint="Al menos 8 carácteres"
                  counter
                  @click:append="show1 = !show1"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="deep-purple lighten-2"
                text
                @click="validateUser"
                :disabled="!valid"
              >
                Ingresar
              </v-btn>
              <v-btn color="deep-purple lighten-2" text @click="reset">
                Limpiar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

      <!--  <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in itemsTabs" :key="item">
          <v-card color="basil" flat>
            <v-card-text>{{ item }}</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items> -->
    </div>
    <div v-else-if="!verificarModulo">
      <BlockUI :message="mensaje" :html="html">
        <v-progress-linear
          :active="loadingT"
          :indeterminate="loadingT"
          absolute
          bottom
          color="deep-purple accent-4"
        ></v-progress-linear>
      </BlockUI>
    </div>
    <div v-else>
      <Navegacion></Navegacion>
      <Menu></Menu>
      <v-main>
        <div class="principal">
          <router-view></router-view>
        </div>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import Menu from "./components/Menu.vue";
import Navegacion from "./components/Navegacion.vue";
var imgSesion = require("./assets/doctor4.png");
var imgSesionPaciente = require("./assets/paciente.png");
// eslint-disable-next-line no-unused-vars
var jwt = require("jsonwebtoken");

export default {
  name: "App",
  components: {
    Menu,
    Navegacion,
  },

  data() {
    return {
      verifacado: false,
      verificarModulo: false,
      loading: false,
      loadingSesion: false,
      r: [],
      alert: true,
      cipherString1: "",
      mensaje: "Cargando el acceso a los módulos...",
      loadingT: true,
      html: "Verificando módulos asignados",
      config: "",
      configU: "",
      isValidUrl: false,
      selection: 1,
      imgS: imgSesion,
      valid: true,
      name: "",
      nameRules: [
        (v) => !!v || "Usuario requerido",
        (v) =>
          (v && v.length <= 10) ||
          "El usuario debe tener menos de 10 caracteres",
      ],
      pasword: "",
      paswordRules: [
        (v) => !!v || "Contraseña requerida",
        (v) => (v && v.length >= 5) || "Mínimo 5 caracteres",
      ],
      select: null,
      show1: false,
      items: ["Item 1", "Item 2", "Item 3", "Item 4"],
      checkbox: false,
      data: [],
      itemsTabs: ["Iniciar sesión", "Registro pasiente"],
      tab: null,
      imgP: imgSesionPaciente,
      dialog: false,
      valido: true,
      editedItem: {
        nombres: "",
        apellidos: "",
        cedula: "",
        correo: "",
        direccion: "",
        nombreRol: "",
        celular: "",
        usuario: "",
        contrasenia: "",
      },
      defaultItem: {
        nombres: "",
        apellidos: "",
        cedula: "",
        correo: "",
        direccion: "",
        nombreRol: "",
        celular: "",
        usuario: "",
        contrasenia: "",
      },
      editedIndex: -1,
    };
  },
  created() {
    console.log("creando");
    this.data = [{ id: 222, imei: 1212 }];

    if (this.$cookie.get("iduser") && this.$cookie.get("iduser") != "") {
      this.$session.start();
      this.$session.set("iduser", this.$cookie.get("iduser"));
      this.verifacado = true;

      this.$store.state.dataUser = {
        nombres: this.$cookie.get("nombres"),
        apellidos: this.$cookie.get("apellidos"),
        correo: this.$cookie.get("correo"),
      };

      this.verificarModulos();
    }

    /* this.$store.state.items.push(
      {
        text: "Voucher",
        icon: "mdi-folder",
        ruta: "/ReporteVoucher",
        hijo: [
          { text: "reporte", icon: "mdi-folder", ruta: "/ReporteVoucher" },
          { text: "reporte1", icon: "mdi-folder", ruta: "/ReporteVoucher1" },
          { text: "reporte2", icon: "mdi-folder", ruta: "/ReporteVoucher2" },
        ],
      },
      { text: "Voucher 1", icon: "mdi-folder", ruta: "/ReporteVoucher1" },
      { text: "Voucher 2", icon: "mdi-folder", ruta: "/ReporteVoucher2" },
      { text: "Voucher 3", icon: "mdi-folder", ruta: "/ReporteVoucher3" }
    ); */

    /*  if (this.isValidUrl) this.dataUsuario(); */
    console.log("finalizao todo");
  },
  methods: {
    validateUser() {
      if (this.$refs.form.validate()) {
        console.log("verificando usuario");
        this.loadingSesion = true;
        this.dataUsuario();
      } else {
        this.openNotification(
          "",
          2,
          "Datos incorrectos",
          "Estimado usuario, por favor ingrese todos los datos solicitados"
        );
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    openNotification(position = null, color, titulo, texto) {
      var c;
      if (color === 1) c = "primary";
      else if (color == 2) c = "danger";
      else if (color == 3) c = "success";
      else if (color == 4) c = "warn";
      else c = "rgb(59,222,200)";

      const noti = this.$vs.notification({
        progress: "auto",
        color: c,
        position,
        title: titulo,
        text: texto,
      });
      console.log(noti);
    },

    async dataUsuario() {
      /*   var self = this;
             var token = jwt.sign({ usuario:  this.name, password:  this.pasword }, '123456');
   console.log(token)

   var decoded = jwt.verify(token, '123456');
   console.log(decoded)

      const params = new URLSearchParams();
      params.append("token", token); */

      var self = this;
      const params = new URLSearchParams();
      params.append("usuario", this.name);
      params.append("clave", this.pasword);

      let headersList = {
        Accept: "/",
        version: "1.0.0",
        "Content-Type": "application/x-www-form-urlencoded",
      };

      /* et bodyContent = "usuario=ricardo&clave=12345&idPlataforma=1"; */

      let reqOptions = {
        url:
          process.env.VUE_APP_URL_SERVICIO +
          process.env.VUE_APP_RECURSO_DATOS_USUARIO,
        method: "POST",
        headers: headersList,
        data: params,
      };

      await this.axios(reqOptions)
        .then(function (response) {
          console.log(response.data);
          if (response.data.en == 1) {
            if (response.data.usuario) {
              if (response.data.usuario.habilitado.data[0] == 1) {
                self.loadingSesion = false;
                console.log(response.data.usuario);
                self.$store.state.dataUser = response.data.usuario;
                self.$cookie.set("user", response.data.usuario.nombres);
                self.$cookie.set(
                  "iduser",
                  response.data.usuario.idAdministrador
                );
                self.$cookie.set("correo", response.data.usuario.correo);
                self.$cookie.set("nombres", response.data.usuario.nombres);
                self.$cookie.set("apellidos", response.data.usuario.apellidos);
                self.$session.start();
                self.$session.set(
                  "iduser",
                  response.data.usuario.idAdministrador
                );
                self.openNotification(
                  "",
                  3,
                  "Bienvenido estimado usuario",
                  "Bienveido al sistema de citas online estimado usuario"
                );
                self.verifacado = true;

                self.verificarModulos();
              } else {
                self.loadingSesion = false;
                console.log("usuario bloqueado");
                self.mensaje =
                  "El usuario se encuentra bloquedo, por favor comuniquese con el administrador";
                self.html = "Usuario bloqueado";
                self.openNotification(
                  "",
                  2,
                  "Sin módulos asignados",
                  "Estimado usuario no tiene asignados módulos, Por favor comuníquese con el administrador"
                );
                self.deleteSesion();
              }
            } else {
              self.loadingSesion = false;
              console.log("no existe usuario");
              self.mensaje =
                "No se pudo verificar sus datos, por favor comuniquese con el administrador";
              self.html = "Sin acceso";
              self.openNotification(
                "",
                2,
                "Sin módulos asignados",
                "Estimado usuario no tiene asignados módulos, Por favor comuníquese con el administrador"
              );
              self.deleteSesion();
            }
          } else {
            self.loadingSesion = false;
            console.log("no se encontro usuario");
            self.mensaje = response.data.m;
            self.html = "No se pudo obtener la información";
            self.openNotification(
              "",
              2,
              "Usuario mal ingresado",
              response.data.m
            );
            self.deleteSesion();
          }
        })
        .catch(function (error) {
          self.loadingSesion = false;
          console.log(error);
          console.log("fallo el recurso user");
          self.mensaje =
            "Ocurrio un error, Por favor comuniquese con el administrador";
          self.html = "No se pudo obtener la información";
          self.openNotification(
            "",
            2,
            "Ocurrió un error",
            "Estimado usuario se presento un error, Por favor inténtelo más tarde"
          );
          self.deleteSesion();
        })
        .finally(() => {});
    },

    async verificarModulos() {
      var self = this;
      const params = new URLSearchParams();
      params.append("idAdministrador", this.$cookie.get("iduser"));
      params.append("idPlataforma", 1);

      let headersList = {
        Accept: "/",
        version: "1.0.0",
        "Access-Control-Allow-Origin": "true",
        "Content-Type": "application/x-www-form-urlencoded",
      };

      let reqOptions = {
        url:
          process.env.VUE_APP_URL_SERVICIO +
          process.env.VUE_APP_RECURSO_MODULOS,
        method: "POST",
        headers: headersList,
        data: params,
      };
      await this.axios(reqOptions)
        .then(function (response) {
          console.log(response);
          if (response.data.en == 1) {
            if (response.data.modulos.length > 0) {
              self.$store.state.items = response.data.modulos;
              self.verificarModulo = true;
              //self.$cookie.set("data", JSON.stringify(response.data.modulos));
            } else {
              console.log("No tiene accesos a ningun míodulo");
              console.log("No tiene accesos a ningun míodulo");
              self.mensaje =
                "No tiene asignado este módulo, por favor comuniquese con el administrador";
              self.html = "Sin acceso";
              self.openNotification(
                "",
                2,
                "Sin módulos asignados",
                "Estimado usuario no tiene asignados módulos, Por favor comuníquese con el administrador"
              );
              self.deleteSesion();
            }
          } else {
            console.log("No tiene accesos a ningun módulo");
            self.mensaje =
              "No tiene asignado este módulo, por favor comuniquese con el administrador";
            self.html = "Sin acceso";
            self.openNotification(
              "",
              2,
              "Ocurrió un error",
              "Estimado usuario se presento un error, Por favor inténtelo más tarde"
            );
            self.deleteSesion();
          }
        })
        .catch(function (error) {
          console.log(error);
          console.log("fallo el recurso 1");
          self.mensaje =
            "Ocurrio un error, Por favor comuniquese con el administrador";
          self.html = "No se pudo obtener la información";
          self.openNotification(
            "",
            2,
            "Ocurrió un error",
            "Estimado usuario se presento un error, Por favor inténtelo más tarde"
          );
          self.deleteSesion();
        })
        .finally(() => {
          self.loading = false;
          console.log("SESION VERIFICACION--------------");
        });
    },

    deleteSesion: function () {
      console.log("elimnado cookies");
      this.$cookie.delete("user");
      this.$cookie.delete("iduser");
      this.$cookie.delete("correo");
      this.$cookie.delete("nombres");
      this.$cookie.delete("apellidos");
      this.$session.destroy();
    },

    registro: function () {
      console.log("registrando");
      this.dialog = true;
    },
    close() {
      console.log("eliminando");
      if (this.$refs.form) this.$refs.form.reset();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
  computed: {
    mobile: function () {
      if (this.$vuetify.breakpoint.width < 900) return true;
      else return false;
    },
  },
};
</script>

<style>
.principal {
  padding-top: 5px;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
}

html {
  background: #ffffff !important;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.title .v-card__title {
  color: #673ab7;
  text-align: center;
}

.v-tabs-items {
  height: 100%;
}
</style>
