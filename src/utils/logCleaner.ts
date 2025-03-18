import fs from 'fs';
import path from 'path';

export class LogCleaner {
    private logDir: string;
    private retentionDays: number;
    private interval: NodeJS.Timeout | null = null;  // 修改这里的类型声明

    constructor(logDir: string, retentionDays: number = 7) {
        this.logDir = logDir;
        this.retentionDays = retentionDays;
    }

    start(intervalHours: number = 24) {
        // 立即执行一次清理
        this.cleanOldLogs();
        // 设置定时任务
        this.interval = setInterval(() => {
            this.cleanOldLogs();
        }, intervalHours * 60 * 60 * 1000);
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