class Node {
    #_id;
    #_branchNames;
    #_x;
    #_y;
    #_d;
    #_r;
    #_isAnimated;
    #_isBeingCreated;
    #_isBeingDeleted;
    #_parents;
    #_children;
    #_allocatedTextPosition;

    constructor(id, diameter) {
        this._id = id.toString();
        this._branchNames = [];
        this._x = 0;
        this._y = 0;
        this._d = diameter;
        this._r = diameter / 2.0;
        this._isAnimated = true;
        this._isBeingCreated = true;
        this._parents = [];
        this._children = [];
        this._allocatedTextPosition = {
            x: null,
            y: null,
            width: null,
            height: null
        };
    }

    addParent(node) {
        if (!this._parents.includes(node)) {
            this._parents.push(node);
        }
    }

    addChild(childNode) {
        if (childNode === null) {
            console.log(`Node::addChild error: null child node provided`);    
            return;
        }

        if (!this._children.includes(childNode)) {
            this._children.push(childNode);
            childNode.addParent(this);
        }
    }

    addBranch(name) {
        if (!this._branchNames.includes(name)) {
            this._branchNames.push(name);
        }
    }

    removeParent(node) {
        if (this._parents.includes(node)) {
            this._parents.splice(this._parents.indexOf(node), 1);
        }
    }

    removeBranch(name) {
        if (this._branchNames.includes(name)) {
            this._branchNames.splice(this._branchNames.indexOf(name), 1);
        }
    }

    set x(val)                      { this._x = val; }
    set y(val)                      { this._y = val; }
    set d(val)                      { this._d = val; this._r = val / 2.0; }
    set r(val)                      { this._r = val; this._d = val * 2.0; }
    set isAnimated(status)          { this._isAnimated = status; }
    set isBeingCreated(status)      { this._isBeingCreated = status; }
    set allocatedTextPosition(pos)  { this._allocatedTextPosition = pos; }

    get id()                        { return this._id; }
    get branchNames()               { return this._branchNames; }
    get x()                         { return this._x; }
    get y()                         { return this._y; }
    get d()                         { return this._d; }
    get r()                         { return this._r; }
    get isAnimated()                { return this._isAnimated; }
    get isBeingCreated()            { return this._isBeingCreated; }
    get parents()                    { return this._parents; }    
    get children()                  { return this._children; }
    get allocatedTextPosition()     { return this._allocatedTextPosition; }
}

export default Node;
