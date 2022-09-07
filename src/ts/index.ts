import { ZEngine } from './core/ZEngine';

const sourcePath = process.argv[2];
const targetDir = process.argv[3];

ZEngine.run(sourcePath, targetDir)
