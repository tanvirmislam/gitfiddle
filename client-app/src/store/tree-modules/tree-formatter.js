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

        console.log(`\nVisiting ${node.name} with minX: ${minX}, maxX: ${maxX}`);
        
        let space = maxX - minX;
        let center = (space / 2) + minX;

        console.log(`Adjusting node ${node.name}'s position from ${node.x} to ${center}`);
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
            console.log(`Calling adjust on node ${node.children[i].name} with minPos: ${startX}, maxPos: ${endX}`);
            this._recursivelyAdjust(node.children[i], startX, endX, yPos, yIncrement);
            startX = endX;
            endX += childrenSpace;
        }
    }

    adjustTree(tree) {
        console.log('\n\nTreeFormatter::adjustTree');
        let margin = 50;

        let verticalDistance = Math.min(100, ((this._canvasHeight - margin) / tree.info.levelOrder.length));
        this._recursivelyAdjust(tree.root, margin, this._canvasWidth - margin, margin, verticalDistance);
    }

    set canvasWidth(width)      { this._canvasWidth = width; }
    set canvasHeight(height)    { this._canvasHeight = height; }

    get canvasWidth()   { return this._canvasWidth; }
    get canvasHeight()  { return this._canvasHeight; }
}

export default TreeFormatter;
