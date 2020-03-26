import Node from '../tree/node';

class CommandHandler {
    #_regex;

    constructor() {    
        this._regex = /(^\b(git|Git)\b ((\b(branch|checkout -b|checkout|merge|rebase)\b \b[A-Za-z0-9_-]{2,}\b)|(\bcommit\b)|(\bpush\b))$)|(^undo$)/g;
    }

    /**
     * Get a list of valid commands from the given command input
     * Chops up merged commands like git checkout -b branch
     */
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

    /**
     * Process the given command object
     */
    process(cmdObject, tree, history) {
        cmdObject.hasExecuted = false;

        let command = cmdObject.command;
        let cmdTokens = command.split(' ');
        let operationType = '';

        if (cmdTokens[0] === 'undo') {
            // Return false if there's nothing to undo
            if (history.length === 0) {
                return false;
            }

            // Process the command in history
            operationType = 'undo';
            cmdTokens = history[history.length - 1].command.split(' ');
        }
        else {
            operationType = 'do';
        }

        let status;

        switch (cmdTokens[1]) {
            case 'branch': {
                status = this.branch(operationType, cmdTokens[2], tree, cmdObject, history);
                break;
            }

            case 'checkout': {
                status = this.checkout(operationType, cmdTokens[2], tree, cmdObject, history);
                break;
            }

            case 'commit': {
                status = this.commit(operationType, tree, cmdObject, history);
                break;
            }

            case 'merge': {
                status = this.merge(operationType, cmdTokens[2], tree, cmdObject, history);
                break;
            }

            case 'rebase': {
                status = this.rebase(operationType, cmdTokens[2], tree, cmdObject, history);
                break;
            }

            case 'push': {
                status = this.push(operationType, tree, cmdObject, history);
                break;
            }

            default: {
                status = false;
                break;
            }
        }
        
        cmdObject.hasExecuted = true;

        if (status && operationType !== 'undo') {
            history.push(cmdObject);
        }

        return status;
    }

    branch(operationType, branchName, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                if (tree.doesBranchExist(branchName)) {
                    return false;
                }

                cmdObject.undoInfo['removeBranchFromNodeId'] = tree.currentBranchNode.id;
                cmdObject.undoInfo['removeBranchName'] = branchName;

                tree.addBranchToNode(tree.currentBranchNode, branchName);

                break;
            }

            case 'undo': {
                let popped = history.pop();
                tree.removeBranchFromNodeId(popped.undoInfo['removeBranchFromNodeId'], popped.undoInfo['removeBranchName']);
                
                break;
            }
            
