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

        cmdObject.hasExecuted = false;

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
            case 'checkout': {
                if (cmdTokens[2] === '-b') {
                    console.log(`TODO: Branch from ${tree.currentBranchNode.id} to ${cmdTokens[3]}`);
                    console.log(`TODO: Checkout new branch ${cmdTokens[3]}`);
                }
                else {
                    this.checkout(operationType, cmdTokens[2], tree, cmdObject, history);
                }
                break;
            }

            case 'branch': {
                this.branch(operationType, cmdTokens[2], tree, cmdObject, history);
                break;
            }

            case 'commit': {
                this.commit(operationType, tree, cmdObject, history);
                break;
            }

            case 'rebase': {
                console.log(`Rebase to ${cmdTokens[2]} from ${cmdTokens[3]}`);
                break;
            }

            default: {
                console.log(`PUSHED`);
                break;
            }
        }
        
        cmdObject.hasExecuted = true;
    }

    checkout(operationType, branchName, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                cmdObject.undoInfo['checkoutBranchName'] = tree.currentBranchName;
                tree.setCurrentBranch(branchName);
                console.log(`Current branch set to: Name = ${tree.currentBranchName}, Node ID = ${tree.currentBranchNode.id}`);

                break;
            }

            case 'undo': {
                let undoCmdObject = history.pop();
                tree.setCurrentBranch(undoCmdObject.undoInfo.checkoutBranchName);
            
                break;
            }
            
            default: {
                console.log('Invalid chekcout command');
                break;
            }
        }
    }

    commit(operationType, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                cmdObject.undoInfo['checkoutBranchName'] = tree.currentBranchName;
                cmdObject.undoInfo['checkoutNodeId'] = tree.currentBranchNode.id;

                console.log(`Committing on current branch: Name = ${tree.currentBranchName}, Node ID = ${tree.currentBranchNode.id}`);

                let n = new Node(tree.nextId, 35);
                tree.addToId(tree.currentBranchNode.id, n);

                tree.switchBranch(tree.currentBranchName, tree.currentBranchNode, n);
                
                cmdObject.undoInfo['removeNodeId'] = n.id;

                break;
            }

            case 'undo': {
                let undoCmdObject = history.pop();
                tree.attachCurrentBranchToNode(undoCmdObject.undoInfo.checkoutBranchName, undoCmdObject.undoInfo.checkoutNodeId);
                tree.markNodeIdForDeletion(undoCmdObject.undoInfo.removeNodeId);
                
                break;
            }

            default: {
                console.log('Invalid commit command');
                break;
        
            }
    
        }
    }

    branch(operationType, branchName, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                let node = tree.currentBranchNode;
                node.addBranch(branchName);
                
                break;
            }

            case 'undo': {
                console.log('TODO: Undo branch');
                break;
            }
            
            default: {
                console.log('Invalid branch command');
                console.log(tree);
                console.log(cmdObject);
                console.log(history);
                break;
            }
        }
    }
}

export default CommandHandler;
