<template>
    <v-row align="center" justify="center">
        <vue-p5 @setup="setup" @draw="draw"></vue-p5>
    </v-row>
</template>

<script>
    import VueP5 from "vue-p5";
    import { mapGetters } from 'vuex';

    export default {
        data: () => ({
            backgroundColor: 255,
            initStrokeColor: 255,
            finalStrokeColor: 0,
            currentStrokeColor: 255,
            strokeColorAnimDiff: 4,
            fillColor: '#C2E2E2',
            lineColor: '#54BA70',
        }),

        components: {
            "vue-p5": VueP5
        },
        
        created() {

        },
        
        computed: {
            ...mapGetters({
                getTree: 'tree',
                getRoot: 'root',
                getNodeDict: 'nodeDict',
                getNode: 'node'
            }),
        },

        methods: {
            setup(sketch) {
                sketch.createCanvas(800, 800);
                sketch.background(this.backgroundColor);
                sketch.stroke(this.initStrokeColor);
                sketch.noFill();
            },

            draw(sketch) {
                sketch.background(this.backgroundColor);
                
                for (let nodeName in this.getNodeDict) {
                    let node = this.getNodeDict[nodeName];

                    if (node.isAnimated) {
                        this.drawAnimatingNode(sketch, node);
                        break;
                    }
                    else {
                        this.drawStaticNode(sketch, node);

                        if (node.parent !== null && node.parent !== node) {
                            this.drawLineToParent(sketch, node);
                        }
                    }
                }
            },

            drawAnimatingNode(sketch, node) {
                sketch.stroke(this.currentStrokeColor);
                sketch.noFill();
                sketch.ellipse(node.circle.x, node.circle.y, node.circle.r, node.circle.r);

                if (this.currentStrokeColor > this.finalStrokeColor) {
                    this.currentStrokeColor = (this.currentStrokeColor - this.strokeColorAnimDiff) < this.finalStrokeColor ? this.finalStrokeColor : (this.currentStrokeColor - this.strokeColorAnimDiff);
                }
                else {
                    node.isAnimated = false;
                    this.currentStrokeColor = this.initStrokeColor;
                }
            },

            drawStaticNode(sketch, node) {
                sketch.stroke(this.finalStrokeColor);
                sketch.fill(this.fillColor);
                sketch.ellipse(node.circle.x, node.circle.y, node.circle.r, node.circle.r);
            },

            drawLineToParent(sketch, node) {
                sketch.line(node.circle.x, node.circle.y, node.parent.circle.x, node.parent.circle.y);
            }
        }
    }
</script>


<style>

</style>
