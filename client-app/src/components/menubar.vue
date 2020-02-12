<template>
    <div>
        <v-app-bar app clipped-left color="primary" height="60">
            
            <v-app-bar-nav-icon @click.stop="toggle()">
                <span class="ml-2 mr-3"> <font-awesome-icon icon="list" /> </span>
            </v-app-bar-nav-icon>
            
            <v-toolbar-title class="mr-12 align-center">
                <span class="title">{{ getTitle }}</span>
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
