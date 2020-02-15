<template>

    <v-navigation-drawer v-model="status" app clipped flat mobile-break-point color="grey lighten-3" :width="sidebarWidth">
        <v-text-field v-model="cmd" label="Command" outlined class="mt-5" @keydown.enter="commandEntered"></v-text-field>
    </v-navigation-drawer>


</template>


<script>
    import { mapGetters, mapActions } from 'vuex';
    import CommandHandler from '../store/tree-modules/command-handler';

    export default {
        data: () => ({
            cmd: '',
            commandHandler: new CommandHandler()
        }),

        computed: {
            ...mapGetters([
                'sidebarWidth',
                'tree'
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
                setGitCommand: 'setCommand'
            }),

            commandEntered() {
                console.log('\nCommand entered: ' + this.cmd);
                this.setGitCommand(this.cmd);
                this.commandHandler.process(this.cmd, this.tree);
                this.cmd = '';
            }
        },

        
    }

</script>