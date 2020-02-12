class Circle {
    #_xCoord;
    #_yCoord;
    #_radius;

    constructor(x, y, r) {
        this._xCoord = x;
        this._yCoord = y;
        this._radius = r;
    }

    get x() { return this._xCoord; }
    get y() { return this._yCoord; }
    get r() { return this._radius; }
}

export default Circle;
