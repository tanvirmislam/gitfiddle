<template>


    <v-navigation-drawer dark v-model="status" app clipped flat mobile-break-point :width="sidebarWidth" class="commandNavigationDrawer" ref="drawer">
        <v-container class="overflow-y-auto commandContainer">
            <v-row>
                <div class="commadHistory">
                    <v-list dense class="mb-10">

                    <v-subheader>Command History</v-subheader>
                    <v-list-item-group class="mb-2">
                        <v-list-item v-for="(commandObj, i) in history" :key="i">
                            <v-list-item-content>

                                <v-row>
                                    <v-col cols=8>
                                        <span>{{ commandObj.command }}</span>
                                    </v-col>
                                </v-row>

                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>

                    <v-divider></v-divider>
                    <v-divider></v-divider>

                    <v-subheader class="mt-2">Execution Queue</v-subheader>
                    <v-list-item-group class="mb-2">
                        <v-list-item v-for="(commandObj, i) in queue" :key="i">
                            <v-list-item-content>

                                <v-row>
                                    <v-col cols=8>
                                        <span>{{ commandObj.command }}</span>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col align="right">
                                        <span> <font-awesome-icon icon="spinner" pulse /> </span>
                                    </v-col>
                                </v-row>

                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>

                    <v-divider></v-divider>
                    <v-divider></v-divider>
                    
                    </v-list>
                </div>
            </v-row>

            <v-row class="mt-10">
                 <v-footer absolute padless color='#363636' class='mt-3'>
                    <v-text-field v-model="cmd" label="Command" :rules="[isAcceptingCommands, isCommandValid]" @keydown.enter="commandEntered" outlined height="40px" class="ml-4 mr-4" autocomplete="off"></v-text-field>
                </v-footer>
            </v-row>            
        </v-container>
        

       
        
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
                'hasStarted',
                'queue',
                'history'
            ]),

            status: {
                get () {
                    return this.$store.getters.sidebarVisibilityStatus;
                },
                set(val) {
                    return val;
                }
            },

            treeRoot: {
                get() {
                    return this.$store.getters.tree.root;
                }
            }
        },

        methods: {
            ...mapActions({
                queueGitCommand: 'queueCommand',
                flushGitCommandQueue: 'flushQueue',
                flushGitCommandHistory: 'flushHistory'
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
                    let commands = this.commandHandler.getValidCommands(this.cmd.trim());
                    
                    if (commands.length === 0) {
                        this.wasLastCommandValid = false;
                    }
                    else {
                        this.wasLastCommandValid = true;
                        for (let i = 0; i < commands.length; ++i) {
                            let commandObj = new Command(commands[i]);
                            this.queueGitCommand(commandObj);
                        }
                    }
                    
                    this.cmd = '';
                    this.isNoCommandEntered = false;
                }
            },

            executeQueuedCommands() {
                while (this.queue[0] !== undefined) {
                    if (this.tree.isAnimated()) {
                        window.setTimeout(this.executeQueuedCommands, 100);
                        break;
                    }
                    else {
                        let top = this.queue[0];
                        let status = this.commandHandler.process(top, this.tree, this.history);

                        if (!status) {
                            this.wasLastCommandValid = false;
                            this.flushGitCommandQueue();
                        }
                        else {
                            this.removeAQueuedCommand();
                        }
                    }
                }
            },

            removeAQueuedCommand() {
                if (this.tree.isAnimated()) {
                    window.setTimeout(this.removeAQueuedCommand, 100);
                }
                else {
                    this.queue.shift();
                }
            }
        },

        watch: {
            treeRoot() {
                this.flushGitCommandQueue();
                this.flushGitCommandHistory();
            },

            queue() {
                this.executeQueuedCommands();
            }
        }
    }

</script>


<style>
    @import url('https://fonts.googleapis.com/css?family=Ubuntu+Mono&display=swap');

    .commandNavigationDrawer {
        font-family: 'Ubuntu Mono';
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .commadHistory {
        height: 100%;
        width: 100%;
    }

</style>
