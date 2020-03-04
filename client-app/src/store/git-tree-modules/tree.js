import Node from './node';

class Tree {
    #_root;
    #_nodeSet;
    #_idToNodeDict;
    #_branchNameToNodeDict;
    #_info;
    #_formatter;
    #_currentBranch;

    constructor(treeFormatter) {
        this._formatter = treeFormatter;
        this._init();
        this._buildDemoTree();
    }

    _init() {
        this._root = null;
        this._nodeSet = new Set();
        this._idToNodeDict = {};
        this._branchNameToNodeDict = {};
        this._info = {
            totalNodes: 0,
            width: 0,
            height: 0,
            levelOrder: []
        }
        this._currentBranch = null;
    }

    set root(node) {
        this._root = node;

        this._nodeSet.add(node);

        this._idToNodeDict[node.id] = node;

        for (let i = 0; i < node.branchNames.length; ++i) {
            this._branchNameToNodeDict[node.branchNames[i]] = node;
        }
        
        this._currentBranch = node;

        this.updateTreeInfo();
        this.adjust();

        this.formatter.margin = node.d;
    }

    set currentBranch(name) {
        if (this._branchNameToNodeDict[name] !== undefined) {
            this._currentBranch = this._branchNameToNodeDict[name];
        } 
    }

    get root()                  { return this._root; }
    get nodeSet()               { return this._nodeSet; }
    get branchNameToNodeDict()  { return this._branchNameToNodeDict; }
    get info()                  { return this._info; }
    get formatter()             { return this._formatter; }
    get currentBranch()         { return this._currentBranch; }

    updateTreeInfo() {
        if (!this._root) {
            return;
        }

        this._info.totalNodes = 0;
        this._info.width = 0;
        this._info.height = 0;
        this._info.levelOrder = [];

        let currentLevel = [];
        let nextLevel = [];
        
        nextLevel.push(this._root);

        while (currentLevel.length !== 0 || nextLevel.length !== 0) {
            if (currentLevel.length === 0) {
                this._info.totalNodes += nextLevel.length;
                this._info.width = Math.max(this._info.width, nextLevel.length);
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

    reset() {
        this._init();

        let diameter = 35;
        this.root = new Node('master', diameter);
        
        console.log(`\nTotal Nodes: ${this._info.totalNodes}, Width: ${this._info.width}, Height: ${this._info.height} / Levels: ${this._info.levelOrder.length}`);
        
        console.log(`Level order traversal:`);
        console.log(this._info.levelOrder);
        console.log(this._info.levelOrder[0].length);

        let str = ' xyz';
        for (let i = 0; i < this._info.levelOrder.length; ++i) {
            for (let j = 0; j < this._info.levelOrder[i].length; ++j) {
                str += this._info.levelOrder[i][j].name + ' ';
            }
            console.log(str);
            str = ' ';
        }
        console.log('');
    }

    _add(parentNode, childNode) {
        if (parentNode === undefined || !this._nodeSet.has(parentNode)) {
            console.log(`Tree::addNode error: parent node does not exist`);
            return;
        }

        parentNode.addChild(childNode);

        this._nodeSet.add(childNode);

        this._idToNodeDict[childNode.id] = childNode;

        for (let i = 0; i < childNode.branchNames.length; ++i) {
            this._branchNameToNodeDict[childNode.branchNames[i]] = childNode;
        }
        
        this.updateTreeInfo();
        this.adjust();
    }

    addToBranch(parentBranchName, childNode) {
        let parentNode = this._branchNameToNodeDict[parentBranchName];
        this._add(parentNode, childNode);        
    }

    addToId(parentId, childNode) {
        let parentNode = this._idToNodeDict[parentId];
        this._add(parentNode, childNode);
    }

    getTreeInfoStr() {
        let str = '\n------------------------\n=== Tree Information ===\n------------------------\n';
        
        str += `Total Nodes: ${this._info.totalNodes}\nWidth: ${this._info.width}\nHeight: ${this._info.height}\n`;
        str += 'Level Order Traversal:\n';

        let lvl = ''
        for (let i = 0; i < this._info.levelOrder.length; ++i) {
            for (let j = 0; j < this._info.levelOrder[i].length; ++j) {
                lvl += this._info.levelOrder[i][j].id  + ' ';
            }
            str += lvl + '\n';
            lvl = '';
        }

        str += '------------------------\n'

        return str;
    }

    _buildDemoTree() {
        console.log(`*** Building Test Tree ***`);
        let diameter = 35;
        let n1  = new Node('1',  diameter);
        let n2  = new Node('2',  diameter);
        let n3  = new Node('3',  diameter);
        let n4  = new Node('4',  diameter);
        let n5  = new Node('5',  diameter);
        let n6  = new Node('6',  diameter);
        let n7  = new Node('7',  diameter);
        let n8  = new Node('8',  diameter);
        let n9  = new Node('9',  diameter);
        let n10 = new Node('10', diameter);
        let n11 = new Node('11', diameter);
        let n12 = new Node('12', diameter);
        let n13 = new Node('13', diameter);
        let n14 = new Node('14', diameter);
        let n15 = new Node('15', diameter);
        let n16 = new Node('16', diameter);
        let n17 = new Node('17', diameter);

        this.root = n1;
        
        this.addToId('1',  n2);
        this.addToId('1',  n3);
        this.addToId('2',  n6);
        this.addToId('2',  n8);
        this.addToId('3',  n10);
        this.addToId('6',  n7);
        this.addToId('3',  n4);
        this.addToId('3',  n9);
        this.addToId('3',  n5);
        this.addToId('3',  n11);
        this.addToId('11', n12);
        this.addToId('11', n13);
        this.addToId('4',  n14);
        this.addToId('4',  n15);
        this.addToId('4',  n16);
        this.addToId('12', n17);

        console.log(this.getTreeInfoStr());
    }

}

export default Tree;