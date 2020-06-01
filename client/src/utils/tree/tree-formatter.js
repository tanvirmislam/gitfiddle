class TreeFormatter {
    #_canvasWidth;
    #_canvasHeight;

    constructor () {
      this._canvasWidth = 1000
      this._canvasHeight = 800
      this._margin = 10

      this._minNodeVerticalDistance = 80
      this._maxNodeVerticalDistance = 100
      this._currentNodeVerticalDistance = undefined
    }

    set canvasWidth (width) { this._canvasWidth = width }
    set canvasHeight (height) { this._canvasHeight = height }
    set margin (val) { this._margin = val }

    get canvasWidth () { return this._canvasWidth }
    get canvasHeight () { return this._canvasHeight }
    get margin () { return this._margin }
    get nodeVerticalDistance () { return this._currentNodeVerticalDistance }

    /**
     * Adjusts tree nodes and their text box positions
     */
    adjustTree (tree) {
      this._currentNodeVerticalDistance = Math.max(
        this._minNodeVerticalDistance,
        Math.min(
          this._maxNodeVerticalDistance,
          (this._canvasHeight - this._margin) * (1 / tree.info.levelOrder.length)
        )
      )

      const startXPos = this._margin
      const endXPos = this._canvasWidth - this._margin
      const startYPos = this._margin
      const yIncrement = this._currentNodeVerticalDistance

      this._recursivelyAdjust(tree.root, startXPos, endXPos, startYPos, yIncrement)
    }

    _recursivelyAdjust (node, minX, maxX, y, yIncrement) {
      if (node === null || node === undefined) {
        return
      }

      const space = maxX - minX
      const center = (space * 0.5) + minX

      node.x = center
      node.y = y

      if (node.children.length === 0) {
        // No nodes to adjust, just adjust the text box
        node.branchNameTextBox = {
          x: center,
          y: y - node.r - node.branchNameTextBox.yMargin,
          width: maxX,
          height: node.d,
          yMargin: node.branchNameTextBox.yMargin
        }

        return
      }

      const childrenSpace = (space * (1 / node.children.length))
      let startX = minX
      let endX = startX + childrenSpace
      const yPos = y + yIncrement

      node.branchNameTextBox = {
        x: center,
        y: y - node.r - node.branchNameTextBox.yMargin,
        width: endX,
        height: node.d,
        yMargin: node.branchNameTextBox.yMargin
      }

      for (let i = 0; i < node.children.length; ++i) {
        this._recursivelyAdjust(node.children[i], startX, endX, yPos, yIncrement)
        startX = endX
        endX += childrenSpace
      }
    }
}

export default TreeFormatter
