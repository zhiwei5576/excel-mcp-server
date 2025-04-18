import fs from 'fs';
import path from 'path';
import { getLogPath, getConfig } from './config.js';

export class LogCleaner {
    private logDir: string;
    private retentionDays: number;
    private interval: NodeJS.Timeout | null = null;

    constructor() {
        const config = getConfig();
        this.logDir = getLogPath();
        this.retentionDays = config.log.retentionDays;
    }

    start() {
        const config = getConfig();
        // 立即执行一次清理
        this.cleanOldLogs();
        // 设置定时任务
        this.interval = setInterval(() => {
            this.cleanOldLogs();
        }, config.log.cleanupInterval * 60 * 60 * 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    private cleanOldLogs() {
        try {
            const files = fs.readdirSync(this.logDir);
            const now = new Date();

            files.forEach(file => {
                if (file.endsWith('.log')) {
                    const filePath = path.join(this.logDir, file);
                    const stats = fs.statSync(filePath);
                    const fileAge = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

                    if (fileAge > this.retentionDays) {
                        fs.unlinkSync(filePath);
                    }
                }
            });
        } catch (error) {
            console.error('Error cleaning log files:', error);
        }
    }
}