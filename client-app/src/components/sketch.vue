<template>
    <v-row align="center" justify="center">
        <vue-p5 @setup="setup" @draw="draw"></vue-p5>
    </v-row>
</template>

<script>
    import VueP5 from "vue-p5";
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data: () => ({
            dimensions: {
                windowWidth: 0,
                windowHeight: 0,

                sketchWidth: 1000,
                sketchHeight: 800,
                
                sketchMarginTop: 100,
                sketchMarginBottom: 0,
                sketchMarginLeft: 350,
                sketchMarginRight: 100 
            },

            colors: {
                background: 255,
                initialStroke: 255,
                finalStroke: 0,
                currentStroke: 255,
                strokeAnimationDiff: 20,
                fill: '#DCF0EB',
                line: 0,
                text: '#C13719'
            }
        }),

        components: {
            "vue-p5": VueP5
        },
        
        created() {

        },

        mounted() {
            this.$nextTick(function() {
                // window.addEventListener('resize', this.adjustDimensions);
                this.adjustDimensions();
            })
        },
        
        computed: {
            ...mapGetters({
                sidebarWidth: 'sidebarWidth',
                tree: 'tree',
                root: 'root',
                treeInfo: 'treeInfo',
                treeFormatter: 'treeFormatter',
                nodeDict: 'nameToNodeDict',
                gitCommand: 'command'
            }),
        },

        watch: {
            gitCommand(newVal, oldVal) {
                
            }
        },

        methods: {
            ...mapActions([
                'setCanvasWidth',
                'setCanvasHeight'
            ]),

            adjustDimensions(sketch) {
                if (this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm') {
                    this.dimensions.sketchMarginLeft = 10;
                    this.dimensions.sketchMarginRight = 10;
                }
                else {
                    this.dimensions.sketchMarginLeft = this.sidebarWidth + 50;
                    this.dimensions.sketchMarginRight = 50;
                }

                this.dimensions.windowWidth = document.documentElement.clientWidth;
                this.dimensions.windowHeight = document.documentElement.clientHeight;

                this.dimensions.sketchWidth = this.dimensions.windowWidth - this.dimensions.sketchMarginLeft - this.dimensions.sketchMarginRight;
                this.dimensions.sketchHeight = this.dimensions.windowHeight - this.dimensions.sketchMarginTop - this.dimensions.sketchMarginBottom;

                sketch.resizeCanvas(this.dimensions.sketchWidth, this.dimensions.sketchHeight);
                
                this.setCanvasWidth(this.dimensions.sketchWidth);
                this.setCanvasHeight(this.dimensions.sketchHeight);

                this.tree.adjust();
            },

            setup(sketch) {
                sketch.createCanvas(this.dimensions.sketchWidth, this.dimensions.sketchHeight);
                this.adjustDimensions(sketch);

                sketch.background(this.colors.background);
                sketch.stroke(this.colors.initialStroke);
                sketch.noFill();
                
                sketch.angleMode(sketch.RADIANS);
                sketch.ellipseMode(sketch.CENTER);
                
                sketch.textSize(10);
                sketch.textAlign(sketch.CENTER, sketch.CENTER);

                window.addEventListener('resize', () => {
                    console.log('windowResized');
                    this.adjustDimensions(sketch);
                });
            },

            draw(sketch) {
                sketch.background(this.colors.background);
                
                for (let nodeName in this.nodeDict) {
                    let node = this.nodeDict[nodeName];

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
                sketch.stroke(this.colors.currentStroke);
                sketch.noFill();
                sketch.ellipse(node.x, node.y, node.d, node.d);

                if (this.colors.currentStroke > this.colors.finalStroke) {
                    this.colors.currentStroke = (this.colors.currentStroke - this.colors.strokeAnimationDiff) < this.colors.finalStroke ? this.colors.finalStroke : (this.colors.currentStroke - this.colors.strokeAnimationDiff);
                }
                else {
                    node.isAnimated = false;
                    this.colors.currentStroke = this.colors.initialStroke;
                }
            },

            drawStaticNode(sketch, node) {
                sketch.stroke(this.colors.finalStroke);
                sketch.fill(this.colors.fill);
                sketch.ellipse(node.x, node.y, node.d, node.d);

                sketch.fill(this.colors.text);
                sketch.noStroke();
                sketch.text(node.name, node.x, node.y);
            },

            drawLineToParent(sketch, node) {
                let angle = this.getAngleBetweenNodes(sketch, node, node.parent);
                
                let x0 = Math.floor(node.x + ( node.r * sketch.cos(angle) ));
                let y0 = Math.floor(node.y - ( node.r * sketch.sin(angle) ));

                let x1 = Math.floor(node.parent.x + ( node.parent.r * sketch.cos(angle + sketch.PI) ));
                let y1 = Math.floor(node.parent.y - ( node.parent.r * sketch.sin(angle + sketch.PI) ));

                sketch.stroke(this.colors.line);
                sketch.line(x0, y0, x1, y1);
            },

            getAngleBetweenNodes(sketch, node1, node2) {
                let vec1 = sketch.createVector(node1.r, 0);
                let vec2 = sketch.createVector(node2.x - node1.x, node1.y - node2.y);
                
                let angle = vec1.angleBetween(vec2);

                return angle;
            }
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.readWindowWidth);
            window.removeEventListener('resize', this.readWindowHeight);
        }
    }
</script>


<style>

</style>
