class Command {
    #_cmd;
    #_isExecuting;
    #_hasExecuted;

    constructor(cmd) {
        this._cmd = cmd;
        this._isExecuting = false;
        this._hasExecuted = false;
    }

    set isExecuting(val)    { this._isExecuting = val; }
    set hasExecuted(val)    { this._hasExecuted = val; }

    get command()       { return this._cmd; }
    get isExecuting()   { return this._isExecuting; }
    get hasExecuted()   { return this._hasExecuted; }
}

export default Command;
