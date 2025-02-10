// src/index.ts
import TerminalSimulation from './simulation/terminal';

const terminal = new TerminalSimulation();

async function main() {
    await terminal.startSimulation();
}

main().catch(console.error);