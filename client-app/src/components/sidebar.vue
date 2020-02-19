<template>


    <v-navigation-drawer dark v-model="status" app clipped flat mobile-break-point :width="sidebarWidth" class="commandDrawer">
        
        <div v-bar class="vuebar-element"> 
            <v-list dense>
                <v-subheader>Command History</v-subheader>
                <v-list-item-group>
                    <v-list-item v-for="(cmd, i) in history" :key="i">
                        <v-list-item-content>
                            <div>
                                <span>{{ cmd }}</span>
                                <span v-if="isBeingProcessed(cmd)" class="ml-2"><font-awesome-icon icon="spinner" pulse /></span>
                                <span v-if="hasBeenProcessed(cmd)" class="ml-2"><font-awesome-icon icon="check" /></span>
                            </div>
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
            },

            gitCommand: {
                get() {
                    return this.$store.getters.command;
                },
                set(val) {
                    return val;
                }
            }
        },

        methods: {
            ...mapActions({
                addGitCommand: 'add',
                popGitCommand: 'pop',
                isBeingProcessed: 'isBeingProcessed',
                hasBeenProcessed: 'hasBeenProcessed'
            }),

            commandEntered() {
                this.addGitCommand(new Command(this.cmd, null));
                // this.commandHandler.process(this.cmd, this.tree);
                this.cmd = '';
            }
        },

        
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
