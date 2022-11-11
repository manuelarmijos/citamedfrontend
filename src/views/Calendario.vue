<template>
  <div v-if="acceso">
    <h2 class="pl-2" style="color: '#9575cd'">Calendario</h2>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Hoy
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right> mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Día</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Semana</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Mes</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 Días</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mx-2"
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  fab
                  small
                  color="#1976d2"
                  icon
                >
                  <v-icon cir> mdi-plus </v-icon>
                </v-btn>
              </template>
              <v-card class="mx-auto">
                <v-card-title :class="colorS">
                  <h2 class="text-h4 white--text font-weight-light">
                    {{ formTitle }}
                  </h2>
                </v-card-title>
                <v-card-text>
                  <v-form ref="form" v-model="valid" lazy-validatio>
                    <v-text-field
                      v-model="editedItem.nombre"
                      :counter="50"
                      label="Nombre Cita"
                      required
                      :rules="nameRules"
                    ></v-text-field>
                    <!--  <v-select
                      v-model="paciente"
                      :items="items"
                      label="Paciente"
                      required
                      :rules="selectRules"
                    ></v-select> -->
                    <v-select
                      v-model="editedItem.especialidad"
                      :items="especialidades"
                      item-text="nombre"
                      item-value="idEspecialidad"
                      return-object
                      label="Especialidad"
                      required
                      :rules="selectRules"
                      no-data-text="No existen especialidades"
                      @change="selectEspecialidad"
                    ></v-select>
                    <v-select
                      v-model="editedItem.paciente"
                      :items="pacientes"
                      item-text="nombres"
                      item-value="idPaciente"
                      return-object
                      label="Paciente"
                      required
                      :rules="selectRules"
                      no-data-text="No existen pacientes"
                    ></v-select>
                    <v-menu
                      ref="menud"
                      v-model="menud"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="timed"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.timed"
                          label="Duración Cita"
                          prepend-icon="mdi-clock-time-four-outline"
                          hint="Hora:Minuto:Segundo formato"
                          readonly
                          required
                          :rules="fraccionRequired"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menud"
                        v-model="editedItem.timed"
                        required
                        full-width
                        @click:minute="$refs.menud.save(timed)"
                        format="24hr"
                      ></v-time-picker>
                    </v-menu>

                    <v-row>
                      <v-col>
                        <v-menu
                          ref="menu1"
                          v-model="menu1"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.date"
                              label="Fecha Cita"
                              prepend-icon="mdi-calendar"
                              hint="Año-Mes-Día formato"
                              persistent-hint
                              v-bind="attrs"
                              required
                              :rules="fraccionRequired"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.date"
                            no-title
                            locale="es-Es"
                            @input="menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col>
                        <v-menu
                          ref="menu"
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="time"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.time"
                              label="Hora Cita"
                              prepend-icon="mdi-clock-time-four-outline"
                              hint="Hora:Minuto:Segundo formato"
                              readonly
                              required
                              :rules="fraccionRequired"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu2"
                            v-model="editedItem.time"
                            full-width
                            @click:minute="$refs.menu.save(time)"
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-form>
                  <!--  <p>Calendario</p>
                  <div class="text--primary">EVENTO CALENDARIO</div> -->
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    text
                    color="teal accent-4"
                    :disabled="!valid"
                    @click="guardarCita"
                  >
                    Guardar
                  </v-btn>
                  <v-btn text color="teal accent-4" @click="cerrar">
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="red"
                    icon
                    v-if="editedIndex > -1"
                    @click="deleteItem"
                  >
                    <v-icon small> mdi-delete </v-icon>
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
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
            locale="es-Es"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <!-- <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card> -->
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
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
import { mdiPlusCircleOutline } from "@mdi/js";
import moment from "moment";
var qs = require("qs");

