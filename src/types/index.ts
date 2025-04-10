import * as XLSX from 'xlsx';

export interface Config {
    logPath: string;
    cache: {
        maxAge: number;        // 缓存过期时间（小时）
        cleanupInterval: number; // 清理间隔（小时）
    };
    log: {
        retentionDays: number;    // 日志保留天数
        cleanupInterval: number;   // 清理间隔（小时）
    };
}

export interface ReadSheetNamesResult {
    success: boolean;
    data: {
        SheetNames: string[];
        errors: string;
    };
}

export interface EnsureWorkbookResult {
    success: boolean;
    data?: XLSX.WorkBook;
}

export interface SheetData {
    [sheetName: string]: any[];
}

export interface ExcelStructure {
    sheetList: Array<{
        SheetNo: number;
        SheetName: string;
    }>;
    sheetField: Array<{
        SheetName: string;
        [key: `Field${number}`]: string;
    }>;
}