            default: {
                console.log('Invalid branch command');
                break;
            }
        }

        return true;
    }

    checkout(operationType, branchName, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                if (!tree.doesBranchExist(branchName)) {
                    return false;
                }

                cmdObject.undoInfo['branchName'] = tree.currentBranchName;

                tree.setCurrentBranch(branchName);

                break;
            }

            case 'undo': {
                let popped = history.pop();
                tree.setCurrentBranch(popped.undoInfo['branchName']);

                break;
            }
            
            default: {
                console.log('Invalid chekcout command');
                return false;
            }
        }

        return true;
    }

    commit(operationType, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                let newNode = new Node(tree.nextId, tree.nodeDiameter);

                cmdObject.undoInfo['checkoutBranchName'] = tree.currentBranchName;
                cmdObject.undoInfo['checkoutNodeId'] = tree.currentBranchNode.id;
                cmdObject.undoInfo['removeNodeId'] = newNode.id;
                
                tree.addChildToNode(tree.currentBranchNode, newNode);
                tree.switchBranch(tree.currentBranchName, tree.currentBranchNode, newNode);

                break;
            }

            case 'undo': {
                let popped = history.pop();

                tree.attachExistingBranchToNodeId(popped.undoInfo['checkoutBranchName'], popped.undoInfo['checkoutNodeId']);
                tree.setCurrentBranch(popped.undoInfo['checkoutBranchName']);
                tree.markNodeIdForDeletion(popped.undoInfo['removeNodeId']);
                
                break;
            }

            default: {
                console.log('Invalid commit command');
                return false;
            }
        }

        return true;
    }

    merge(operationType, mergeWithBranchName, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                if (!tree.doesBranchExist(mergeWithBranchName)) {
                    return false;
                }

                let mergeWithNode = tree.getNodeFromBranchName(mergeWithBranchName);

                if (mergeWithNode !== undefined) {
                    for (let i = 0; i < tree.currentBranchNode.parents.length; ++i) {
                        if (tree.currentBranchNode.parents[i] === mergeWithNode) {
                            return false;
                        }
                    }

                    cmdObject.undoInfo['mergedWithNodeId'] = mergeWithNode.id;

                    this.commit('do', tree, cmdObject, history);
                    tree.currentBranchNode.addParent(mergeWithNode);
                    mergeWithNode.addChild(tree.currentBranchNode);
                }

                break;
            }

            case 'undo': {
                // History will be popped at commit undo
                let currentNode = tree.currentBranchNode;
                let mergedWithNode = tree.getNodeFromId(history[history.length - 1].undoInfo['mergedWithNodeId']);

                currentNode.removeParent(mergedWithNode);
                mergedWithNode.removeChild(currentNode);

                this.commit('undo', tree, cmdObject, history);

                break;
            }

            default: {
                console.log('Invalid merge command');
                return false;
            }
        }

        return true;
    }

    rebase(operationType, branchName, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                if (!tree.doesBranchExist(branchName) || tree.currentBranchName === branchName) {
                    return false;
                }

                let currentNode = tree.currentBranchNode;
                let rebaseNode = tree.getNodeFromBranchName(branchName);

                if (rebaseNode.hasDescendent(currentNode)) {
                    return false;
                }
                else if (currentNode.hasDescendent(rebaseNode)) {
                    cmdObject.undoInfo['rebaseUndoType'] = 1;
                    cmdObject.undoInfo['switchBranchFromNodeId'] = rebaseNode.id;
                    cmdObject.undoInfo['switchBranchToNodeId'] = currentNode.id;
                    
                    tree.switchBranch(tree.currentBranchName, currentNode, rebaseNode);

                    break;
                }

                let lcaInfo = tree.getLCAInfo(currentNode, rebaseNode);
                let count = tree.getNodeCountTillAncestor(currentNode, lcaInfo.lcaNode);
                let branchSpecificPath = tree.getBranchSpecificPath(tree.currentBranchName);

                let createNodesInfo = [];
                let removeNodesInfo = [];

                let lastCommittedNode = rebaseNode;
                for (let i = 0; i < count; ++i) {
                    let newNode = new Node(tree.nextId, tree.nodeDiameter);
                    
                    tree.addChildToNode(lastCommittedNode, newNode);
                    lastCommittedNode = newNode;
                    removeNodesInfo.push(newNode.getNodeInfo());
                }

                for (let i = branchSpecificPath.length - 1; i >= 0; --i) {
                    createNodesInfo.push(branchSpecificPath[i].getNodeInfo());
                    tree.markNodeForDeletion(branchSpecificPath[i]);
                }
                
                cmdObject.undoInfo['rebaseUndoType'] = 2;
                cmdObject.undoInfo['createNodesInfo'] = createNodesInfo;
                cmdObject.undoInfo['removeNodesInfo'] = removeNodesInfo;
                cmdObject.undoInfo['switchBranchFromNodeId'] = lastCommittedNode.id;
                cmdObject.undoInfo['switchBranchToNodeId'] = tree.currentBranchNode.id;

                tree.switchBranch(tree.currentBranchName, tree.currentBranchNode, lastCommittedNode);

                break;
            }

            case 'undo': {
                let popped = history.pop();

                if (popped.undoInfo['rebaseUndoType'] == 1) {
                    let fromNode = tree.getNodeFromId(popped.undoInfo['switchBranchFromNodeId']);
                    let toNode = tree.getNodeFromId(popped.undoInfo['switchBranchToNodeId']);
                    tree.switchBranch(tree.currentBranchName, fromNode, toNode);
                }
                else {
                    for (let i = 0; i < popped.undoInfo['createNodesInfo'].length; ++i) {
                        let newNode = new Node(popped.undoInfo['createNodesInfo'][i]['id'], popped.undoInfo['createNodesInfo'][i]['diameter']);
                        
                        for (let j = 0; j < popped.undoInfo['createNodesInfo'][i]['parentIds'].length; ++j) {
                            let parentNode = tree.getNodeFromId(popped.undoInfo['createNodesInfo'][i]['parentIds'][j]);
                            tree.addChildToNode(parentNode, newNode);
                        }
                    }

                    let fromNode = tree.getNodeFromId(popped.undoInfo['switchBranchFromNodeId']);
                    let toNode = tree.getNodeFromId(popped.undoInfo['switchBranchToNodeId']);
                    tree.switchBranch(tree.currentBranchName, fromNode, toNode);

                    for (let i = 0; i < popped.undoInfo['removeNodesInfo'].length; ++i) {
                        let node = tree.getNodeFromId(popped.undoInfo['removeNodesInfo'][i]['id']);
                        tree.remove(node);
                    }
                }

                break;
            }

            default: {
                console.log('Invalid rebase command');
                return false;
            }
        }

        return true;
    }

    push (operationType, tree, cmdObject, history) {
        switch (operationType) {
            case 'do': {
                let pathsToRoot = tree.getPathsToNode(tree.currentBranchNode, tree.root);
                let pushedNodeIds = [];

                for (let i = 0; i < pathsToRoot.length; ++i) {
                    for (let j = 0; j < pathsToRoot[i].length; ++j) {
                        if (!pathsToRoot[i][j].isPushed) {
                            pathsToRoot[i][j].isPushed = true;
                            pushedNodeIds.push(pathsToRoot[i][j].id);
                        }
                    }
                }

                cmdObject.undoInfo['undoPushNodeIds'] = pushedNodeIds;
                
                break;
            }

            case 'undo': {
                let popped = history.pop();
                for (let i = 0; i < popped.undoInfo['undoPushNodeIds'].length; ++i) {
                    tree.getNodeFromId(popped.undoInfo['undoPushNodeIds'][i]).isPushed = false;
                }

                break;
            }

            default:
                console.log('Invalid push operation');
                return false;
        }

        return true;
    }
}

export default CommandHandler;
