class TreeFormatter {
    #_canvasWidth;
    #_canvasHeight;
    
    constructor() {
        this._canvasWidth = 1000;
        this._canvasHeight = 800;
        this._margin = 10;
    }

    set canvasWidth(width)      { this._canvasWidth = width; }
    set canvasHeight(height)    { this._canvasHeight = height; }
    set margin(val)             { this._margin = val; }

    get canvasWidth()   { return this._canvasWidth; }
    get canvasHeight()  { return this._canvasHeight; }
    get margin()        { return this._margin; }

    /**
     * Adjusts tree nodes and their text box positions
     */
    adjustTree(tree) {
        let startXPos = this._margin;
        let endXPos = this._canvasWidth - this._margin;
        let startYPos = this._margin;
        let yIncrement = Math.min(100, ((this._canvasHeight - this._margin) / tree.info.levelOrder.length));

        this._recursivelyAdjust(tree.root, startXPos, endXPos, startYPos, yIncrement);
    }

    _recursivelyAdjust(node, minX, maxX, y, yIncrement) {
        if (node === null || node === undefined) {
            return;
        }

        let space = maxX - minX;
        let center = (space / 2) + minX;

        node.x = center;
        node.y = y;

        if (node.children.length === 0) {
            // No nodes to adjust, just adjust the text box
            node.branchNameTextBox = {
                x: center,
                y: y - node.r - node.branchNameTextBox.yMargin,
                width: maxX,
                height: node.d,
                yMargin: node.branchNameTextBox.yMargin
            }

            return;
        }

        let childrenSpace = (space / node.children.length);
        let startX = minX;
        let endX = startX + childrenSpace;
        let yPos = y + yIncrement;

        node.branchNameTextBox = {
            x: center,
            y: y - node.r - node.branchNameTextBox.yMargin,
            width: endX,
            height: node.d,
            yMargin: node.branchNameTextBox.yMargin
        }

        for (let i = 0; i < node.children.length; ++i) {
            this._recursivelyAdjust(node.children[i], startX, endX, yPos, yIncrement);
            startX = endX;
            endX += childrenSpace;
        }
    }
}

export default TreeFormatter;
