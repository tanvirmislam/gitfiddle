class Command {
    #_cmd;
    #_isExecuting;
    #_hasExecuted;
    #_undoInfo;

    constructor(cmd) {
        this._cmd = cmd;
        this._isExecuting = false;
        this._hasExecuted = false;
        this._undoInfo = {};
    }

    set isExecuting(val)    { this._isExecuting = val       }
    set hasExecuted(val)    { this._hasExecuted = val;      }
    set undoInfo(jsonInfo)  { this._undoInfo = jsonInfo     }

    get command()       { return this._cmd;         }
    get isExecuting()   { return this._isExecuting; }
    get hasExecuted()   { return this._hasExecuted; }
    get undoInfo()      { return this._undoInfo;    }
}

export default Command;
