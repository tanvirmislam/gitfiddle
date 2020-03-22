<template>


    <v-navigation-drawer dark v-model="status" app clipped flat mobile-break-point :width="sidebarWidth" class="commandDrawer">
        
        <div v-bar class="vuebar-element"> 
            <v-list dense>

                <v-subheader>Command History</v-subheader>
                <v-list-item-group class="mb-10">
                    <v-list-item v-for="(commandObj, i) in history" :key="i">
                        <v-list-item-content>

                            <v-row>
                                <v-col cols=8>
                                    <span>{{ commandObj.command }}</span>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col align="right">
                                    <span v-if="isBeingProcessed(commandObj)"><font-awesome-icon icon="spinner" pulse /></span>
                                    <span v-if="hasBeenProcessed(commandObj)" class="ml-2 mr-2"><font-awesome-icon icon="check" /></span>
                                </v-col>
                            </v-row>

                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            
            </v-list>
        </div>

        <v-footer absolute padless color='#363636'>
            <v-text-field v-model="cmd" label="Command" :rules="[isAcceptingCommands, isCommandValid]" @keydown.enter="commandEntered" outlined height="40px" class="ml-4 mr-4" autocomplete="off"></v-text-field>
        </v-footer>
        
    </v-navigation-drawer>

</template>


<script>
    import { mapGetters, mapActions } from 'vuex';
    import Command from '../store/git-tree-modules/command';
    import CommandHandler from '../store/git-tree-modules/command-handler';

    export default {
        data: () => ({
            cmd: '',
            commandHandler: new CommandHandler(),
            isNoCommandEntered: true,
            wasLastCommandValid: false
        }),

        computed: {
            ...mapGetters([
                'sidebarWidth',
                'tree',
                'queue',
                'history',
                'hasStarted'
            ]),

            status: {
                get () {
                    return this.$store.getters.sidebarVisibilityStatus;
                },
                set(val) {
                    return val;
                }
            }

        },

        methods: {
            ...mapActions({
                queueGitCommand: 'queueCommand'
            }),

            isAcceptingCommands() {
                return this.hasStarted || 'Start the Simulation';
            },

            isCommandValid() {
                return (this.isNoCommandEntered || this.wasLastCommandValid) || 'Invalid Command';
            },

            commandStrToObj(commandStr) {
                let commandObj = null;

                for (let i = 0; i < this.history.length; ++i) {
                    if (this.history[i].command === commandStr) {
                        commandObj = this.history[i];
                        break;
                    }
                }

                return commandObj;
            },

            isBeingProcessed(commandObj) {
                if (commandObj !== null) {
                    return (commandObj.hasExecuted === false);
                }
                else {
                    return false;
                }
            },

            hasBeenProcessed(commandObj) {
                if (commandObj !== null) {
                    return (commandObj.hasExecuted === true);
                }
                else {
                    return false;
                }
            },

            commandEntered() {
                if (this.hasStarted) {
                    let commands = this.commandHandler.chopMergedCommand(this.cmd.trim());
                    
                    for (let i = 0; i < commands.length; ++i) {
                        let commandObj = new Command(commands[i]);
                        this.queueGitCommand(commandObj);
                    }
                    
                    this.cmd = '';
                }
            }
        },

        watch: {
            queue() {
                while (this.queue[0] !== undefined) {
                    let top = this.queue.shift();
                    let status = this.commandHandler.process(top, this.tree, this.history);
                    this.wasLastCommandValid = status;
                    this.isNoCommandEntered = false;
                }
            }
        }
    }

</script>


<style>
    @import url('https://fonts.googleapis.com/css?family=Ubuntu+Mono&display=swap');

    .commandDrawer {
        font-family: 'Ubuntu Mono';
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .vuebar-element {
        height: 100%;
        width: 100%;
    }


    .vb > .vb-dragger {
        z-index: 10;
        width: 12px;
        right: 0;
    }

    .vb > .vb-dragger > .vb-dragger-styler {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transform: rotate3d(0,0,0,0);
        transform: rotate3d(0,0,0,0);
        -webkit-transition:
            background-color 100ms ease-out,
            margin 100ms ease-out,
            height 100ms ease-out;
        transition:
            background-color 100ms ease-out,
            margin 100ms ease-out,
            height 100ms ease-out;
        background-color: rgba(197, 65, 65, 0.678);
        margin: 5px 5px 5px 0;
        border-radius: 20px;
        height: calc(100% - 10px);
        display: block;
    }

    .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(197, 65, 65, 0.678);
    }

    .vb > .vb-dragger:hover > .vb-dragger-styler {
        background-color: rgba(197, 65, 65, 0.678);
        margin: 0px;
        height: 100%;
    }

    .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(197, 65, 65, 0.678);
        margin: 0px;
        height: 100%;
    }

    .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(197, 65, 65, 0.678);
    }

</style>
