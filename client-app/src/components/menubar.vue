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

        </v-app-bar>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data: () => ({
            
        }),

        computed: {
            getTitle() {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs': return 'GitFiddle';
                    default: return 'GitFiddle: Visualize git branching commands';
                }
            },
        },

        methods: {
            ...mapActions({
                toggle: 'toggleSidebar'
            })
        }
    }
</script>
