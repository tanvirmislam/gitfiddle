class Node {
    #_parent;
    #_name;
    #_circle;
    #_isAnimated;
    #_children;

    constructor(name, circle) {
        this._parent = null;
        this._name = name;
        this._circle = circle;
        this._isAnimated = true;
        this._children = [];
    }

    addChild(node) {
        this._children.push(node);
        node.parent = this;
    }

    set parent(node)    { this._parent = node; }
    get parent()        { return this._parent; }

    get name()      { return this._name; }

    get circle()    { return this._circle; }
    set circle(c)   { this._circle = c; }

    set isAnimated(status)  { this._isAnimated = status; }
    get isAnimated()        { return this._isAnimated; }

    get children()  { return this._children; }
}

export default Node;
