class Node {
    #_id;
    #_branchNames;
    #_x;
    #_y;
    #_d;
    #_r;
    #_isAnimated;
    #_parent;
    #_children;

    constructor(id, diameter) {
        this._id = id.toString();
        this._branchNames = [];
        this._x = 0;
        this._y = 0;
        this._d = diameter;
        this._r = diameter / 2.0;
        this._isAnimated = true;
        this._parent = null;
        this._children = [];
    }

    addChild(childNode) {
        if (childNode === null) {
            console.log(`Node::addChild error: null child node provided`);    
            return;
        }
        this._children.push(childNode);
        childNode.parent = this;
    }

    addBranch(name) {
        if (this._branchNames.includes(name)) {
            console.log(`Node::addBranch error: branch ${name} already exists in node ${this._id}`);
            return;
        }

        this._branchNames.push(name);
    }

    removeBranch(name) {
        if (this._branchNames.includes(name)) {
            this._branchNames.splice( this._branchNames.indexOf(name), 1 );
        }
        else {
            console.log(`Node::removeBranch warning: ${name} does not exists in the node`);
        }
    }

    set x(val)              { this._x = val; }
    set y(val)              { this._y = val; }
    set d(val)              { this._d = val; this._r = val / 2.0; }
    set r(val)              { this._r = val; this._d = val * 2.0; }
    set isAnimated(status)  { this._isAnimated = status; }
    set parent(node)        { this._parent = node; }

    get id()            { return this._id; }
    get branchNames()   { return this._branchNames; }
    get x()             { return this._x; }
    get y()             { return this._y; }
    get d()             { return this._d; }
    get r()             { return this._r; }
    get isAnimated()    { return this._isAnimated; }
    get parent()        { return this._parent; }    
    get children()      { return this._children; }
    
    get displayName() {
        let str = '';
        for (let i = 0; i < this._branchNames.length; ++i) {
            str += this._branchNames[i] + ', ';
        }
        return str.slice(0, -2);
    }
}

export default Node;
