<template>
    <div>
        <v-row align="center" justify="center">
            <vue-p5 @setup="setup" @draw="draw"></vue-p5>
        </v-row>

        <v-row v-if="!hasStarted" align="center" justify="center">
            <v-col align="center">
                <v-btn large color="error" @click.prevent="startSim"> Get Started! </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import VueP5 from "vue-p5";
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data: () => ({
            hasStarted: false,
            
            dimensions: {
                windowWidth: 0,
                windowHeight: 0,

                sketchWidth: 1000,
                sketchHeight: 800,
                
                sketchMarginTop: 100,
                sketchMarginBottom: 150,
                sketchMarginLeft: 350,
                sketchMarginRight: 100 
            },

            colors: {
                background: 255,
                initialStroke: 255,
                finalStroke: 0,
                currentStrokeForBeingCreated: 255,
                currentStrokeForBeingDeleted: 0,
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
                this.adjustDimensions(null);
            })
        },
        
        computed: {
            ...mapGetters({
                sidebarWidth: 'sidebarWidth',
                tree: 'tree',
                root: 'root',
                nodeSet: 'nodeSet',
                branchNameToNodeDict: 'branchNameToNodeDict',
                treeInfo: 'treeInfo',
                treeFormatter: 'treeFormatter',
                animationSpeed: 'animationSpeed'
            }),
        },

        watch: {
            gitCommand() {
                
            }
        },

        methods: {
            ...mapActions([
                'setFormatterCanvasWidth',
                'setFormatterCanvasHeight',
                'setAnimationSpeed'
            ]),

            startSim() {
                this.hasStarted = true;
                this.tree.reset();
            },

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

                if (sketch !== undefined && sketch !== null) {
                    sketch.resizeCanvas(this.dimensions.sketchWidth, this.dimensions.sketchHeight);
                }

                this.setFormatterCanvasWidth(this.dimensions.sketchWidth);
                this.setFormatterCanvasHeight(this.dimensions.sketchHeight);

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

                // console.log('Nodes: ');
                // for (let node of this.nodeSet) {
                //     console.log(node.id);
                // }
            },

            draw(sketch) {
                sketch.background(this.colors.background);

                for (let node of this.nodeSet) {
                    if (node.isAnimated) {
                        this.drawAnimatingNode(sketch, node);
                        break;
                    }
                    else {
                        this.drawStaticNode(sketch, node);
                        this.drawLineToParent(sketch, node);
                        
                    }
                }
                
            },

            drawAnimatingNode(sketch, node) {
                if (node.isBeingCreated) {
                    sketch.stroke(this.colors.currentStrokeForBeingCreated);
                    sketch.noFill();
                    sketch.ellipse(node.x, node.y, node.d, node.d);

                    if (this.colors.currentStrokeForBeingCreated > this.colors.finalStroke) {
                        let nextStrokeColor = this.colors.currentStrokeForBeingCreated - this.animationSpeed;
                        this.colors.currentStrokeForBeingCreated = nextStrokeColor < this.colors.finalStroke ? this.colors.finalStroke : nextStrokeColor;
                    }
                    else {
                        node.isAnimated = false;
                        node.isBeingCreated = false;
                        this.colors.currentStrokeForBeingCreated = this.colors.initialStroke;
                    }
                }
                else {
                    sketch.stroke(this.colors.currentStrokeForBeingDeleted);
                    sketch.noFill();
                    sketch.ellipse(node.x, node.y, node.d, node.d);
                    
                    this.drawLineToParent(sketch, node);
                    
                    if (this.colors.currentStrokeForBeingDeleted < this.colors.initialStroke) {
                        let nextStrokeColor = this.colors.currentStrokeForBeingDeleted + this.animationSpeed;
                        this.colors.currentStrokeForBeingDeleted = nextStrokeColor > this.colors.initialStroke ? this.colors.initialStroke : nextStrokeColor;
                    }
                    else {
                        node.isAnimated = false;
                        this.tree.remove(node);
                        this.colors.currentStrokeForBeingDeleted = this.colors.finalStroke;
                    }
                }
            },

            drawStaticNode(sketch, node) {
                sketch.stroke(this.colors.finalStroke);
                sketch.fill(this.colors.fill);
                sketch.ellipse(node.x, node.y, node.d, node.d);

                sketch.fill(this.colors.text);
                sketch.noStroke();
                sketch.text(node.id, node.x, node.y);
            },

            drawLineToParent(sketch, node) {
                if (node === undefined || node === null || node.parent === null || node.parent === node) {
                    return;
                }

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
