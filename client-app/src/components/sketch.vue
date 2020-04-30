<template>
  <div>
    <v-row align="center" justify="center">
      <vue-p5
        @setup="setup"
        @draw="draw"
        @mousepressed="mousePressed"
        @mousereleased="mouseReleased"
        @touchstarted="touchStarted"
        @touchended="touchEnded"
      ></vue-p5>
    </v-row>

    <v-row v-if="!hasSimulationStarted" align="center" justify="center">
      <v-col align="center">
        <v-btn medium color="error" @click.prevent="startSimulation">
          Launch
          <span class="subtitle-1 ml-1" style="color: white;">
            <font-awesome-icon icon="rocket" />
          </span>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import VueP5 from 'vue-p5'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'vue-p5': VueP5
  },

  data: () => ({
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
      deletedFill: '#e0210b',
      line: 0,
      parentIndicatorCircle: '#bd3417',
      text: '#bd3417'
    },

    mouseOnNode: undefined,
    isDragging: false
  }),

  mounted () {
    this.$nextTick(function () {
      this.adjustDimensions(null)
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
      animationSpeed: 'animationSpeed',
      hasSimulationStarted: 'hasSimulationStarted'
    })
  },

  methods: {
    ...mapActions([
      'setFormatterCanvasWidth',
      'setFormatterCanvasHeight',
      'setAnimationSpeed',
      'startSimulation'
    ]),

    adjustDimensions (sketch) {
      if (
        this.$vuetify.breakpoint.name === 'xs' ||
        this.$vuetify.breakpoint.name === 'sm'
      ) {
        this.dimensions.sketchMarginLeft = 10
        this.dimensions.sketchMarginRight = 10
      } else {
        this.dimensions.sketchMarginLeft = this.sidebarWidth + 50
        this.dimensions.sketchMarginRight = 50
      }

      this.dimensions.windowWidth = document.documentElement.clientWidth
      this.dimensions.windowHeight = document.documentElement.clientHeight

      this.dimensions.sketchWidth =
        this.dimensions.windowWidth -
        this.dimensions.sketchMarginLeft -
        this.dimensions.sketchMarginRight
      this.dimensions.sketchHeight =
        this.dimensions.windowHeight -
        this.dimensions.sketchMarginTop -
        this.dimensions.sketchMarginBottom

      if (sketch !== undefined && sketch !== null) {
        sketch.resizeCanvas(
          this.dimensions.sketchWidth,
          this.dimensions.sketchHeight
        )
      }

      this.setFormatterCanvasWidth(this.dimensions.sketchWidth)
      this.setFormatterCanvasHeight(this.dimensions.sketchHeight)

      this.tree.adjust()
    },

    setup (sketch) {
      sketch.createCanvas(
        this.dimensions.sketchWidth,
        this.dimensions.sketchHeight
      )
      this.adjustDimensions(sketch)

      sketch.background(this.colors.background)
      sketch.stroke(this.colors.initialStroke)
      sketch.noFill()

      sketch.angleMode(sketch.RADIANS)
      sketch.ellipseMode(sketch.CENTER)

      sketch.textSize(10)
      sketch.textAlign(sketch.CENTER, sketch.CENTER)

      window.addEventListener('resize', () => {
        console.log('EventListener::windowResized')
        this.adjustDimensions(sketch)
      })
    },

    draw (sketch) {
      sketch.background(this.colors.background)

      if (this.mouseOnNode !== undefined && this.isDragging) {
        this.mouseOnNode.x = sketch.mouseX
        this.mouseOnNode.y = sketch.mouseY
        this.mouseOnNode.branchNameTextBox.x = this.mouseOnNode.x
        this.mouseOnNode.branchNameTextBox.y =
          this.mouseOnNode.y -
          this.mouseOnNode.r -
          this.mouseOnNode.branchNameTextBox.yMargin
      }

      for (const node of this.nodeSet) {
        sketch.strokeWeight(1.2)
        sketch.drawingContext.setLineDash(node.isPushed ? [] : [10, 5])

        if (node.isAnimated) {
          this.drawAnimatingNode(sketch, node)
          break
        } else {
          if (!this.isDragging && this.isMouseOnNode(sketch, node)) {
            this.mouseOnNode = node
          }

          this.drawStaticNode(sketch, node)
          this.drawBranchNames(sketch, node)
          this.drawLineToParents(sketch, node)
        }
      }
    },

    drawAnimatingNode (sketch, node) {
      if (node.isBeingCreated) {
        sketch.stroke(this.colors.currentStrokeForBeingCreated)
        sketch.noFill()
        sketch.ellipse(node.x, node.y, node.d, node.d)

        if (
          this.colors.currentStrokeForBeingCreated > this.colors.finalStroke
        ) {
          const nextStrokeColor =
            this.colors.currentStrokeForBeingCreated - this.animationSpeed
          this.colors.currentStrokeForBeingCreated =
            nextStrokeColor < this.colors.finalStroke
              ? this.colors.finalStroke
              : nextStrokeColor
        } else {
          node.isAnimated = false
          node.isBeingCreated = false
          this.colors.currentStrokeForBeingCreated = this.colors.initialStroke
        }
      } else {
        sketch.stroke(this.colors.currentStrokeForBeingDeleted)
        sketch.fill(this.colors.deletedFill)
        sketch.ellipse(node.x, node.y, node.d, node.d)

        this.drawLineToParents(sketch, node)

        if (
          this.colors.currentStrokeForBeingDeleted < this.colors.initialStroke
        ) {
          const nextStrokeColor =
            this.colors.currentStrokeForBeingDeleted + this.animationSpeed
          this.colors.currentStrokeForBeingDeleted =
            nextStrokeColor > this.colors.initialStroke
              ? this.colors.initialStroke
              : nextStrokeColor
        } else {
          node.isAnimated = false
          this.tree.remove(node)
          this.colors.currentStrokeForBeingDeleted = this.colors.finalStroke

          if (!this.tree.areAnyNodesMarkedForDeletion()) {
            this.tree.adjust()
          }
        }
      }
    },

    drawStaticNode (sketch, node) {
      sketch.stroke(this.colors.finalStroke)
      sketch.fill(this.colors.fill)
      sketch.ellipse(node.x, node.y, node.d, node.d)

      sketch.fill(this.colors.text)
      sketch.noStroke()
      sketch.textSize(10)
      sketch.text(node.id, node.x, node.y)
    },

    drawLineToParents (sketch, node) {
      if (node === undefined || node === null) {
        return
      }

      for (let i = 0; i < node.parents.length; ++i) {
        if (node.parents[i] === null || node.parents[i] === node) {
          return
        }

        const angle = this.getAngleBetweenNodes(sketch, node, node.parents[i])

        const x0 = Math.floor(node.x + node.r * sketch.cos(angle))
        const y0 = Math.floor(node.y - node.r * sketch.sin(angle))

        const x1 = Math.floor(
          node.parents[i].x + node.parents[i].r * sketch.cos(angle + sketch.PI)
        )
        const y1 = Math.floor(
          node.parents[i].y - node.parents[i].r * sketch.sin(angle + sketch.PI)
        )

        sketch.stroke(this.colors.line)
        sketch.line(x0, y0, x1, y1)

        sketch.fill(this.colors.parentIndicatorCircle)
        sketch.circle(x1, y1, 5)
      }
    },

    drawBranchNames (sketch, node) {
      const x = node.branchNameTextBox.x
      const y = node.branchNameTextBox.y
      const width = node.branchNameTextBox.width
      const height = node.branchNameTextBox.height
      let branchNames = ''

      sketch.fill(this.colors.text)
      sketch.noStroke()
      sketch.rectMode(sketch.CENTER)

      for (let i = 0; i < node.branchNames.length; ++i) {
        if (this.tree.currentBranchName === node.branchNames[i]) {
          branchNames += '*'
        }
        branchNames += node.branchNames[i] + ', '
      }

      branchNames = branchNames.slice(0, -2)

      sketch.textSize(12)
      sketch.text(branchNames, x, y, width, height)
    },

    getAngleBetweenNodes (sketch, node1, node2) {
      const vec1 = sketch.createVector(node1.r, 0)
      const vec2 = sketch.createVector(node2.x - node1.x, node1.y - node2.y)

      const angle = vec1.angleBetween(vec2)

      return angle
    },

    isMouseOnNode (sketch, node) {
      if (
        sketch.dist(node.x, node.y, sketch.mouseX, sketch.mouseY) <
        node.d / 2
      ) {
        return true
      }
      return false
    },

    mousePressed (sketch) {
      if (
        this.mouseOnNode !== undefined &&
        sketch.dist(
          this.mouseOnNode.x,
          this.mouseOnNode.y,
          sketch.mouseX,
          sketch.mouseY
        ) <
          this.mouseOnNode.d / 2
      ) {
        this.isDragging = true
        this.toggleScrollLock('on')
      }
    },

    mouseReleased () {
      this.isDragging = false
      this.toggleScrollLock('off')
    },

    touchStarted (sketch) {
      this.mousePressed(sketch)
      return false
    },

    touchEnded () {
      this.mouseReleased()
      return false
    },

    toggleScrollLock (toggleType) {
      const body = document.body

      if (toggleType === 'on') {
        body.classList.add('scroll-lock')
      } else if (toggleType === 'off') {
        body.classList.remove('scroll-lock')
      } else {
        console.log('toggleScrollLock::error - Invalid toggle type')
      }
    }
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.readWindowWidth)
    window.removeEventListener('resize', this.readWindowHeight)
  }
}
</script>

<style>
.scroll-lock {
  height: 100%;
  overflow: hidden;
  width: 100%;
  position: fixed;
}
</style>