export default {
  data: () => ({
    acceso: true,
    reveal: false,
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Mes",
      week: "Semana",
      day: "Día",
      "4day": "4 Días",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),

    events: [],
    colorS: "purple lighten-2",
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
    nombre: "",
    nameRules: [
      (v) => !!v || "Nombre requerido",
      (v) =>
        (v && v.length <= 50) || "El usuario debe tener menos de 51 caracteres",
    ],
    fraccionRequired: [(v) => !!v || "Campo requerido"],
    limit: 24,
    duracion: 1,
    maxRules: [
      (v) => !!v || "Duración requerida",
      (v) => {
        //console.log(v)
        if (v > 24) return "Duración Máxima 24";
        else if (v <= 0) return "Duración Mínima 1";
        else return false;
        /* if (this.duracion > this.limit) {
            return 'Error'
          } */
      },
    ],
    selectRules: [(v) => !!v || "Paciente requerido"],
    valid: true,
    iconAdd: mdiPlusCircleOutline,
    dialog: false,
    especialidad: null,
    paciente: null,
    especialidades: [],
    pacientes: [],
    menu1: false,
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("H:mm:ss"),
    timed: "01:00:00",
    menu2: false,
    menud: false,
    ex3: { label: "thumb-color", val: 50, color: "red" },
    defaultItem: {
      nombre: "",
      especialidad: [],
      paciente: [],
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("H:mm:ss"),
      timed: "01:00:00",
    },
    editedItem: {
      nombre: "",
      especialidad: [],
      paciente: [],
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("H:mm:ss"),
      timed: "01:00:00",
    },
    editedIndex: -1,
    dialogDelete: false,
    fechaInicio: "",
    fechaFin: "",
  }),
  mounted() {
    var modulo = this.$store.state.items.find((item) => item.vista === "citas");
    console.log("resultado de busqueda");
    if (!modulo) {
      this.acceso = false;
    } else this.$refs.calendar.checkChange();
  },
  created() {
    this.getEspecialidad();
    this.getPacientes();
    /*   var config = {
      method: "post",
      url:
        process.env.VUE_APP_URL_SERVICIO +
        process.env.VUE_APP_RECURSO_CONSUMO_VOUCHER_UNITARIO,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    }; */
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      console.log("evento click");
      console.log(event);
      this.editedIndex = event.idCita;
      this.editedItem = {
        nombre: event.name,
        especialidad: { idEspecialidad: event.idEspecialidad },
        paciente: { idPaciente: event.idPaciente },
        date: moment(event.fecha).format("YYYY-MM-DD"),
        time: event.hora,
        timed: event.fraccion,
        idCita: event.idCita,
      };
      console.log(this.editedItem);
      this.dialog = true;
      console.log(nativeEvent);
      /* const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      }; */

      /* if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation(); */
    },
    updateRange({ start, end }) {
      console.log("Dentro de update fecha");
      console.log(start);
      console.log(this.fechaInicio);
      this.fechaInicio = start;
      this.fechaFin = end;
      const events = [];
      const events1 = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        });
      }

      events1.push({
        name: "prueba reunion",
        start: "2022-04-10 13:15:00",
        end: "2022-04-10 15:00:00",
        color: "indigo",
        timed: false,
      });

      console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));
      console.log(
        moment("2022-04-09T23:35:06.000Z").format("YYYY-MM-DD H:mm:ss")
      );

      var config = {
        method: "post",
        url:
          process.env.VUE_APP_URL_SERVICIO + process.env.VUE_APP_RECURSO_CITAS,
        headers: {
          version: "1.0.0",
        },
      };

      let global = this;
      let data = [];
      this.axios(config)
        .then(function (response) {
          console.log(response);
          if (response.data.en == 1) {
            response.data.citas.forEach(function (element) {
              data.push({
                name: element.name,
                start: moment(element.start).format("YYYY-MM-DD H:mm:ss"),
                end: moment(element.end).format("YYYY-MM-DD H:mm:ss"),
                color: element.color,
                timed: false,
                idEspecialidad: element.idEspecialidad,
                idPaciente: element.idPaciente,
                fecha: element.fecha,
                hora: element.hora,
                fraccion: element.fraccion,
                idCita: element.idCita,
              });
            });
            console.log("finalizo for each");
            global.events = data;
          } else {
            this.openNotification(
              "",
              2,
              "Sin citas",
              "Estimado usuario, no se encontraron citas"
            );
          }
        })
        .catch(function (error) {
          console.log(error);
          this.openNotification(
            "",
            2,
            "Sin citas",
            "Estimado usuario, no se encontraron citas"
          );
        });

      console.log(events);
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    guardarCita() {
      if (this.editedIndex > -1) {
        if (this.$refs.form.validate()) {
          console.log("editando");

          let global = this;
          console.log(this.editedItem);
          var dataE = qs.stringify({
            idEspecialidad: global.editedItem.especialidad.idEspecialidad,
            idAdministrador: global.$session.get("iduser"),
            idPaciente: global.editedItem.paciente.idPaciente,
            fecha: global.editedItem.date,
            fraccion: global.editedItem.timed,
            nombre: global.editedItem.nombre,
            hora: global.editedItem.time,
            idCita: global.editedItem.idCita,
          });
          var configE = {
            method: "post",
            url:
              process.env.VUE_APP_URL_SERVICIO +
              process.env.VUE_APP_RECURSO_UPDATE_CITAS,
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
                global.cerrar();
                console.log("fecha es igual a ");
                console.log(global.fechaInicio);
                var fechaInicio = global.fechaInicio;
                var fechaFin = global.fechaFin;
                global.updateRange({ start: fechaInicio, end: fechaFin });
              } else {
                global.openNotification(
                  "",
                  2,
                  "No se pudo registrar",
                  "Estimado usuario, hubo un error al intentar registrar la cita"
                );
              }
            })
            .catch(function (error) {
              console.log(error);
              global.openNotification(
                "",
                2,
                "No se pudo registrar1",
                "Estimado usuario, hubo un error al intentar registrar la cita"
              );
            });
        }
      } else {
        if (this.$refs.form.validate()) {
          console.log("verificando cita");
          console.log("datos verificados");
          this.colorS = "purple lighten-2";
          console.log(this.especialidad);
          let global = this;
          console.log(this.editedItem);
          var data = qs.stringify({
            idEspecialidad: global.editedItem.especialidad.idEspecialidad,
            idPaciente: global.editedItem.paciente.idPaciente,
            idAdministrador: global.$session.get("iduser"),
            fecha: global.editedItem.date,
            fraccion: global.editedItem.timed,
            nombre: global.editedItem.nombre,
            hora: global.editedItem.time,
          });
          var config = {
            method: "post",
            url:
              process.env.VUE_APP_URL_SERVICIO +
              process.env.VUE_APP_RECURSO_CITAS_REGISTRAR,
            headers: {
              version: "1.0.0",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
          };

          this.axios(config)
            .then(function (response) {
              if (response.data.en == 1) {
                global.openNotification(
                  "",
                  3,
                  "Registrado correctamente",
                  "Estimado usuario, el registro fue exitoso"
                );
                global.cerrar();
                console.log("fecha es igual a ");
                console.log(global.fechaInicio);
                var fechaInicio = global.fechaInicio;
                var fechaFin = global.fechaFin;
                global.updateRange({ start: fechaInicio, end: fechaFin });
              } else {
                global.openNotification(
                  "",
                  2,
                  "No se pudo registrar",
                  "Estimado usuario, hubo un error al intentar registrar la cita"
                );
              }
            })
            .catch(function (error) {
              console.log(error);
              global.openNotification(
                "",
                2,
                "No se pudo registrar1",
                "Estimado usuario, hubo un error al intentar registrar la cita"
              );
            });
        } else {
          this.openNotification(
            "",
            2,
            "Datos incorrectos",
            "Estimado usuario, por favor ingrese todos los datos solicitados"
          );
        }
      }
    },
    cerrar() {
      this.dialog = false;
      this.colorS = "purple lighten-2";
      this.$refs.form.reset();
      //this.editedItem = this.defaultItem;
      //this.editedIndex = -1;
      console.log(this.editedItem);
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    getEspecialidad() {
      var config = {
        method: "post",
        url:
          process.env.VUE_APP_URL_SERVICIO +
          process.env.VUE_APP_RECURSO_GET_ESPECIALIDADES,
        headers: {
          version: "1.0.0",
        },
      };
      let global = this;
      this.axios(config)
        .then(function (response) {
          if (response.data.en == 1) {
            /*  response.data.citas.forEach(function (element) {
              data.push({
                name: element.name,
                start: moment(element.start).format("YYYY-MM-DD H:mm:ss"),
                end: moment(element.end).format("YYYY-MM-DD H:mm:ss"),
                color: element.color,
                timed: false,
              });
            }); */
            global.especialidades = response.data.especialidades;
          } /*  else {
            this.openNotification(
              "",
              2,
              "Sin citas",
              "Estimado usuario, no se encontraron citas"
            );
          } */
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getPacientes() {
      var config = {
        method: "post",
        url:
          process.env.VUE_APP_URL_SERVICIO +
          process.env.VUE_APP_RECURSO_GET_PACIENTES,
        headers: {
          version: "1.0.0",
        },
      };
      let global = this;
      this.axios(config)
        .then(function (response) {
          if (response.data.en == 1) {
            /*  response.data.citas.forEach(function (element) {
              data.push({
                name: element.name,
                start: moment(element.start).format("YYYY-MM-DD H:mm:ss"),
                end: moment(element.end).format("YYYY-MM-DD H:mm:ss"),
                color: element.color,
                timed: false,
              });
            }); */
            global.pacientes = response.data.pacientes;
          } /*  else {
            this.openNotification(
              "",
              2,
              "Sin citas",
              "Estimado usuario, no se encontraron citas"
            );
          } */
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    selectEspecialidad: function (a) {
      console.log("cambio");
      console.log(a);
      this.colorS = a.color;
    },
    validar() {
      console.log("valid");
      this.especialidad = { idEspecialidad: 2 };
    },

    deleteItem() {
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      /* this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }); */
    },
    deleteItemConfirm() {
      console.log("eliminado");
      console.log(this.editedItem);

      let global = this;
      console.log(this.editedItem);
      var dataE = qs.stringify({
        idAdministrador: global.$session.get("iduser"),
        idCita: global.editedItem.idCita,
      });
      var configE = {
        method: "post",
        url:
          process.env.VUE_APP_URL_SERVICIO +
          process.env.VUE_APP_RECURSO_ELIMINAR_CITAS,
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
            global.cerrar();
            console.log("fecha es igual a ");
            console.log(global.fechaInicio);
            var fechaInicio = global.fechaInicio;
            var fechaFin = global.fechaFin;
            global.updateRange({ start: fechaInicio, end: fechaFin });
            global.closeDelete();
          } else {
            global.openNotification(
              "",
              2,
              "No se pudo registrar",
              "Estimado usuario, hubo un error al intentar registrar la cita"
            );
          }
        })
        .catch(function (error) {
          console.log(error);
          global.openNotification(
            "",
            2,
            "No se pudo registrar1",
            "Estimado usuario, hubo un error al intentar registrar la cita"
          );
        });
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
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Cita" : "Editar Cita";
    },
  },
};
</script>
