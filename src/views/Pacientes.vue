<template>
  <div v-if="acceso" class="admin">
    <h2 class="pl-2" style="color: '#9575cd'">Pacientes</h2>
    <v-card elevation="5">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <div>
        <v-data-table
          :headers="headers"
          :items="desserts"
          sort-by="calories"
          class="elevation-1"
          height="65vh"
          style="width: 100%"
          fixed-header
          :loading="loading"
          loading-text="Cargando... Por favor espere"
          no-data-text="No existen resultados"
          no-results-text="No se encontraron resultados"
          :footer-props="{
            'items-per-page-text': 'Datos por página',
            'items-per-page-options': pagina,
          }"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <!--   <v-toolbar-title>Administradores</v-toolbar-title> -->
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="success"
                    class="ma-2 white--text"
                    v-bind="attrs"
                    v-on="on"
                    dark
                  >
                    Nuevo Registro
                    <v-icon right dark>{{ iconNuevo }}</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="purple lighten-2">
                    <h2 class="text-h4 white--text font-weight-light">
                      {{ formTitle }}
                    </h2>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="6">
                            <v-text-field
                              v-model="editedItem.nombres"
                              :rules="nombreValidacion"
                              label="Nombres"
                              :counter="15"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <v-text-field
                              v-model="editedItem.apellidos"
                              label="Apellidos"
                              :rules="nombreValidacion"
                              :counter="15"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <v-text-field
                              v-model="editedItem.cedula"
                              label="Cédula"
                              :rules="cedulaValidacion"
                              :counter="10"
                              type="number"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <v-text-field
                              v-model="editedItem.direccion"
                              label="Dirección"
                              :rules="direccionValidacion"
                              :counter="30"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <v-text-field
                              v-model="editedItem.celular"
                              label="Teléfono"
                              :rules="telefonoValidacion"
                              :counter="15"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <v-text-field
                              v-model="editedItem.correo"
                              label="Correo"
                              :rules="correoValidacion"
                              :counter="30"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <v-text-field
                              v-model="editedItem.usuario"
                              label="Usuario"
                              :rules="usuarioValidacion"
                              :counter="10"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <v-text-field
                              type="password"
                              v-model="editedItem.contrasenia"
                              label="Contraseña"
                              :rules="contraseñaValidacion"
                              :counter="100"
                              @click="onLimpiarContra"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="purple lighten-2" text @click="close"
                      ><v-icon>{{ iconCerrar }}</v-icon>
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="purple lighten-2"
                      text
                      @click="save"
                      :disabled="!valid"
                      ><v-icon>{{ iconGuardar }}</v-icon>
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Estas seguro de eliminar el registro seleccionado
                    ?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >Aceptar</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn color="primary" icon>
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn color="red" icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </v-btn>
          </template>
          <!--  <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template> -->
        </v-data-table>
      </div>
    </v-card>
  </div>
  <div v-else>
    <center>
      <h2>
        No tiene acceso a este módulo, por favor cominíquese con el
        administrador
      </h2>
    </center>
  </div>
</template>

