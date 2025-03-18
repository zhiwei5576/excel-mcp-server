import * as XLSX from 'xlsx';

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