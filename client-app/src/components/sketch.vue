<template>
    <div>
    <v-row>
        <div>
            <p> Window width: {{ windowWidth }} </p>
            <p> Window height: {{ windowHeight }} </p>
        </div>
    </v-row>
    
    <v-row align="center" justify="center">
        <vue-p5 @setup="setup" @draw="draw"></vue-p5>
    </v-row>
    </div>
</template>

<script>
    import VueP5 from "vue-p5";
    import { mapGetters } from 'vuex';

    export default {
        data: () => ({
            windowWidth: 0,
            windowHeight: 0,
            backgroundColor: 255,
            initStrokeColor: 255,
            finalStrokeColor: 0,
            currentStrokeColor: 255,
            strokeColorAnimDiff: 20,
            fillColor: '#C2E2E2',
            lineColor: '#54BA70',
        }),

        components: {
            "vue-p5": VueP5
        },
        
        created() {

        },

        mounted() {
            this.$nextTick(function() {
                window.addEventListener('resize', this.getWindowWidth);
                window.addEventListener('resize', this.getWindowHeight);

                //Init
                this.getWindowWidth()
                this.getWindowHeight()
            })
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
            getWindowWidth() {
                this.windowWidth = document.documentElement.clientWidth;
            },

            getWindowHeight() {
                this.windowHeight = document.documentElement.clientHeight;
            },

            windowResized() {
                console.log('resized');
            },

            setup(sketch) {
                sketch.createCanvas(1000, 800);
                sketch.background(this.backgroundColor);
                sketch.stroke(this.initStrokeColor);
                sketch.noFill();
                sketch.angleMode(sketch.RADIANS);
                sketch.ellipseMode(sketch.CENTER);
                sketch.textSize(10);
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
                sketch.ellipse(node.circle.x, node.circle.y, node.circle.d, node.circle.d);

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
                sketch.ellipse(node.circle.x, node.circle.y, node.circle.d, node.circle.d);
                sketch.text(node.name, node.circle.x, node.circle.y);
            },

            drawLineToParent(sketch, node) {
                let angle = this.getAngleBetweenNodes(sketch, node, node.parent);
                
                let x0 = Math.floor(node.circle.x + ( node.circle.r * sketch.cos(angle) ));
                let y0 = Math.floor(node.circle.y - ( node.circle.r * sketch.sin(angle) ));

                let x1 = Math.floor(node.parent.circle.x + ( node.parent.circle.r * sketch.cos(angle + sketch.PI) ));
                let y1 = Math.floor(node.parent.circle.y - ( node.parent.circle.r * sketch.sin(angle + sketch.PI) ));

                sketch.line(x0, y0, x1, y1);
            },

            getAngleBetweenNodes(sketch, node1, node2) {
                let vec1 = sketch.createVector(node1.circle.r, 0);
                let vec2 = sketch.createVector(node2.circle.x - node1.circle.x, node1.circle.y - node2.circle.y);
                
                let angle = vec1.angleBetween(vec2);

                return angle;
            }
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.getWindowWidth);
            window.removeEventListener('resize', this.getWindowHeight);
        }
    }
</script>


<style>

</style>
