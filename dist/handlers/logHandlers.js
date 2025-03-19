import { LogCleaner } from "../utils/logCleaner.js";
import path from 'path';
import fs from 'fs';
export function initializeLogger(appDir) {
    // appDir 是 dist 目录，直接在其下创建 data/logs
    const logDir = path.join(appDir, 'data', 'logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    const logCleaner = new LogCleaner(logDir, 7);
    logCleaner.start(24);
    return logCleaner;
}
