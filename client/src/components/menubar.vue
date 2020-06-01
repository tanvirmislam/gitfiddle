<template>
  <div>
    <v-app-bar app clipped-left color="brown lighten-4" height="70">
      <!-- sidebar toggle icon -->
      <v-app-bar-nav-icon
        class="ml-3"
        color="grey darken-3"
        style="background: rgb(61, 61, 61, 0.175)"
        @click.stop="toggle()"
      >
        <span class="ml-5 mr-5 headline">
          <font-awesome-icon icon="code-branch" />
        </span>
      </v-app-bar-nav-icon>

      <!-- title -->
      <v-toolbar-title class="mr-12 align-center">
        <span class="title font-weight-light">{{ getTitle }}</span>
      </v-toolbar-title>

      <v-spacer />

      <!-- connect to git repo button -->
      <v-slide-y-transition>
        <div
          v-if="showConnectToGitRepoButton"
          align="center"
          justify="center"
          class="mr-3"
        >
          <v-dialog v-model="gitInfoPopUp" width="500">
            <template v-slot:activator="{ on }">
              <v-btn fab small color="#72b086" v-on="on">
                <v-icon color="white">mdi-git</v-icon>
              </v-btn>
            </template>

            <v-card class="command">
              <v-card-title class="grey lighten-2 command">
                <strong> Visualize a Git Repo </strong>
              </v-card-title>

              <v-card-text justify="left" class="mt-5">
                <v-text-field
                  v-model="gitUsername"
                  label="Username"
                  :clearable="true"
                  :rules="[rules.required]"
                ></v-text-field>

                <v-text-field
                  v-model="gitRepo"
                  label="Repository Name"
                  :clearable="true"
                  :rules="[rules.required]"
                ></v-text-field>

                <!-- Invalid entry warning -->
                <div
                  v-if="showInvalidGitEntryError"
                  class="mt-4 red--text"
                >
                  <p>Invalid Entry</p>
                </div>

                <v-btn small color="#72b086" class="mt-5 white--text" @click.prevent="connectToGitRepo()">
                  CONNECT
                </v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
      </v-slide-y-transition>

      <!-- reset tree button -->
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

      <!-- drag tips button -->
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

      <!-- supported commands info button -->
      <div align="center" justify="center" class="mr-5">
        <v-dialog v-model="commandsInfoPopUp" width="500">
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
import GitLinker from '../utils/git/linker'

export default {
  data: () => ({
    showDragTipsButton: false,
    showDestroyTreeButton: false,
    showConnectToGitRepoButton: false,
    dragTipsPopUp: false,
    commandsInfoPopUp: false,
    gitInfoPopUp: false,
    gitUsername: undefined,
    gitRepo: undefined,
    showInvalidGitEntryError: false,

    supportedCommandsList: [
      'git branch <name>',
      'git checkout <name>',
      'git checkout -b <name>',
      'git commit',
      'git merge <name>',
      'git rebase <name>',
      'git push',
      'undo'
    ],

    rules: {
      required: value => !!value || 'Required'
    }
  }),

  computed: {
    ...mapGetters([
      'sidebarVisibilityStatus',
      'hasSimulationStarted',
      'tree'
    ]),

    getTitle () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'GitFiddle'
        default:
          return 'GitFiddle: Visualize git branching commands'
      }
    },

    isPreviewTreeAnimationCompleted () {
      return !this.hasSimulationStarted && !this.tree.isAnimated()
    }
  },

  watch: {
    isPreviewTreeAnimationCompleted () {
      this.enableDragTips()
    },

    hasSimulationStarted () {
      this.enableDestroyTreeButton()
      this.enableConnectToGitRepoButton()
    }
  },

  methods: {
    ...mapActions({
      toggle: 'toggleSidebar',
      resetSimulation: 'startSimulation',
      beginTreeCreationFromGit: 'beginTreeCreationFromGit',
      endTreeCreationFromGit: 'endTreeCreationFromGit'
    }),

    promiseForTruth (delay) {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(true), delay)
      })
    },

    async enableDragTips () {
      this.showDragTipsButton = await this.promiseForTruth(500)
    },

    async enableDestroyTreeButton () {
      this.showDestroyTreeButton = await this.promiseForTruth(1000)
    },

    async enableConnectToGitRepoButton () {
      this.showConnectToGitRepoButton = await this.promiseForTruth(1300)
    },

    async connectToGitRepo () {
      if (!this.gitUsername || !this.gitRepo) {
        this.showInvalidGitEntryError = true
        return
      }

      this.beginTreeCreationFromGit()

      this.showInvalidGitEntryError = false
      this.gitInfoPopUp = false

      const gitLinker = new GitLinker(this.gitUsername, this.gitRepo)
      await gitLinker.createTree(this.tree)

      this.endTreeCreationFromGit()
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
