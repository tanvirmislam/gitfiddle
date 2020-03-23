import Node from './node';

class CommandHandler {
    #_regex;

    constructor() {    
        this._regex = /(^\b(git|Git)\b ((\b(branch|checkout -b|checkout|merge|rebase)\b \b[A-Za-z0-9]{2,}\b)|(\bcommit\b))$)|(^undo$)/g;
    }

    getValidCommands(cmd) {
        let found = cmd.match(this._regex);
        if (found === null || found.length !== 1 || cmd !== found[0]) {
            console.log(`CommandHandler error: invalid command ${cmd}`);
            return [];
        }

        let validCommands = [];
        let cmdTokens = cmd.split(' ');
        
        if (cmdTokens.length <= 3) {
            validCommands.push(cmd);
        }
        else {
            if (cmdTokens[1] === 'checkout') {
                if (cmdTokens[2] === '-b') {
                    validCommands.push(`${cmdTokens[0]} branch ${cmdTokens[3]}`);
                }
                validCommands.push(`${cmdTokens[0]} checkout ${cmdTokens[3]}`);
            }
        }
        
        return validCommands;
    }

    process(cmdObject, tree, history) {
        cmdObject.hasExecuted = false;

        let command = cmdObject.command;
        let cmdTokens = command.split(' ');
        let operationType = '';

        if (cmdTokens[0] === 'undo') {
            if (history.length === 0) {
                return;
            }
            operationType = 'undo';
            cmdTokens = history[history.length - 1].command.split(' ');
        }
        else {
            operationType = 'do';
            history.push(cmdObject);
        }

        switch (cmdTokens[1]) {
            case 'branch': {
                this.branch(operationType, cmdTokens[2], tree, cmdObject, history);
                break;
            }

            case 'checkout': {
                this.checkout(operationType, cmdTokens[2], tree, cmdObject, history);
                break;
            }

            case 'commit': {
                this.commit(operationType, tree, cmdObject, history);
                break;
            }

            case 'merge': {
                this.merge(operationType, cmdTokens[2], tree, cmdObject, history);
                break;
            }

            case 'rebase': {
                this.rebase(operationType, cmdTokens[2], tree);
                break;
            }

            default: {
                break;
            }
        }
        
        cmdObject.hasExecuted = true;
    }

    branch(operationType, branchName, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                cmdObject.undoInfo['nodeId'] = tree.currentBranchNode.id;
                cmdObject.undoInfo['branchName'] = branchName;
                tree.addBranchToNode(tree.currentBranchNode, branchName);
                break;
            }

            case 'undo': {
                let poppedCmdObject = history.pop();
                tree.removeBranchFromNodeId(poppedCmdObject.undoInfo['nodeId'], poppedCmdObject.undoInfo['branchName']);
                break;
            }
            
            default: {
                console.log('Invalid branch command');
                break;
            }
        }
    }

    checkout(operationType, branchName, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                cmdObject.undoInfo['branchName'] = tree.currentBranchName;
                tree.setCurrentBranch(branchName);
                break;
            }

            case 'undo': {
                let poppedCmdObject = history.pop();
                tree.setCurrentBranch(poppedCmdObject.undoInfo['branchName']);
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
                let newNode = new Node(tree.nextId, 35);

                cmdObject.undoInfo['checkoutBranchName'] = tree.currentBranchName;
                cmdObject.undoInfo['checkoutNodeId'] = tree.currentBranchNode.id;
                cmdObject.undoInfo['removeNodeId'] = newNode.id;
                
                tree.addChildToNode(tree.currentBranchNode, newNode);
                tree.switchBranch(tree.currentBranchName, tree.currentBranchNode, newNode);

                break;
            }

            case 'undo': {
                let poppedCmdObject = history.pop();

                tree.attachExistingBranchToNode(poppedCmdObject.undoInfo['checkoutBranchName'], poppedCmdObject.undoInfo['checkoutNodeId']);
                tree.setCurrentBranch(poppedCmdObject.undoInfo['checkoutBranchName']);
                tree.markNodeIdForDeletion(poppedCmdObject.undoInfo['removeNodeId']);
                
                break;
            }

            default: {
                console.log('Invalid commit command');
                break;
            }
        }
    }

    merge(operationType, mergeWithBranchName, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                let mergeWithNode = tree.getNodeFromBranchName(mergeWithBranchName);

                if (mergeWithNode !== undefined) {
                    for (let i = 0; i < tree.currentBranchNode.parents.length; ++i) {
                        if (tree.currentBranchNode.parents[i] === mergeWithNode) {
                            history.pop();
                            return;
                        }
                    }

                    cmdObject.undoInfo['removeParentNodeId'] = mergeWithNode.id;
                    this.commit('do', tree, cmdObject, history);
                    tree.currentBranchNode.addParent(mergeWithNode);
                }

                break;
            }

            case 'undo': {
                tree.currentBranchNode.removeParent(cmdObject.undoInfo['removeParentNodeId']);
                this.commit('undo', tree, cmdObject, history);
                break;
            }

            default: {
                console.log('Invalid merge command');
                break;
            }
        }
    }

    rebase(operationType, branchName, tree) {
        switch (operationType) {
            case 'do': {
                if (tree.currentBranchName === branchName) {
                    history.pop();
                    return;
                }

                let currentNode = tree.currentBranchNode;
                let rebaseNode = tree.getNodeFromBranchName(branchName);

                if (rebaseNode.hasChild(currentNode)) {
                    history.pop();
                    return;
                }
                else if (currentNode.hasChild(rebaseNode)) {
                    tree.switchBranch(tree.currentBranchName, currentNode, rebaseNode);
                    return;
                }

                let lcaInfo = tree.getLCAInfo(currentNode, rebaseNode);
                let count = tree.getNodeCountTillAncestor(currentNode, lcaInfo.lcaNode);

                console.log('\nPaths from current node to root: ');
                for (let i = 0; i < lcaInfo.currentNodePathsToRoot.length; ++i) {
                    let path = '';
                    for (let j = 0; j < lcaInfo.currentNodePathsToRoot[i].length; ++j) {
                        path += lcaInfo.currentNodePathsToRoot[i][j].id + ' ';
                    }
                    console.log(path + '\n');
                }

                console.log('Paths from rebase node to root');
                for (let i = 0; i < lcaInfo.rebaseNodePathsToRoot.length; ++i) {
                    let path = '';
                    for (let j = 0; j < lcaInfo.rebaseNodePathsToRoot[i].length; ++j) {
                        path += lcaInfo.rebaseNodePathsToRoot[i][j].id + ' ';
                    }
                    console.log(path);
                }

                console.log(`LCA Node: ${lcaInfo.lcaNode.id}`);
                console.log(`Node count from current node till LCA Node: ${count}`);

                break;
            }

            default: {
                break;
            }
        }
    }
}

export default CommandHandler;
