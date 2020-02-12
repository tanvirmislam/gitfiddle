import Circle from './circle';
import Node from './node';

class Tree {
    #_root;
    #_nodeDict;
    #_levelOrder;
    #_width;
    #_height;
    #_distBetweenNodes;

    constructor() {
        this._root = null;
        this._nodeDict = {};
        this._levelOrder = [];
        this._width = 0;
        this._height = 0;
        this._distBetweenNodes = 0;

        this.buildTestTree();
    }

    set root(node) {
        this._root = node;
        this._nodeDict[this._root.name] = this._root;
    }

    get root() { return this._root; }
    get nodeDict() { return this._nodeDict; }

    addNodeTo(parentName, node) {
        if (this._nodeDict[parentName]) {
            this._nodeDict[parentName].addChild(node);
            this._nodeDict[node.name] = node;
        }

        this.updateLevelOrder();
        this.adjustHorizontalPositions();
    }

    updateLevelOrder() {
        if (!this.root) {
            return;
        }

        this._height = 0
        this._width = 0;
        this._levelOrder = [];

        let currentLevel = [];
        let nextLevel = []
        
        nextLevel.push(this.root);

        while (currentLevel.length !== 0 || nextLevel.length !== 0) {
            if (currentLevel.length === 0) {
                this._width = Math.max(this._width, nextLevel.length);
                this._height++;

                this._levelOrder.push(nextLevel);
                
                currentLevel.push(...nextLevel);
                nextLevel = [];
            }
            else {
                let node = currentLevel.shift();
                nextLevel.push(...(node.children));
            }
        }
    }

    adjustHorizontalPositions() {
        let diameter = (this._levelOrder.length > 0 && this._levelOrder[0][0] !== null) ? this._levelOrder[0][0].circle.d : 50;
        let canvasWidth = 1000;
        let margin = diameter + 10;

        this._distBetweenNodes = Math.max(0, (canvasWidth - (2*margin) - (this._width * diameter)) / this._width);
        
        let treeMaxWidthDistance = this._width * (diameter + this._distBetweenNodes);
        
        let minXPos = Math.ceil (canvasWidth / 2 - Math.floor(treeMaxWidthDistance / 2)) + margin;
        let maxXPos = Math.floor(canvasWidth / 2 + Math.floor(treeMaxWidthDistance / 2)) - margin;
        
        console.log(`\n\nminXPos: ${minXPos}, maxXPos: ${maxXPos}`);
        console.log(`Tree Max Width Distance: ${treeMaxWidthDistance}`);

        for (let i = 0; i < this._levelOrder.length; ++i) {
            let level = this._levelOrder[i];    
            let numberOfNodes = level.length;
        
            let maxSpace = Math.ceil((maxXPos - minXPos) / numberOfNodes);
            let currentXCoord = minXPos;
            
            console.log(`\nLevel ${i}:`);

            for (let j = 0; j < level.length; ++j) {
                console.log(`Adjusting node ${level[j].name}'s x position from ${level[j].circle.x} to ${currentXCoord}`);

                if (i === 0 && this._levelOrder.length > 2) {
                    let rootXCoord = (currentXCoord + (((this._levelOrder[1].length - 1)  * Math.ceil((maxXPos - minXPos) / this._levelOrder[1].length))) / 2);
                    level[j].circle.x = rootXCoord;
                }
                else {
                    level[j].circle.x = currentXCoord;
                    currentXCoord += maxSpace;    
                }
            }
        }
    }

    buildTestTree() {
        let n1  = new Node("n1",  new Circle(400, 100, 50));
        let n2  = new Node("n2",  new Circle(300, 200, 50));
        let n3  = new Node("n3",  new Circle(500, 200, 50));
        let n4  = new Node("n4",  new Circle(400, 300, 50));
        let n5  = new Node("n5",  new Circle(600, 300, 50));
        let n6  = new Node("n6",  new Circle(300, 300, 50));
        let n7  = new Node("n7",  new Circle(300, 400, 50));
        let n8  = new Node("n8",  new Circle(200, 300, 50));
        let n9  = new Node("n9",  new Circle(500, 300, 50));
        let n10 = new Node("n10", new Circle(100, 300, 50));
        let n11 = new Node("n11", new Circle(700, 300, 50));

        this._root = n1;
        this._nodeDict[this._root.name] = this._root;

        this.addNodeTo("n1", n2);
        this.addNodeTo("n1", n3);
        this.addNodeTo("n2", n6);
        this.addNodeTo("n2", n8);
        this.addNodeTo("n2", n10);
        this.addNodeTo("n6", n7);
        this.addNodeTo("n3", n4);
        this.addNodeTo("n3", n9);
        this.addNodeTo("n3", n5);
        this.addNodeTo("n3", n11);

        console.log(`Tree height: ${this._height}, width: ${this._width}, levels: ${this._levelOrder.length}`);
        
        console.log(`\nLevel order:`);
        let str = '';
        for (let i = 0; i < this._levelOrder.length; ++i) {
            for (let j = 0; j < this._levelOrder[i].length; ++j) {
                str += this._levelOrder[i][j].name + '  ';
            }
            console.log(str);
            str = '';
        }
    }

}

export default Tree;
