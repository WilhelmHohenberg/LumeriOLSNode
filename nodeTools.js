class NodeTools {
    getInfo() {
        return {
            id: 'nodetools',
            name: 'Node Tools',
            blocks: [
                {
                    opcode: 'runCommand',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'run command [CMD]',
                    arguments: {
                        CMD: { type: Scratch.ArgumentType.STRING }
                    }
                }
            ]
        };
    }

    runCommand(args) {
        const { execSync } = require('child_process');
        execSync(`cmd.exe /c ${args.CMD}`);
    }
}

Scratch.extensions.register(new NodeTools());
