<template>
  <div id="app">
    <v-app id="inspire">
      <v-app-bar app clipped-right color="blue-grey" dark>
        <v-toolbar-title>event-lang-online</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main>
        <v-snackbar v-model="snackbar" multi-line top color="red" timeout="-1">
          {{ errorMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn dark text v-bind="attrs" @click="snackbar = false;errorMessage = null">
              Close
            </v-btn>
          </template>
        </v-snackbar>
        <v-row>
          <v-col cols="6">
            <v-card>
              <v-card-title>
                <span class="headline">Code</span>
              </v-card-title>
              <v-card-text>
                <v-textarea :value="code" ref="textarea" dense rows="1"></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="compile">Compile</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card>
              <v-card-title>
                <span class="headline">Compiled JSON</span>
              </v-card-title>
              <v-card-text>
                <div style="display: flex">
                  <v-textarea :value="json" ref="textarea" dense rows="1"/>
                  <v-btn @click="copyJson()" icon>
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </div>
                <json-viewer :value="jsonObject" :expand-depth=5></json-viewer>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-main>

      <v-footer app color="blue-grey" class="white--text">
        <v-spacer></v-spacer>
        <span>&copy; Piotr "stirante" Brzozowski {{ new Date().getFullYear() }}</span>
      </v-footer>
    </v-app>
  </div>
</template>

<style>

.scrollable {
  overflow-y: auto;
  max-height: calc(100vh - 124px);
}
</style>

<script>
import JsonViewer from 'vue-json-viewer'
import compile from "@/compiler/compiler";

export default {
  props: {
    source: String,
  },
  components: {
    JsonViewer
  },
  methods: {
    clearAll() {
      this.snackbar = false;
      this.errorMessage = "";
    },
    copyJson() {
      let element = this.$refs.textarea.$el.querySelector('textarea');
      element.select();
      element.setSelectionRange(0, this.json.length);
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
  computed: {
  },
  data: () => ({
    errorMessage: null,
    snackbar: false,
    code: "if has_tag == \"yes\" then add \"yes\" remove \"no\" end",
    json: "",
    jsonObject: {}
  })
}

</script>
