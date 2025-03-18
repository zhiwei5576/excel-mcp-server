import fs from 'fs';
import path from 'path';
export class LogCleaner {
    constructor(logDir, retentionDays = 7) {
        this.interval = null; // 修改这里的类型声明
        this.logDir = logDir;
        this.retentionDays = retentionDays;
    }
    start(intervalHours = 24) {
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
    cleanOldLogs() {
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
        }
        catch (error) {
            console.error('Error cleaning log files:', error);
        }
    }
}
