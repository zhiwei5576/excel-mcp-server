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
            //在指定目录下创建子目录excel-mcp-server-logs
            const subDir = 'excel-mcp-server-logs';
            const subDirPath = path.join(config.logPath, subDir);
            if (!fs.existsSync(subDirPath)) {
                fs.mkdirSync(subDirPath, { recursive: true });
            }
            fs.accessSync(subDirPath);
            logPath = subDirPath;
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
