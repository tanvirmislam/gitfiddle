<template>

    <v-navigation-drawer v-model="status" app clipped flat mobile-break-point color="grey lighten-3" width="400">
        <v-text-field v-model="cmd" label="Command" outlined class="mt-5" @keydown.enter="commandEntered"></v-text-field>
    </v-navigation-drawer>


</template>


<script>
    import { mapActions } from 'vuex';

    export default {
        data: () => ({
            cmd: ''
        }),

        computed: {
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
                console.log('Entered: ' + this.cmd);
                this.setGitCommand(this.cmd);
                console.log('Command set to: ' + this.$store.getters.command);
            }
        },

        
    }

</script>