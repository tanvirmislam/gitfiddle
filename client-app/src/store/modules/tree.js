import Circle from './circle';
import Node from './node';

class Tree {
    #_root;
    #_nodeDict;
    #_levelOrder;

    constructor() {
        this._root = null;
        this._nodeDict = {};
        this._levelOrder = [];

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
    }


    buildTestTree() {
        let n1 = new Node("n1", new Circle(400, 100, 50));
        let n2 = new Node("n2", new Circle(300, 200, 50));
        let n3 = new Node("n3", new Circle(500, 200, 50));
        let n4 = new Node("n4", new Circle(400, 300, 50));
        let n5 = new Node("n5", new Circle(600, 300, 50));
        let n6 = new Node("n6", new Circle(300, 300, 50));
        let n7 = new Node("n7", new Circle(300, 400, 50));

        this._root = n1;
        this._nodeDict[this._root.name] = this._root;

        this.addNodeTo("n1", n2);
        this.addNodeTo("n1", n3);
        this.addNodeTo("n2", n6);
        this.addNodeTo("n6", n7);
        this.addNodeTo("n3", n4);
        this.addNodeTo("n3", n5);
    }
}

export default Tree;