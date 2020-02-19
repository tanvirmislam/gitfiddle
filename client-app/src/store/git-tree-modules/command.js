class Command {
    #_cmd;
    #_isExecuting;
    #_hasExecuted;
    #_snapshotBeforeExecution;

    constructor(cmd, treeState) {
        this._cmd = cmd;
        this._isExecuting = false;
        this._hasExecuted = false;
        this._snapshotBeforeExecution = treeState;
    }

    set isExecuting(val)    { this._isExecuting = val; }
    set hasExecuted(val)    { this._hasExecuted = val; }

    get command()       { return this._cmd; }
    get isExecuting()   { return this._isExecuting; }
    get hasExecuted()   { return this._hasExecuted; }
}

export default Command;
