<template>
  <v-navigation-drawer
    id="commandNavigationDrawer"
    v-model="sidebarVisibilityStatus"
    :width="sidebarWidth"
    dark
    app
    clipped
    flat
    mobile-break-point
  >
    <v-container class="overflow-y-auto">
      <v-row>
        <div id="commandHistory">
          <v-list dense class="mb-10">
            <v-subheader>Command History</v-subheader>
            <div class="mb-2">
              <v-list-item v-for="(commandObj, index) in history" :key="index">
                <v-list-item-content>
                  <v-row>
                    <v-col>
                      <span>{{ commandObj.command }}</span>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </div>

            <v-divider></v-divider>
            <v-divider></v-divider>

            <v-subheader class="mt-2">Execution Queue</v-subheader>
            <div class="mb-2">
              <v-list-item v-for="(commandObj, index) in queue" :key="index">
                <v-list-item-content>
                  <v-row>
                    <v-col cols="8">
                      <span> {{ commandObj.command }} </span>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col align="right">
                      <span> <font-awesome-icon icon="spinner" pulse /> </span>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </div>

            <v-divider></v-divider>
            <v-divider></v-divider>

            <div id="endOfCommandList" class="py-12"></div>
          </v-list>
        </div>
      </v-row>

      <v-row class="mt-10">
        <v-footer absolute padless color="#363636" class="mt-3">
          <v-text-field
            v-model="cmd"
            ref="command"
            label="Command"
            :rules="[isAcceptingCommands, isCommandValid]"
            @keydown.enter="commandEntered"
            outlined
            height="40px"
            class="ml-4 mr-4"
            autocomplete="off"
          ></v-text-field>
        </v-footer>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Command from '../utils/command/command'
import CommandHandler from '../utils/command/command-handler'

export default {
  data: () => ({
    cmd: '',
    commandHandler: new CommandHandler(),
    isNoCommandEnteredYet: true,
    wasLastCommandValid: false,
    showPreviousCommandAtIndex: undefined,
    isExecutingCommand: false
  }),

  mounted () {
    // Press up-down arrows to get previous commands in the box
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        this.onArrowUpKeyPress()
      }
    })

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        this.onArrowDownKeyPress()
      }
    })
  },

  computed: {
    ...mapGetters([
      'sidebarVisibilityStatus',
      'sidebarWidth',
      'tree',
      'hasSimulationStarted',
      'queue',
      'history'
    ]),

    treeRoot () {
      return this.tree.root
    }
  },

  watch: {
    treeRoot () {
      this.flushGitCommandQueue()
      this.flushGitCommandHistory()
    },

    queue () {
      this.scrollCommandsIntoView()

      // Start execution if nothing is currently being executed
      if (!this.isExecutingCommand) {
        this.executeQueuedCommands()
      }
    }
  },

  methods: {
    ...mapActions({
      queueGitCommand: 'queueCommand',
      flushGitCommandQueue: 'flushQueue',
      flushGitCommandHistory: 'flushHistory'
    }),

    isAcceptingCommands () {
      return this.hasSimulationStarted || 'Start the Simulation'
    },

    isCommandValid () {
      return (
        this.isNoCommandEnteredYet ||
        this.wasLastCommandValid ||
        'Invalid Command'
      )
    },

    commandStrToObj (commandStr) {
      let commandObj = null

      for (let i = 0; i < this.history.length; ++i) {
        if (this.history[i].command === commandStr) {
          commandObj = this.history[i]
          break
        }
      }

      return commandObj
    },

    commandEntered () {
      if (!this.hasSimulationStarted) {
        return
      }

      const commands = this.commandHandler.getValidCommands(this.cmd.trim())

      if (commands.length === 0) {
        this.wasLastCommandValid = false
      } else {
        this.wasLastCommandValid = true
        for (let i = 0; i < commands.length; ++i) {
          const commandObj = new Command(commands[i])
          this.queueGitCommand(commandObj)
        }
      }

      this.cmd = ''
      this.isNoCommandEnteredYet = false
      this.showPreviousCommandAtIndex = undefined
    },

    executeQueuedCommands () {
      // Lock
      this.isExecutingCommand = true

      while (this.queue[0] !== undefined) {
        // Wait until tree animation is finished
        if (this.tree.isAnimated()) {
          window.setTimeout(this.executeQueuedCommands, 100)
          return
        } else {
          const top = this.queue[0]
          const status = this.commandHandler.process(
            top,
            this.tree,
            this.history
          )

          if (!status) {
            // Flush queued commands
            this.wasLastCommandValid = false
            this.flushGitCommandQueue()
          } else {
            // Deque a command
            this.dequeCommand()
          }
        }
      }

      // Unlock
      this.isExecutingCommand = false
    },

    dequeCommand () {
      // Wait until tree animation is finished
      if (this.tree.isAnimated()) {
        window.setTimeout(this.dequeCommand, 100)
      } else {
        // Deque
        this.queue.shift()
      }
    },

    scrollCommandsIntoView () {
      this.$el.querySelector('#endOfCommandList').scrollIntoView()
    },

    onArrowUpKeyPress () {
      if (this.sidebarVisibilityStatus && this.history.length > 0) {
        if (this.showPreviousCommandAtIndex === undefined) {
          this.showPreviousCommandAtIndex = this.history.length - 1
        } else {
          this.showPreviousCommandAtIndex = Math.max(
            0,
            this.showPreviousCommandAtIndex - 1
          )
        }

        this.cmd = this.history[this.showPreviousCommandAtIndex].command
      }
    },

    onArrowDownKeyPress () {
      if (this.sidebarVisibilityStatus && this.history.length > 0) {
        if (this.showPreviousCommandAtIndex === undefined) {
          return
        } else {
          this.showPreviousCommandAtIndex = Math.min(
            this.history.length - 1,
            this.showPreviousCommandAtIndex + 1
          )
        }
        this.cmd = this.history[this.showPreviousCommandAtIndex].command
      }
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Ubuntu+Mono&display=swap");

#commandNavigationDrawer {
  font-family: "Ubuntu Mono";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#commandHistory {
  height: 100%;
  width: 100%;
}

.v-list-item {
  max-height: 10px;
}

#user {
  font-family: "Ubuntu Mono";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
}
</style>
