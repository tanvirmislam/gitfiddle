class Node {
    #_name;
    #_x;
    #_y;
    #_d;
    #_r;
    #_circle;
    #_isAnimated;
    #_parent;
    #_children;

    constructor(name, xCoord, yCoord, diameter) {
        this._name = name;
        this._x = xCoord;
        this._y = yCoord;
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

    set x(val)              { this._x = val; }
    set y(val)              { this._y = val; }
    set d(val)              { this._d = val; this._r = val / 2.0; }
    set r(val)              { this._r = val; this._d = val * 2.0; }
    set isAnimated(status)  { this._isAnimated = status; }
    set parent(node)        { this._parent = node; }

    get name()          { return this._name; }
    get x()             { return this._x; }
    get y()             { return this._y; }
    get d()             { return this._d; }
    get r()             { return this._r; }
    get isAnimated()    { return this._isAnimated; }
    get parent()        { return this._parent; }    
    get children()      { return this._children; }
}

export default Node;
