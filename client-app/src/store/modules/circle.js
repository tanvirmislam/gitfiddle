class Circle {
    #_xCoord;
    #_yCoord;
    #_diameter;
    #_radius;

    constructor(x, y, d) {
        this._xCoord = x;
        this._yCoord = y;
        this._diameter = d;
        this._radius = d/2;
    }

    set x(val) { this._xCoord = val; }
    set y(val) { this._yCoord = val; }

    get x() { return this._xCoord; }
    get y() { return this._yCoord; }
    get d() { return this._diameter; }
    get r() { return this._radius; }
}

export default Circle;
