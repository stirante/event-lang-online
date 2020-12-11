<template>
  <div id="app">
    <v-app id="inspire">
      <v-app-bar app clipped-right color="blue-grey" dark>
        <v-toolbar-title>event-lang-online</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main class="fill-height">
        <v-snackbar v-model="snackbar" multi-line top color="red" timeout="-1">
          {{ errorMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn dark text v-bind="attrs" @click="snackbar = false;errorMessage = null">
              Close
            </v-btn>
          </template>
        </v-snackbar>
        <v-container class="fill-height">
          <v-row class="fill-height">
            <v-col cols="6">
              <v-card class="fill-height">
                <v-card-title>
                  <span class="headline">Code</span>
                </v-card-title>
                <v-card-text>
                  <v-textarea v-model="code" ref="textarea" dense rows="1" auto-grow></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="compile">Compile</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="fill-height">
                <v-card-title>
                  <span class="headline">Compiled JSON</span>
                </v-card-title>
                <v-card-text>
                  <prism id="json" language="json">{{ json }}</prism>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="copyJson">Copy</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <v-footer app color="blue-grey" class="white--text">
        <v-spacer></v-spacer>
        <span>&copy; Piotr "stirante" Brzozowski {{ new Date().getFullYear() }}</span>
      </v-footer>
    </v-app>
  </div>
</template>

<style>

.v-application code {
  background-color: transparent !important;
}

</style>

<script>
import compile from "@/compiler/compiler";
import 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-json'
import Prism from 'vue-prism-component'

export default {
  props: {
    source: String,
  },
  components: {
    Prism
  },
  methods: {
    clearAll() {
      this.snackbar = false;
      this.errorMessage = "";
    },
    copyJson() {
      let node = document.getElementById('json');
      let selection = window.getSelection();
      let range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
    },
    showErrorMessage(msg) {
      this.snackbar = true;
      this.errorMessage = msg;
    },
    compile() {
      this.jsonObject = compile(this.code, this.showErrorMessage);
      this.json = JSON.stringify(this.jsonObject, (key, value) => {
        if (value !== null) return value
      }, 2);
      this.jsonObject = JSON.parse(this.json);
    }
  },
  computed: {},
  data: () => ({
    errorMessage: null,
    snackbar: false,
    code: "if has_tag == \"yes\" then add \"yes\" remove \"no\" end",
    json: "",
    jsonObject: {}
  })
}

</script>
