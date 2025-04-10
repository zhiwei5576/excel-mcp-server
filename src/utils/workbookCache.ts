import type { WorkBook } from 'xlsx'
import type { EnsureWorkbookResult } from '../types/index.js'

interface CacheItem {
  workbook: WorkBook;
  timestamp: number;
}

import { getConfig } from './config.js';

class WorkbookCache {
  private cache = new Map<string, CacheItem>();
  private readonly maxAge: number;
  private readonly cleanupInterval: number;

  constructor() {
    const config = getConfig();
    this.maxAge = config.cache.maxAge;
    this.cleanupInterval = config.cache.cleanupInterval;

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

  set(filePathWithName: string, workbook: WorkBook): void {
    this.cache.set(filePathWithName, {
      workbook,
      timestamp: Date.now()
    });
  }

  get(filePathWithName: string): WorkBook | undefined {
    const item = this.cache.get(filePathWithName);
    if (!item) return undefined;
    
    // 检查是否过期
    if (Date.now() - item.timestamp > this.maxAge) {
      this.delete(filePathWithName);
      return undefined;
    }
    
    return item.workbook;
  }

  ensureWorkbook(filePathWithName: string): EnsureWorkbookResult {
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
  delete(filePathWithName: string): boolean {
    if (!this.cache.has(filePathWithName)) return false
    return this.cache.delete(filePathWithName)
  }

  // 清空缓存
  clear(): void {
    this.cache.clear()
  }

  // 检查是否存在
  has(filePathWithName: string): boolean {
    return this.cache.has(filePathWithName)
  }
}

export const workbookCache = new WorkbookCache();