<script>
import { mdiCloseCircleOutline } from "@mdi/js";
import { mdiContentSaveOutline } from "@mdi/js";
import { mdiAccountMultiplePlusOutline } from "@mdi/js";
var qs = require("qs");
export default {
  data: () => ({
    acceso: true,
    dialog: false,
    loading: true,
    valid: true,
    dialogDelete: false,
    search: "",
    pagina: [10, 20, 30, -1],
    headers: [
      {
        text: "Nombres",
        align: "start",
        sortable: true,
        value: "nombres",
      },
      { text: "Apellidos", value: "apellidos" },
      { text: "Cédula", value: "cedula" },
      { text: "Correo", value: "correo" },
      { text: "Dirección", value: "direccion" },
      { text: "Teléfono", value: "celular" },
      { text: "Usuario", value: "usuario" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      nombres: "",
      apellidos: "",
      cedula: "",
      correo: "",
      direccion: "",
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
      celular: "",
      usuario: "",
      contrasenia: "",
    },
    nombreValidacion: [
      (v) => !!v || "Los nombres son requeridos",
      (v) =>
        (v && v.length <= 15) || "El nombre debe tener menos de 16 caracteres",
    ],
    usuarioValidacion: [
      (v) => !!v || "El usuario es requerido",
      (v) =>
        (v && v.length >= 5) || "El usuario debe tener mímino 5 caracteres",
    ],
    contraseñaValidacion: [
      (v) => !!v || "La contraseña es requerida",
      (v) =>
        (v && v.length >= 5) || "La contraseña debe tener mínimo 5 caracteres",
    ],
    cedulaValidacion: [
      (v) => !!v || "La cédula es requerida",
      (v) => (v && v.length == 10) || "La cédula debe tener 10 caracteres",
    ],
    direccionValidacion: [
      (v) => !!v || "La dirección es requerida",
      (v) =>
        (v && v.length <= 30) ||
        "La dirección debe tener menos de 31 caracteres",
    ],
    telefonoValidacion: [
      (v) => !!v || "El teléfono es requerido",
      (v) =>
        (v && v.length <= 15) ||
        "El teléfono debe tener menos de 16 caracteres",
    ],
    correoValidacion: [
      (v) => !!v || "E-mail is requerido",
      (v) => /.+@.+\..+/.test(v) || "El email debe ser válido",
    ],
    select: [],
    iconCerrar: mdiCloseCircleOutline,
    iconGuardar: mdiContentSaveOutline,
    iconNuevo: mdiAccountMultiplePlusOutline,
  }),

  mounted() {
    var modulo = this.$store.state.items.find(
      (item) => item.vista === "administrador"
    );
    console.log("resultado de busqueda");
    if (!modulo) {
      this.acceso = false;
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Registro" : "Editar";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      var config = {
        method: "post",
        url:
          process.env.VUE_APP_URL_SERVICIO +
          process.env.VUE_APP_RECURSO_GET_PACIENTES_TODOS,
        headers: {
          version: "1.0.0",
        },
      };
      let global = this;
      this.axios(config)
        .then(function (response) {
          if (response.data.en == 1) {
            global.desserts = response.data.pacientes;
            global.loading = false;
          } else {
            global.openNotification(
              "",
              2,
              "Sin pacientes",
              "Estimado usuario, no se encontraron pacientes"
            );
            global.loading = false;
          }
        })
        .catch(function (error) {
          console.log(error);
          global.openNotification(
            "",
            2,
            "Sin pacientes",
            "Estimado usuario, no se encontraron pacientes"
          );
          global.loading = false;
        });
    },

    editItem(item) {
      console.log(item);
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //this.desserts.splice(this.editedIndex, 1);
      var globalE = this;

      var data = qs.stringify({
        idPaciente: globalE.editedItem.idPaciente,
      });
      console.log(data);
      var config = {
        method: "post",
        url:
          process.env.VUE_APP_URL_SERVICIO +
          process.env.VUE_APP_RECURSO_ELIMINAR_PACIENTE,
        headers: {
          version: "1.0.0",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      this.axios(config)
        .then(function (response) {
          if (response.data.en == 1) {
            globalE.openNotification(
              "",
              3,
              "Registrado correctamente",
              "Estimado usuario, el registro fue exitoso"
            );
            globalE.close();
            globalE.initialize();
          } else {
            globalE.openNotification(
              "",
              2,
              "No se pudo registrar",
              "Estimado usuario, hubo un error al intentar registrar la cita"
            );
          }
        })
        .catch(function (error) {
          console.log(error);
          globalE.openNotification(
            "",
            2,
            "No se pudo registrar",
            "Estimado usuario, hubo un error al intentar registrar la cita"
          );
        });
      this.closeDelete();
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

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        if (this.$refs.form.validate()) {
          console.log("editando");
          console.log(this.editedItem);

          var global = this;

          var dataE = qs.stringify({
            usuario: global.editedItem.usuario,
            contrasenia: global.editedItem.contrasenia,
            nombres: global.editedItem.nombres,
            apellidos: global.editedItem.apellidos,
            celular: global.editedItem.celular,
            cedula: global.editedItem.cedula,
            direccion: global.editedItem.direccion,
            idRegistro: 1,
            correo: global.editedItem.correo,
            cambioPassword: global.editedItem.cambioPassword
              ? global.editedItem.cambioPassword
              : -1,
            idPaciente: global.editedItem.idPaciente,
          });
          console.log(dataE);
          var configE = {
            method: "post",
            url:
              process.env.VUE_APP_URL_SERVICIO +
              process.env.VUE_APP_RECURSO_UPDATE_PACIENTES,
            headers: {
              version: "1.0.0",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: dataE,
          };

          this.axios(configE)
            .then(function (response) {
              if (response.data.en == 1) {
                global.openNotification(
                  "",
                  3,
                  "Registrado correctamente",
                  "Estimado usuario, el registro fue exitoso"
                );
                global.close();
                global.initialize();
              } else {
                global.openNotification(
                  "",
                  2,
                  "No se pudo registrar",
                  "Estimado usuario, hubo un error al intentar registrar al paciente"
                );
              }
            })
            .catch(function (error) {
              console.log(error);
              global.openNotification(
                "",
                2,
                "No se pudo registrar",
                "Estimado usuario, hubo un error al intentar registrar al paciente"
              );
            });
          //Object.assign(this.desserts[this.editedIndex], this.editedItem);
        }
      } else {
        if (this.$refs.form.validate()) {
          console.log("creando");
          console.log(this.editedItem);
          var globalE = this;

          var data = qs.stringify({
            usuario: globalE.editedItem.usuario,
            contrasenia: globalE.editedItem.contrasenia,
            nombres: globalE.editedItem.nombres,
            apellidos: globalE.editedItem.apellidos,
            celular: globalE.editedItem.celular,
            cedula: globalE.editedItem.cedula,
            direccion: globalE.editedItem.direccion,
            idRegistro: 1,
            correo: globalE.editedItem.correo,
          });
          console.log(data);
          var config = {
            method: "post",
            url:
              process.env.VUE_APP_URL_SERVICIO +
              process.env.VUE_APP_RECURSO_CREAR_PACIENTES,
            headers: {
              version: "1.0.0",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
          };

          this.axios(config)
            .then(function (response) {
              if (response.data.en == 1) {
                globalE.openNotification(
                  "",
                  3,
                  "Registrado correctamente",
                  "Estimado usuario, el registro fue exitoso"
                );
                globalE.close();
                globalE.initialize();
              } else {
                globalE.openNotification(
                  "",
                  2,
                  "No se pudo registrar",
                  "Estimado usuario, hubo un error al intentar registrar al paciente"
                );
              }
            })
            .catch(function (error) {
              console.log(error);
              globalE.openNotification(
                "",
                2,
                "No se pudo registrar",
                "Estimado usuario, hubo un error al intentar registrar al paciente"
              );
            });
        } else {
          console.log("creando con error de form");
          console.log(this.editedItem);
        }
      }
      /* this.close(); */
    },

    validate() {
      this.$refs.form.validate();
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
    onLimpiarContra() {
      console.log(this.editedItem);
      this.editedItem.cambioPassword = 1;
      this.editedItem.contrasenia = "";
    },
  },
};
</script>

<style>
.admin {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.text-title {
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  color: #7f4fdc;
  font-family: inherit;
}
</style>
