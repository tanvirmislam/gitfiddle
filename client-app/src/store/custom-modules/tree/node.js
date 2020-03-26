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
    #_isPushed;
    #_parents;
    #_children;
    #_branchNameTextBox;

    constructor(id, diameter) {
        this._init(id.toString(), diameter);
    }

    _init(id, diameter) {
        this._id = id;
        this._branchNames = [];
        this._x = 0;
        this._y = 0;
        this._d = diameter;
        this._r = diameter / 2.0;
        this._isAnimated = true;
        this._isBeingCreated = true;
        this._isPushed = false;
        this._parents = [];
        this._children = [];
        this._branchNameTextBox = {
            x: null,
            y: null,
            width: null,
            height: null,
            yMargin: 8
        };
    }

    set x(val)                      { this._x = val; }
    set y(val)                      { this._y = val; }
    set d(val)                      { this._d = val; this._r = val / 2.0; }
    set r(val)                      { this._r = val; this._d = val * 2.0; }
    set isAnimated(status)          { this._isAnimated = status; }
    set isBeingCreated(status)      { this._isBeingCreated = status; }
    set isPushed(status)            { this._isPushed = status; }
    set branchNameTextBox(boxInfo)  { this._branchNameTextBox = boxInfo; }

    get id()                        { return this._id; }
    get branchNames()               { return this._branchNames; }
    get x()                         { return this._x; }
    get y()                         { return this._y; }
    get d()                         { return this._d; }
    get r()                         { return this._r; }
    get isAnimated()                { return this._isAnimated; }
    get isBeingCreated()            { return this._isBeingCreated; }
    get isPushed()                  { return this._isPushed; }
    get parents()                   { return this._parents; }    
    get children()                  { return this._children; }
    get branchNameTextBox()         { return this._branchNameTextBox; }

    addParent(node) {
        if (node === undefined || node === null || this._parents.includes(node)) {
            return;
        }
        this._parents.push(node);
    }

    addChild(node) {
        if (node === undefined || node === null || this._children.includes(node)) {
            return;
        }
        this._children.push(node);
    }

    addBranch(name) {
        if (name === undefined || name === '' || this._branchNames.includes(name)) {
            return;
        }
        this._branchNames.push(name);
    }

    removeParent(node) {
        if (this._parents.includes(node)) {
            this._parents.splice(this._parents.indexOf(node), 1);
        }
    }

    removeChild(node) {
        if (this._children.includes(node)) {
            this._children.splice(this._children.indexOf(node), 1);
        }
    }

    removeBranch(name) {
        if (this._branchNames.includes(name)) {
            this._branchNames.splice(this._branchNames.indexOf(name), 1);
        }
    }

    isLeaf() {
        return (this._children.length === 0);
    }

    hasDescendent(node) {
        if (this._children.length === 0) {
            return false;
        }
        else if (this._children.includes(node)) {
            return true;
        }
        
        for (let i = 0; i < this._children.length; ++i) {
            if (this._children[i].hasDescendent(node)) {
                return true;
            }
        }

        return false;
    }

    getNodeInfo() {
        let parentsIds = [];
        let childIds = [];

        for (let i = 0; i < this._parents.length; ++i) {
            parentsIds.push(this._parents[i].id);
        }

        for (let i = 0; i < this._children.length; ++i) {
            childIds.push(this._children[i].id);
        }

        return {
            id: this._id,
            diameter: this._d,
            parentIds: parentsIds,
            childIds: childIds,
            branchNames: this._branchNames
        };
    }
}

export default Node;
