import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

interface Config {
    logPath: string;
    cache: {
        maxAge: number;        // 缓存过期时间（毫秒）
        cleanupInterval: number; // 清理间隔（毫秒）
    };
    log: {
        retentionDays: number;    // 日志保留天数
        cleanupInterval: number;   // 清理间隔（小时）
    };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getConfig(): Config {
    return {
        logPath: process.env.LOG_PATH || '',
        cache: {
            maxAge: Number(process.env.CACHE_MAX_AGE) || 1000 * 60 * 60, // 默认1小时
            cleanupInterval: Number(process.env.CACHE_CLEANUP_INTERVAL) || 1000 * 60 * 60 * 4, // 默认4小时
        },
        log: {
            retentionDays: Number(process.env.LOG_RETENTION_DAYS) || 7,    // 默认7天
            cleanupInterval: Number(process.env.LOG_CLEANUP_INTERVAL) || 24 // 默认24小时
        }
    };
}

export function getLogPath(): string {
    const config = getConfig();
    let logPath: string;

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
        } catch (error) {
            console.log(`LOG_PATH environment variable specifies an invalid or inaccessible path: ${config.logPath}, using default path instead.`);
            logPath = path.join(__dirname, '../logs');
            // 检查默认目录是否存在，不存在则创建
            if (!fs.existsSync(logPath)) {
                fs.mkdirSync(logPath, { recursive: true });
            }
        }
    } else {
        logPath = path.join(__dirname, '../logs');
        // 检查默认目录是否存在，不存在则创建
        if (!fs.existsSync(logPath)) {
            fs.mkdirSync(logPath, { recursive: true });
        }
    }

    return logPath;
}