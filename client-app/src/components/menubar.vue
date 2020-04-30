<template>
  <div>
    <v-app-bar app clipped-left color="brown lighten-4" height="70">
      <v-app-bar-nav-icon
        class="ml-3"
        color="grey darken-3"
        @click.stop="toggle()"
      >
        <span class="ml-5 mr-5 headline">
          <font-awesome-icon icon="code-branch" />
        </span>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="mr-12 align-center">
        <span class="title font-weight-light">{{ getTitle }}</span>
      </v-toolbar-title>

      <v-spacer />

      <v-slide-y-transition>
        <div
          v-if="showDestroyTreeButton"
          align="center"
          justify="center"
          class="mr-3"
        >
          <v-btn fab small color="#fd5457" @click.prevent="resetSimulation">
            <span class="subtitle-1" style="color: white;">
              <font-awesome-icon icon="bomb" />
            </span>
          </v-btn>
        </div>
      </v-slide-y-transition>

      <v-slide-x-transition>
        <div
          v-if="!hasSimulationStarted && showDragTipsButton"
          align="center"
          justify="center"
          class="mr-3"
        >
          <v-dialog v-model="dragTipsPopUp" width="500">
            <template v-slot:activator="{ on }">
              <v-btn fab small color="#4f97f0" v-on="on">
                <span class="subtitle-1" style="color: white;">
                  <font-awesome-icon icon="lightbulb" />
                </span>
              </v-btn>
            </template>

            <v-card class="command">
              <v-card-title class="grey lighten-2 command">
                <strong> Did you know? </strong>
              </v-card-title>

              <v-card-text justify="left" class="mt-5">
                You can click and drag (or double tap and drag) to reposition
                the nodes :)
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
      </v-slide-x-transition>

      <div align="center" justify="center" class="mr-5">
        <v-dialog v-model="infoPopUp" width="500">
          <template v-slot:activator="{ on }">
            <v-btn fab small color="#fcba03" v-on="on">
              <span class="subtitle-1" style="color: white;">
                <font-awesome-icon icon="info" />
              </span>
            </v-btn>
          </template>

          <v-card class="command">
            <v-card-title class="grey lighten-2 command">
              <strong> GitFiddle Commands </strong>
            </v-card-title>

            <v-card-text justify="left" class="mt-5">
              <ul>
                <li
                  v-for="(command, index) in supportedCommandsList"
                  :key="index"
                >
                  {{ command }}
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({
    showDestroyTreeButton: false,
    showDragTipsButton: false,
    dragTipsPopUp: false,
    infoPopUp: false,
    supportedCommandsList: [
      'git branch <name>',
      'git checkout <name>',
      'git checkout -b <name>',
      'git commit',
      'git merge <name>',
      'git rebase <name>',
      'git push',
      'undo'
    ]
  }),

  computed: {
    ...mapGetters({
      hasSimulationStarted: 'hasSimulationStarted',
      tree: 'tree'
    }),

    getTitle () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'GitFiddle'
        default:
          return 'GitFiddle: Visualize git branching commands'
      }
    },

    isPreviewTreeAnimationCompleted: {
      get () {
        return !this.hasSimulationStarted && !this.tree.isAnimated()
      }
    }
  },

  watch: {
    isPreviewTreeAnimationCompleted () {
      this.enableDragTips()
    },

    hasSimulationStarted () {
      this.enableDestroyTreeButton()
    }
  },

  methods: {
    ...mapActions({
      toggle: 'toggleSidebar',
      resetSimulation: 'startSimulation'
    }),

    async enableDragTips () {
      const promiseToEnableButton = new Promise((resolve, reject) => {
        setTimeout(() => resolve(true), 500)
      })
      this.showDragTipsButton = await promiseToEnableButton
    },

    async enableDestroyTreeButton () {
      const promiseToEnableButton = new Promise((resolve, reject) => {
        setTimeout(() => resolve(true), 1000)
      })
      this.showDestroyTreeButton = await promiseToEnableButton
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Ubuntu+Mono&display=swap");

.command {
  font-family: "Ubuntu Mono";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
