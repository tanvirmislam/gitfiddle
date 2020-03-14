import Node from './node';

class CommandHandler {
    #_regex;

    constructor() {
        this._regex = /\bgit\b ((\b(checkout -b|checkout|branch)\b \b[A-Za-z0-9]{2,}\b)|(\brebase\b \b[A-Za-z0-9]{2,}\b \b[A-Za-z0-9]{2,}\b)|(\bcommit\b))/g;
    }

    process(input, tree) {
        let found = input.match(this._regex);
        if (found === null || found.length !== 1 || input !== found[0]) {
            console.log(`CommandHandler::process error: invalid command ${input}`);
            return;
        }

        let cmdTokens = input.split(' ');

        switch (cmdTokens[1]) {
            case 'checkout':
                if (cmdTokens[2] === '-b') {
                    console.log(`TODO: Branch from ${tree.currentBranchNode.id} to ${cmdTokens[3]}`);
                    console.log(`TODO: Checkout new branch ${cmdTokens[3]}`);
                }
                else {
                    this.do_checkout(tree, cmdTokens[2]);
                }
                break;
            case 'branch':
                console.log(`TODO: Branch from ${tree.currentBranchNode.id} to ${cmdTokens[2]}`);
                break;
            case 'commit': {
                this.do_commit(tree);
                break;
            }
            case 'rebase':
                console.log(`Rebase to ${cmdTokens[2]} from ${cmdTokens[3]}`);
                break;
            default:
                console.log(`PUSHED`);
                break;
        }   
    }

    do_checkout(tree, branchName) {
        tree.setCurrentBranch(branchName);
        console.log(`Current branch set to: Name = ${tree.currentBranchName}, Node ID = ${tree.currentBranchNode.id}`);
    }

    do_commit(tree) {
        console.log(`Committing on current branch: Name = ${tree.currentBranchName}, Node ID = ${tree.currentBranchNode.id}`);

        let newNodeId = tree.currentBranchNode.id + '-' + (tree.currentBranchNode.children.length+1);
        let n = new Node(newNodeId, 35);
        tree.addToId(tree.currentBranchNode.id, n);

        tree.branchNameToNodeDict[tree.currentBranchName] = n;
    }

}

export default CommandHandler;
