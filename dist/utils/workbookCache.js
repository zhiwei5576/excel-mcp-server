import { getConfig } from './config.js';
class WorkbookCache {
    constructor() {
        this.cache = new Map();
        const config = getConfig();
        // 将小时转换为毫秒
        this.maxAge = config.cache.maxAge * 60 * 60 * 1000;
        this.cleanupInterval = config.cache.cleanupInterval * 60 * 60 * 1000;
        // 创建定时器，定期清理过期缓存
        setInterval(() => {
            const now = Date.now();
            for (const [key, item] of this.cache.entries()) {
                if (now - item.timestamp > this.maxAge) {
                    this.delete(key);
                }
            }
        }, this.cleanupInterval);
    }
    set(filePathWithName, workbook) {
        this.cache.set(filePathWithName, {
            workbook,
            timestamp: Date.now()
        });
    }
    get(filePathWithName) {
        const item = this.cache.get(filePathWithName);
        if (!item)
            return undefined;
        // 检查是否过期
        if (Date.now() - item.timestamp > this.maxAge) {
            this.delete(filePathWithName);
            return undefined;
        }
        return item.workbook;
    }
    ensureWorkbook(filePathWithName) {
        const workbook = this.get(filePathWithName);
        if (!workbook) {
            return {
                success: false
            };
        }
        return {
            success: true,
            data: workbook
        };
    }
    // 删除工作簿
    delete(filePathWithName) {
        if (!this.cache.has(filePathWithName))
            return false;
        return this.cache.delete(filePathWithName);
    }
    // 清空缓存
    clear() {
        this.cache.clear();
    }
    // 检查是否存在
    has(filePathWithName) {
        return this.cache.has(filePathWithName);
    }
}
export const workbookCache = new WorkbookCache();
