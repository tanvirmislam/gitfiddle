import Node from './node';

class CommandHandler {
    #_regex;

    constructor() {
        this._regex = /(^\bgit\b ((\b(checkout -b|checkout|branch)\b \b[A-Za-z0-9]{2,}\b)|(\brebase\b \b[A-Za-z0-9]{2,}\b \b[A-Za-z0-9]{2,}\b)|(\bcommit\b))$)|(^undo$)/g;
    }

    process(cmdObject, tree, history) {
        let command = cmdObject.command;

        let found = command.match(this._regex);

        if (found === null || found.length !== 1 || command !== found[0]) {
            console.log(`CommandHandler::process error: invalid command ${command}`);
            return;
        }

        let cmdTokens = command.split(' ');
        let operationType = '';

        if (cmdTokens[0] === 'undo') {
            operationType = 'undo';
            cmdTokens = history[history.length - 1].command.split(' ');
        }
        else {
            operationType = 'do';
            history.push(cmdObject);
        }

        switch (cmdTokens[1]) {
            case 'checkout':
                if (cmdTokens[2] === '-b') {
                    console.log(`TODO: Branch from ${tree.currentBranchNode.id} to ${cmdTokens[3]}`);
                    console.log(`TODO: Checkout new branch ${cmdTokens[3]}`);
                }
                else {
                    this.checkout(operationType, cmdTokens[2], tree, cmdObject, history);
                }
                break;
            case 'branch':
                console.log(`TODO: Branch from ${tree.currentBranchNode.id} to ${cmdTokens[2]}`);
                break;
            case 'commit': {
                this.commit(operationType, tree, cmdObject, history);
                break;
            }
            case 'rebase':
                console.log(`Rebase to ${cmdTokens[2]} from ${cmdTokens[3]}`);
                break;
            default:
                console.log(`PUSHED`);
                break;
        }
        
        cmdObject.hasExecuted = true;
    }

    checkout(operationType, branchName, tree, cmdObject, history) {
        if (operationType === 'do') {
            cmdObject.undoInfo['checkoutBranchName'] = tree.currentBranchName;
            
            tree.setCurrentBranch(branchName);
            console.log(`Current branch set to: Name = ${tree.currentBranchName}, Node ID = ${tree.currentBranchNode.id}`);
        }
        else if (operationType === 'undo') {
            let undoCmdObject = history.pop();
            tree.setCurrentBranch(undoCmdObject.undoInfo.checkoutBranchName);
        }
        else {
            console.log('Invalid chekcout command');
        }
    }

    commit(operationType, tree, cmdObject, history) {
        if (operationType === 'do') {
            cmdObject.undoInfo['checkoutBranchName'] = tree.currentBranchName;
            cmdObject.undoInfo['checkoutNodeId'] = tree.currentBranchNode.id;

            console.log(`Committing on current branch: Name = ${tree.currentBranchName}, Node ID = ${tree.currentBranchNode.id}`);

            let newNodeId = tree.currentBranchNode.id + '-' + (tree.currentBranchNode.children.length+1);
            let n = new Node(newNodeId, 35);
            tree.addToId(tree.currentBranchNode.id, n);

            tree.branchNameToNodeDict[tree.currentBranchName] = n;
            
            cmdObject.undoInfo['removeNodeId'] = n.id;
        }
        else if (operationType === 'undo') {
            let undoCmdObject = history.pop();
            tree.attachCurrentBranchToNode(undoCmdObject.undoInfo.checkoutBranchName, undoCmdObject.undoInfo.checkoutNodeId);
            tree.markNodeIdForDeletion(undoCmdObject.undoInfo.removeNodeId);
        }
        else {
            console.log('Invalid commit command');
        }
    }

}

export default CommandHandler;
