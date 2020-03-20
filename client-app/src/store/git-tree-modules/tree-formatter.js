class TreeFormatter {
    #_canvasWidth;
    #_canvasHeight;
    
    constructor() {
        this._canvasWidth = 1000;
        this._canvasHeight = 800;
        this._margin = 10;
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
            node.allocatedTextPosition = {
                x: center,
                y: y - node.r - 8,
                width: maxX,
                height: node.d
            }

            return;
        }

        let childrenSpace = (space / node.children.length);
        let startX = minX;
        let endX = startX + childrenSpace;
        let yPos = y + yIncrement;

        node.allocatedTextPosition = {
            x: center,
            y: y - node.r - 8,
            width: endX,
            height: node.d
        }

        for (let i = 0; i < node.children.length; ++i) {
            this._recursivelyAdjust(node.children[i], startX, endX, yPos, yIncrement);
            startX = endX;
            endX += childrenSpace;
        }
    }

    adjustTree(tree) {
        // console.log('\n\nTreeFormatter::adjustTree');

        let startXPos = this._margin;
        let endXPos = this._canvasWidth - this._margin;
        let startYPos = this._margin;
        let yIncrement = Math.min(100, ((this._canvasHeight - this._margin) / tree.info.levelOrder.length));

        this._recursivelyAdjust(tree.root, startXPos, endXPos, startYPos, yIncrement);
    }

    set canvasWidth(width)      { this._canvasWidth = width; }
    set canvasHeight(height)    { this._canvasHeight = height; }
    set margin(val)             { this._margin = val; }

    get canvasWidth()   { return this._canvasWidth; }
    get canvasHeight()  { return this._canvasHeight; }
    get margin()        { return this._margin; }
}

export default TreeFormatter;
