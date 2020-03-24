<template>
    <div>
        <v-app-bar app clipped-left color="brown lighten-4" height="70">
            
            <v-app-bar-nav-icon class="ml-3" color="grey darken-3" @click.stop="toggle()">
                <span class="ml-5 mr-5 headline"> <font-awesome-icon icon="code-branch" /> </span>
            </v-app-bar-nav-icon>
            
            <v-toolbar-title class="mr-12 align-center">
                <span class="title font-weight-light">{{ getTitle }}</span>
            </v-toolbar-title>
            
            <v-spacer />

            <div v-if="hasSimulationStarted" align="center" justify="center" class="mr-3">
                <v-btn fab small color="#fd5457" @click.prevent="resetSimulation">
                    <span class="subtitle-1" style="color: white;"> <font-awesome-icon icon="bomb" /> </span>
                </v-btn>
            </div>

            <div align="center" justify="center" class="mr-5">
                <v-dialog v-model="infoPopUp" width="500">
                    <template v-slot:activator="{ on }">
                        <v-btn fab small color="#fcba03" v-on="on">
                            <span class="subtitle-1" style="color: white;"> <font-awesome-icon icon="info" /> </span>
                        </v-btn>
                    </template>

                    <v-card class="command">
                        <v-card-title class="grey lighten-2 command">
                            <strong> GitFiddle Commands </strong>
                        </v-card-title>

                        <v-card-text justify="left" class="mt-5">
                        <ul>
                            <li v-for="(command, index) in supportedCommandsList" :key="index">
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
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data: () => ({
            infoPopUp: false,
            supportedCommandsList: [
                'git branch <name>',
                'git checkout <name>',
                'git checkout -b <name>',
                'git commit',
                'git merge <name>',
                'git rebase <name>',
                'undo'
            ]
        }),

        computed: {
            ...mapGetters({
                hasSimulationStarted: 'hasStarted',
                tree: 'tree'
            }),

            getTitle() {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return 'GitFiddle';
                    default: return 'GitFiddle: Visualize git branching commands';
                }
            },
        },

        methods: {
            ...mapActions({
                toggle: 'toggleSidebar',
                resetSimulation: 'startSimulation'
            })
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Ubuntu+Mono&display=swap');

    .command {
        font-family: 'Ubuntu Mono';
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
