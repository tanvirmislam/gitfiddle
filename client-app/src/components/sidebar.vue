<template>


    <v-navigation-drawer dark v-model="status" app clipped flat mobile-break-point :width="sidebarWidth" class="commandDrawer">
        
        <div v-bar class="vuebar-element"> 
            <v-list dense>

                <v-subheader>Command History</v-subheader>
                <v-list-item-group>
                    <v-list-item v-for="(commandObj, i) in history" :key="i">
                        <v-list-item-content>

                            <v-row>
                                <v-col>
                                    <span>{{ commandObj.command }}</span>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col align="right">
                                    <span v-if="isBeingProcessed(commandObj)"><font-awesome-icon icon="spinner" pulse /></span>
                                    <span v-if="hasBeenProcessed(commandObj)" class="ml-2"><font-awesome-icon icon="check" /></span>
                                </v-col>
                            </v-row>

                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            
            </v-list>
        </div>

        <v-footer absolute padless color='#363636'>
            <v-text-field v-model="cmd" label="Command" outlined height="40px" class="mt-3 ml-4 mr-4" @keydown.enter="commandEntered"></v-text-field>
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
            commandHandler: new CommandHandler()
        }),

        computed: {
            ...mapGetters([
                'sidebarWidth',
                'tree',
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
            }

        },

        methods: {
            ...mapActions({
                queueGitCommand: 'add'
            }),

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
                    return (commandObj.hasExecuted === false && this.queue.includes(commandObj));
                }
                else {
                    return false;
                }
            },

            hasBeenProcessed(commandObj) {
                if (commandObj !== null) {
                    return (commandObj.hasExecuted === true && !this.queue.includes(commandObj));
                }
                else {
                    return false;
                }
            },

            popHistory() {
                return this.history.pop();
            },

            commandEntered() {
                let commandObj = new Command(this.cmd, null);
                this.queueGitCommand(commandObj);
                this.cmd = '';
            }
        },

        watch: {
            queue() {
                console.log('queue has changed')
                // this.commandHandler.process(this.cmd, this.tree);
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
        background-color: rgba(48, 121, 244,.1);
        margin: 5px 5px 5px 0;
        border-radius: 20px;
        height: calc(100% - 10px);
        display: block;
    }

    .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(48, 121, 244,.3);
    }

    .vb > .vb-dragger:hover > .vb-dragger-styler {
        background-color: rgba(48, 121, 244,.5);
        margin: 0px;
        height: 100%;
    }

    .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(48, 121, 244,.5);
        margin: 0px;
        height: 100%;
    }

    .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(48, 121, 244,.5);
    }

</style>
