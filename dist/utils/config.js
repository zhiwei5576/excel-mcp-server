import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function getConfig() {
    return {
        logPath: process.env.LOG_PATH || '',
    };
}
export function getLogPath() {
    const config = getConfig();
    let logPath;
    if (config.logPath) {
        try {
            fs.accessSync(config.logPath);
            logPath = config.logPath;
        }
        catch (error) {
            console.log(`LOG_PATH environment variable specifies an invalid or inaccessible path: ${config.logPath}, using default path instead.`);
            logPath = path.join(__dirname, '../logs');
            // 检查默认目录是否存在，不存在则创建
            if (!fs.existsSync(logPath)) {
                fs.mkdirSync(logPath, { recursive: true });
            }
        }
    }
    else {
        logPath = path.join(__dirname, '../logs');
        // 检查默认目录是否存在，不存在则创建
        if (!fs.existsSync(logPath)) {
            fs.mkdirSync(logPath, { recursive: true });
        }
    }
    return logPath;
}
