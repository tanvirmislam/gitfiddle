import Node from './node';

class Tree {
    #_root;
    #_nodeSet;
    #_idToNodeDict;
    #_branchNameToNodeDict;
    #_formatter;
    #_currentBranchName;
    #_currentBranchNode;
    #_animationSpeed;
    #_nextId;
    #_info;

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
        this._currentBranchName = '';
        this._currentBranchNode = null;
        this._animationSpeed = 20;
        this._nextId = 1;
    }

    set root(node) {
        this._root = node;

        this._currentBranchName = 'master';
        this._currentBranchNode = node;

        this._nodeSet.add(node);

        this._idToNodeDict[node.id] = node;

        for (let i = 0; i < node.branchNames.length; ++i) {
            this._branchNameToNodeDict[node.branchNames[i]] = node;
        }

        this.updateTreeInfo();
        this.adjust();

        this.formatter.margin = node.d;
    }

    set animationSpeed(spd)     { this._animationSpeed = spd; }

    get root()                  { return this._root; }
    get nodeSet()               { return this._nodeSet; }
    get branchNameToNodeDict()  { return this._branchNameToNodeDict; }
    get info()                  { return this._info; }
    get formatter()             { return this._formatter; }
    get currentBranchName()     { return this._currentBranchName; }
    get currentBranchNode()     { return this._branchNameToNodeDict[this._currentBranchName]; }
    get animationSpeed()        { return this._animationSpeed; }
    get nextId()                { return ++this._nextId; }

    getNodeFromId(nodeId) {
        return this._idToNodeDict[nodeId];
    }

    getNodeFromBranchName(branchName) {
        return this._branchNameToNodeDict[branchName];
    }

    addBranchToNode(node, branchName) {
        node.addBranch(branchName);
        this._branchNameToNodeDict[branchName] = node;
    }

    removeBranchFromNodeId(nodeId, branchName) {
        let node = this._idToNodeDict[nodeId];
        
        if (node !== undefined) {
            node.removeBranch(branchName);
            delete this._branchNameToNodeDict[branchName];
        }
    }

    setCurrentBranch(branchName) {
        if (this._branchNameToNodeDict[branchName] !== undefined) {
            this._currentBranchName = branchName;
            this._currentBranchNode = this._branchNameToNodeDict[branchName];
        }
    }
     
    switchBranch(branchName, fromNode, toNode) {
        fromNode.branchNames.splice(fromNode.branchNames.indexOf(branchName), 1);
        toNode.branchNames.push(branchName);
        this._branchNameToNodeDict[branchName] = toNode;
    }

    attachBranchToNode(branchName, nodeId) {
        let node = this._idToNodeDict[nodeId]
        if (node != undefined) {
            node.addBranch(branchName);
            this._branchNameToNodeDict[branchName] = node;
        }
    }

    _addChildToNode(parentNode, childNode) {
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

    addChildToBranchName(parentBranchName, childNode) {
        let parentNode = this._branchNameToNodeDict[parentBranchName];
        this._addChildToNode(parentNode, childNode);        
    }

    addChildToNodeId(parentId, childNode) {
        let parentNode = this._idToNodeDict[parentId];
        this._addChildToNode(parentNode, childNode);
    }

    remove(node) {
        let parents = node.parents;

        for (let i = 0; i < parents.length; ++i) {
            let childIndex = parents[i].children.findIndex(n => n.id === node.id);
            parents[i].children.splice(childIndex, 1);
        }

        delete this._idToNodeDict[node.id];
        
        this._nodeSet.forEach((n) => {
            if (n.id === node.id) {
                this._nodeSet.delete(n);
            }
        });
    }

    markNodeIdForDeletion(nodeId) {
        let node = this._idToNodeDict[nodeId];

        if (node === undefined) {
            return;
        }
        
        node.isAnimated = true;
        node.isBeingCreated = false;
    }

    reset() {
        this._init();
        let diameter = 35;
        
        let rootNode = new Node('1', diameter);
        rootNode.addBranch('master');
        
        this.root = rootNode;

        console.log(this.getTreeInfoStr());
    }

    adjust() {
        this._formatter.adjustTree(this);
    }

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
        console.log(`*** Building Demo Tree ***`);
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
        let n18 = new Node('18', diameter);
        
        this.root = n1;
        
        this.addChildToNodeId('1',  n2);
        this.addChildToNodeId('1',  n3);

        this.addChildToNodeId('2', n4);
        this.addChildToNodeId('2', n5);
        this.addChildToNodeId('3', n6);
        this.addChildToNodeId('3', n7);
        this.addChildToNodeId('3', n8);
        this.addChildToNodeId('3', n9);

        this.addChildToNodeId('4', n10);
        this.addChildToNodeId('7', n11);
        this.addChildToNodeId('7', n12);
        this.addChildToNodeId('9', n13);

        this.addChildToNodeId('10', n14);
        this.addChildToNodeId('12', n15);
        this.addChildToNodeId('13', n16);

        this.addChildToNodeId('15', n17);

        this.addChildToNodeId('17', n18);

        this.getNodeFromId('10').addParent(this.getNodeFromId('5'));
        this.getNodeFromId('15').addParent(this.getNodeFromId('11'));
        this.getNodeFromId('16').addParent(this.getNodeFromId('8'));
        this.getNodeFromId('17').addParent(this.getNodeFromId('16'));
        this.getNodeFromId('18').addParent(this.getNodeFromId('14'));

        // console.log(this.getTreeInfoStr());
    }

}

export default Tree;
