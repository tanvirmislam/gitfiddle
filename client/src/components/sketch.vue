<template>
  <div>
    <div>
      <!-- Launch button to start GitFiddle -->
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

      <!-- p5 sketch -->
      <v-row id="sketch-container" align="center" justify="center">
        <vue-p5
          @setup="setup"
          @draw="draw"
          @mousepressed="mousePressed"
          @mousereleased="mouseReleased"
          @touchstarted="touchStarted"
          @touchended="touchEnded"
        ></vue-p5>
      </v-row>
    </div>

    <!-- Dialog box when tree is being generated from a git repo -->
    <v-dialog
      id="git-tree-creation-dialog-box"
      v-model="isTreeBeingCreatedFromGit"
      :persistent="true"
      overlay-color="rgb(60, 60, 60)"
      overlay-opacity="0.8"
      width="350"
      align="center"
      justify="center"
    >
      <v-card
        id="git-tree-creation-message-card"
        dark
        tile
        loading
      >
        <v-card-title
          class="py-5"
          align="center"
          justify="center"
        >
          <div id="git-tree-creation-message">
            <strong> Generating Tree </strong>
            <span class="title-1 ml-3 white--text">
              <font-awesome-icon
                :icon="['fas', 'spinner']"
                pulse
              />
            </span>
          </div>
        </v-card-title>
      </v-card>
    </v-dialog>

    <!-- Dialog box containing a node's git commit information -->
    <div align="center" justify="center" class="mr-3">
      <v-dialog v-model="nodeInfoPopUp" width="500">
        <v-card class="command">
          <v-card-title class="grey lighten-2 command">
            <strong> Commit Node Information </strong>
          </v-card-title>

          <v-card-text justify="left" class="mt-5">
            <div v-if="mouseOnNode !== undefined && mouseOnNode.gitCommitInfo !== undefined">
              <ul>
                <li> <strong> Node SHA: </strong> {{ mouseOnNode.gitCommitInfo.sha }} </li>
                <li> <strong> Username: </strong> {{ mouseOnNode.gitCommitInfo.committerName }} </li>
                <li> <strong> Email: </strong> {{ mouseOnNode.gitCommitInfo.committerEmail }} </li>
                <li> <strong> Commit Message: </strong> {{ mouseOnNode.gitCommitInfo.commitMessage }} </li>
                <li> <strong> Date: </strong> {{ mouseOnNode.gitCommitInfo.date }} </li>
              </ul>
            </div>
            <div v-else>
              <p> Git commit information is not available. </p>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
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
      sketchMarginRight: 100,

      sketchPaddingTop: 10,
      sketchPaddingBottom: 50
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
    isDragging: false,
    lockScrollAt: undefined,

    mouseClickStartTime: undefined,
    infoClickDurationThreshold: 200,

    nodeInfoPopUp: false
  }),

  computed: {
    ...mapGetters([
      'isTreeBeingCreatedFromGit',
      'sidebarWidth',
      'tree',
      'root',
      'nodeSet',
      'branchNameToNodeDict',
      'treeInfo',
      'treeFormatter',
      'animationSpeed',
      'hasSimulationStarted'
    ]),

    scrollY: {
      get () {
        return window.scrollY
      },
      set (val) {
        window.scrollY = val
      }
    },

    nominalSketchHeight () {
      return (
        this.tree.info.maxYCoord +
        this.tree.nodeDiameter +
        this.dimensions.sketchPaddingTop +
        this.dimensions.sketchMarginBottom
      )
    }
  },

  watch: {
    scrollY () {
      if (this.lockScrollAt !== undefined) {
        this.scrollY = this.lockScrollAt
      }
    }
  },

  methods: {
    ...mapActions([
      'setFormatterCanvasWidth',
      'setFormatterCanvasHeight',
      'setAnimationSpeed',
      'startSimulation'
    ]),

    adjustOnWindowResize (sketch) {
      if (['xs', 'sm'].includes(this.$vuetify.breakpoint.name)) {
        this.dimensions.sketchMarginLeft = 10
        this.dimensions.sketchMarginRight = 10
      } else {
        this.dimensions.sketchMarginLeft = this.sidebarWidth + 50
        this.dimensions.sketchMarginRight = 50
      }

      this.dimensions.windowWidth = document.documentElement.clientWidth
      this.dimensions.windowHeight = document.documentElement.clientHeight

      this.dimensions.sketchWidth = this.dimensions.windowWidth - this.dimensions.sketchMarginLeft - this.dimensions.sketchMarginRight
      this.dimensions.sketchHeight = this.nominalSketchHeight

      this.setFormatterCanvasWidth(this.dimensions.sketchWidth)
      this.setFormatterCanvasHeight(this.dimensions.sketchHeight)

      this.tree.adjust()

      if (sketch !== undefined && sketch !== null) {
        sketch.resizeCanvas(this.dimensions.sketchWidth, this.dimensions.sketchHeight)
      }
    },

    setup (sketch) {
      sketch.createCanvas(this.dimensions.sketchWidth, this.dimensions.sketchHeight)
      this.adjustOnWindowResize(sketch)

      sketch.background(this.colors.background)
      sketch.stroke(this.colors.initialStroke)
      sketch.noFill()

      sketch.angleMode(sketch.RADIANS)
      sketch.ellipseMode(sketch.CENTER)

      sketch.textSize(10)
      sketch.textAlign(sketch.CENTER, sketch.CENTER)

      window.addEventListener('resize', () => { this.adjustOnWindowResize(sketch) })
    },

    draw (sketch) {
      // Adjust the height of the canvas
      if (this.nominalSketchHeight > this.dimensions.sketchHeight) {
        this.dimensions.sketchHeight = this.nominalSketchHeight
        sketch.resizeCanvas(this.dimensions.sketchWidth, this.dimensions.sketchHeight)
      }

      sketch.background(this.colors.background)

      if (this.mouseOnNode !== undefined && this.isDragging) {
        this.mouseOnNode.x = sketch.mouseX
        this.mouseOnNode.y = sketch.mouseY

        this.mouseOnNode.branchNameTextBox.x = this.mouseOnNode.x
        this.mouseOnNode.branchNameTextBox.y = this.mouseOnNode.y - this.mouseOnNode.r - this.mouseOnNode.branchNameTextBox.yMargin
      }

      for (const node of this.nodeSet) {
        sketch.strokeWeight(1.2)
        sketch.drawingContext.setLineDash(node.isPushed ? [] : [10, 5])

        if (node.isAnimated) {
          // Finish animation of the nodes and viewport
          // Then move to draw the next node
          this.drawAnimatingNode(sketch, node)
          break
        } else {
          // Adjust node position if its being dragged
          if (!this.isDragging && this.isMouseOnNode(sketch, node)) {
            this.mouseOnNode = node
          }

          // Draw
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

        if (this.colors.currentStrokeForBeingCreated > this.colors.finalStroke) {
          const nextStrokeColor = this.colors.currentStrokeForBeingCreated - this.animationSpeed
          this.colors.currentStrokeForBeingCreated = nextStrokeColor < this.colors.finalStroke ? this.colors.finalStroke : nextStrokeColor
        } else {
          node.endAnimation()
          this.colors.currentStrokeForBeingCreated = this.colors.initialStroke
        }
      } else {
        sketch.stroke(this.colors.currentStrokeForBeingDeleted)
        sketch.fill(this.colors.deletedFill)
        sketch.ellipse(node.x, node.y, node.d, node.d)

        this.drawLineToParents(sketch, node)

        if (this.colors.currentStrokeForBeingDeleted < this.colors.initialStroke) {
          const nextStrokeColor = this.colors.currentStrokeForBeingDeleted + this.animationSpeed
          this.colors.currentStrokeForBeingDeleted = (nextStrokeColor > this.colors.initialStroke) ? this.colors.initialStroke : nextStrokeColor
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
      // Draw only if its in viewport
      if (!this.isNodeInView(node)) {
        return
      }
      sketch.stroke(this.colors.finalStroke)
      sketch.fill(this.colors.fill)
      sketch.ellipse(node.x, node.y, node.d, node.d)

      const maxNodeIdLength = 3

      sketch.fill(this.colors.text)
      sketch.noStroke()
      sketch.textSize(10)
      sketch.text((node.id.length > maxNodeIdLength ? `${node.id.slice(0, maxNodeIdLength)}...` : node.id), node.x, node.y)
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

      for (let i = 0; i < node.branchNames.length; ++i) {
        if (this.tree.currentBranchName === node.branchNames[i]) {
          branchNames += '*'
        }
        branchNames += node.branchNames[i] + ', '
      }

      branchNames = branchNames.slice(0, -2)

      sketch.fill(this.colors.text)
      sketch.noStroke()
      sketch.rectMode(sketch.CENTER)

      sketch.textSize(12)
      sketch.text(branchNames, x, y, width, height)
    },

    getAngleBetweenNodes (sketch, node1, node2) {
      const vec1 = sketch.createVector(node1.r, 0)
      const vec2 = sketch.createVector(node2.x - node1.x, node1.y - node2.y)

      const angle = vec1.angleBetween(vec2)

      return angle
    },

    isNodeInView (node) {
      const top = Math.max(0, window.scrollY - document.querySelector('#sketch-container').offsetTop)
      const bottom = top + (window.innerHeight || document.documentElement.clientHeight)
      const threshold = 100

      return ((node.y > (top - threshold)) && (node.y < (bottom + threshold)))
    },

    isMouseOnNode (sketch, node) {
      if (sketch.dist(node.x, node.y, sketch.mouseX, sketch.mouseY) < node.d * 0.5) {
        return true
      }
      return false
    },

    mousePressed (sketch) {
      if (
        this.mouseOnNode !== undefined &&
        sketch.dist(this.mouseOnNode.x, this.mouseOnNode.y, sketch.mouseX, sketch.mouseY) < this.mouseOnNode.d * 0.5
      ) {
        this.mouseClickStartTime = (new Date()).getTime()
        this.isDragging = true
        this.toggleScrollLock('on')
      }
    },

    mouseReleased () {
      const mouseClickEndTime = (new Date()).getTime()

      if (
        this.mouseOnNode &&
        this.mouseOnNode.gitCommitInfo !== undefined &&
        (mouseClickEndTime - this.mouseClickStartTime) < this.infoClickDurationThreshold
      ) {
        this.nodeInfoPopUp = true
      }

      this.mouseClickStartTime = undefined
      this.isDragging = false
      this.toggleScrollLock('off')
    },

    /**
     * For touch support
     */
    touchStarted (sketch) {
      this.mousePressed(sketch)
      return false
    },

    /**
     * For touch support
     */
    touchEnded () {
      this.mouseReleased()
      return false
    },

    toggleScrollLock (toggleType) {
      if (toggleType === 'on') {
        this.lockScrollAt = this.scrollY
        // document.body.classList.add('scroll-lock')
      } else if (toggleType === 'off') {
        this.lockScrollAt = undefined
        // document.body.classList.remove('scroll-lock')
      } else {
        console.error('toggleScrollLock::error - Invalid toggle type')
      }
    }
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.adjustOnWindowResize)
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

#git-tree-creation-message {
  margin: auto
}
</style>
