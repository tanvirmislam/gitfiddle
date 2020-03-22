<template>
    <div id="app">
        <v-app>
            <nav>
                <div> <menubar /> </div>
                <div> <sidebar /> </div>
            </nav>

            <v-content>
                <v-container class="my-4">
                    <router-view></router-view>
                </v-container>
            </v-content>

            <v-divider></v-divider>

            <v-footer dark padless>
                <footer-row />
            </v-footer>
        </v-app>
    </div>
    
</template>

<script>
    import MenuBar from './menubar';
    import SideBar from './sidebar';
    import Footer from './footer';

    export default {
        components: {
            'menubar': MenuBar,
            'sidebar': SideBar,
            'footer-row': Footer
        },

        data: () => ({
            
        }),
        
        created() {
            // this.$vuetify.theme.dark = true
        }
    }
</script>

<style>

</style>
