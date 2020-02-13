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
        // this.adjustHorizontalPositions();
        this.adjustHorizontalPositions(this.root, 0, 1000);
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

    adjustHorizontalPositions(node, minX, maxX) {
        if (node === null) {
            return;
        }

        console.log(`\n\nVisiting ${node.name} with minX: ${minX}, maxX: ${maxX}`);
        let space = maxX - minX;
        let center = (space / 2) + minX;

        console.log(`Adjusting node ${node.name}'s position from ${node.circle.x} to ${center}`);
        node.circle.x = center;

        if (node.children.length === 0) {
            return;
        }

        let childrenSpace = (space / node.children.length);
        console.log(childrenSpace.toString());
        
        let startX = minX;
        let endX = startX + childrenSpace;

        for (let i = 0; i < node.children.length; ++i) {
            console.log(`Calling adjust to node ${node.children[i].name} with minPos: ${startX}, maxPos: ${endX}`);
            this.adjustHorizontalPositions(node.children[i], startX, endX);
            startX = endX;
            endX += childrenSpace;
        }
    }
    
    buildTestTree() {
        let n1  = new Node("n1",  new Circle(300, 100, 35));
        let n2  = new Node("n2",  new Circle(300, 200, 35));
        let n3  = new Node("n3",  new Circle(500, 200, 35));
        let n4  = new Node("n4",  new Circle(400, 300, 35));
        let n5  = new Node("n5",  new Circle(600, 300, 35));
        let n6  = new Node("n6",  new Circle(300, 300, 35));
        let n7  = new Node("n7",  new Circle(400, 400, 35));
        let n8  = new Node("n8",  new Circle(200, 300, 35));
        let n9  = new Node("n9",  new Circle(500, 300, 35));
        let n10 = new Node("n10", new Circle(100, 300, 35));
        let n11 = new Node("n11", new Circle(700, 300, 35));
        let n12 = new Node("n12", new Circle(600, 400, 35));
        let n13 = new Node("n13", new Circle(500, 400, 35));

        let n14 = new Node("n14", new Circle(500, 400, 35));
        let n15 = new Node("n15", new Circle(500, 400, 35));
        let n16 = new Node("n16", new Circle(500, 500, 35));
        let n17 = new Node("n17", new Circle(500, 500, 35));
        let n18 = new Node("n18", new Circle(500, 500, 35));
        let n19 = new Node("n19", new Circle(500, 500, 35));

        this._root = n1;
        this._nodeDict[this._root.name] = this._root;

        this.addNodeTo("n1",  n2);
        this.addNodeTo("n1",  n3);
        this.addNodeTo("n2",  n6);
        this.addNodeTo("n2",  n8);
        this.addNodeTo("n2",  n10);
        this.addNodeTo("n6",  n7);
        this.addNodeTo("n3",  n4);
        this.addNodeTo("n3",  n9);
        this.addNodeTo("n3",  n5);
        this.addNodeTo("n3",  n11);
        this.addNodeTo("n11", n12);
        this.addNodeTo("n11", n13);
        this.addNodeTo("n4", n14);
        this.addNodeTo("n4", n15);
        this.addNodeTo("n14", n16);
        this.addNodeTo("n14", n17);
        this.addNodeTo("n15", n18);
        this.addNodeTo("n15", n19);

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
