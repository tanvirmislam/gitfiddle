<template>
    <v-card class="flex" flat tile>
        <v-card-text class="py-2 white--text text-right">
            <span class="caption mr-2"> @ Tanvir Islam</span>
            <v-btn fab depressed small text href="https://www.linkedin.com/in/tanvirmislam/" target="_blank"> <span class="subtitle-1"> <font-awesome-icon :icon="['fab', 'linkedin']" /> </span> </v-btn>
            <v-btn fab depressed small text href="https://github.com/tanvirmislam" target="_blank"> <span class="subtitle-1"> <font-awesome-icon :icon="['fab', 'github-alt']" /> </span> </v-btn>
        </v-card-text>
    </v-card>
</template>


<script>
    export default {
        data: () => ({

        }),

        methods: {

        }
    }

</script>

<style>
a {
    color: white;
}
</style>
