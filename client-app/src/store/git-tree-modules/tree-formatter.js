class TreeFormatter {
    #_canvasWidth;
    #_canvasHeight;
    
    constructor() {
        this._canvasWidth = 1000;
        this._canvasHeight = 800;
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
            return;
        }

        let childrenSpace = (space / node.children.length);
        let startX = minX;
        let endX = startX + childrenSpace;
        let yPos = y + yIncrement;

        for (let i = 0; i < node.children.length; ++i) {
            this._recursivelyAdjust(node.children[i], startX, endX, yPos, yIncrement);
            startX = endX;
            endX += childrenSpace;
        }
    }

    adjustTree(tree) {
        // console.log('\n\nTreeFormatter::adjustTree');
        let margin = 50;

        let startXPos = margin;
        let endXPos = Math.min(1000 - margin, this._canvasWidth - margin);
        let startYPos = margin;
        let yIncrement = Math.min(100, ((this._canvasHeight - margin) / tree.info.levelOrder.length));

        this._recursivelyAdjust(tree.root, startXPos, endXPos, startYPos, yIncrement);
    }

    set canvasWidth(width)      { this._canvasWidth = width; }
    set canvasHeight(height)    { this._canvasHeight = height; }

    get canvasWidth()   { return this._canvasWidth; }
    get canvasHeight()  { return this._canvasHeight; }
}

export default TreeFormatter;
