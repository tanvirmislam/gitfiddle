import Node from './node';

class CommandHandler {
    #_supportedCommands;
    #_regex;

    constructor() {
        let cmd = [
            'git checkout',
            'git branch',
            'git checkout -b',
            'git commit',
            'git rebase',
            'git push'
        ];

        this._supportedCommands = new Set(cmd);
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
                    console.log(`Branch from ${tree.currentBranch.name} to ${cmdTokens[3]}`);
                    console.log(`Checkout ${cmdTokens[3]}`);
                    tree.currentBranch = cmdTokens[3];
                }
                else {
                    console.log(`Checkout ${cmdTokens[2]}`);
                    tree.currentBranch = cmdTokens[2];
                }
                break;
            case 'branch':
                console.log(`Branch from ${tree.currentBranch.name} to ${cmdTokens[2]}`);
                tree.currentBranch = cmdTokens[2];
                break;
            case 'commit': {
                console.log(`Commit on current branch`);
                let n = new Node(tree.currentBranch.name + '_' + tree.info.height.toString(), 500, 500, 35);
                tree.addNodeTo(tree.currentBranch.name, n);
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

}

export default CommandHandler;
