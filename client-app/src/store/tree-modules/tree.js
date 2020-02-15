import Node from './node';

class Tree {
    #_root;
    #_nameToNodeDict;
    #_info;
    #_formatter;
    #_currentBranch;

    constructor(treeFormatter) {
        this._root = null;
        this._nameToNodeDict = {};
        this._info = {
            width: 0,
            height: 0,
            levelOrder: []
        }
        this._formatter = treeFormatter;
        this._currentBranch = null;

        this._buildTestTree();
    }

    set root(node) {
        this._root = node;
        this._nameToNodeDict[this._root.name] = this._root;
        this._currentBranch = this._root;
    }

    set currentBranch(nodeName) { 
        this._currentBranch = this._nameToNodeDict[nodeName]; 
    }

    get root()              { return this._root; }
    get info()              { return this._info; }
    get formatter()         { return this._formatter; }
    get nameToNodeDict()    { return this._nameToNodeDict; }
    get currentBranch()     { return this._currentBranch; }
    
    getNode(name) {
        return this._nameToNodeDict[name];
    }

    addNodeTo(parentName, node) {
        if (this._nameToNodeDict[parentName] === undefined) {
            console.log(`Tree::addNodeTo error: unable to add node to undefined node: ${parentName}`);
            return;
        }

        this._nameToNodeDict[parentName].addChild(node);
        this._nameToNodeDict[node.name] = node;
        
        this.updateTreeInfo();
        this.adjust();
    }

    updateTreeInfo() {
        if (!this.root) {
            return;
        }

        this._info.width = 0;
        this._info.height = 0;
        this._info.levelOrder = [];

        let currentLevel = [];
        let nextLevel = []
        
        nextLevel.push(this.root);

        while (currentLevel.length !== 0 || nextLevel.length !== 0) {
            if (currentLevel.length === 0) {
                this._info.width = Math.max(this._width, nextLevel.length);
                this._info.height += 1;

                this._info.levelOrder.push(nextLevel);
                
                currentLevel.push(...nextLevel);
                nextLevel = [];
            }
            else {
                let node = currentLevel.shift();
                nextLevel.push(...(node.children));
            }
        }
    }

    adjust() {
        this._formatter.adjustTree(this);
    }

    _buildTestTree() {
        console.log(`*** Building Test Tree ***`);
        let n1  = new Node("n1",  300, 100, 35);
        let n2  = new Node("n2",  300, 200, 35);
        let n3  = new Node("n3",  500, 200, 35);
        let n4  = new Node("n4",  400, 300, 35);
        let n5  = new Node("n5",  600, 300, 35);
        let n6  = new Node("n6",  300, 300, 35);
        let n7  = new Node("n7",  400, 400, 35);
        let n8  = new Node("n8",  200, 300, 35);
        let n9  = new Node("n9",  500, 300, 35);
        let n10 = new Node("n10", 100, 300, 35);
        let n11 = new Node("n11", 700, 300, 35);
        let n12 = new Node("n12", 600, 400, 35);
        let n13 = new Node("n13", 500, 400, 35);

        let n14 = new Node("n14", 500, 400, 35);
        let n15 = new Node("n15", 500, 400, 35);
        let n16 = new Node("n16", 500, 500, 35);
        let n17 = new Node("n17", 500, 500, 35);
        let n18 = new Node("n18", 500, 500, 35);
        let n19 = new Node("n19", 500, 500, 35);

        this._root = n1;
        this._nameToNodeDict[this._root.name] = this._root;
        this._currentBranch = n1;
        
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

        console.log(`Height: ${this._info.height} / Levels: ${this._info.levelOrder.length}, Width: ${this._info.width}`);
        
        console.log(`\nLevel order traversal:`);
        let str = '';
        for (let i = 0; i < this._info.levelOrder.length; ++i) {
            for (let j = 0; j < this._info.levelOrder[i].length; ++j) {
                str.concat(this._info.levelOrder[i][j].name, ' ');
            }
            console.log(str);
            str = '';
        }
        console.log('');
    }

}

export default Tree;
