import { workbookCache } from "../utils/workbookCache.js";
import * as XLSX from 'xlsx'
import { logToFile,fileExists } from '../utils/utils.js';
import { readAndCacheFile } from "../utils/excelUtils.js";
import type { EnsureWorkbookResult, ReadSheetNamesResult, SheetData ,ExcelStructure} from '../types/index.js';
export async function readSheetNames(filePathWithName: string): Promise<string[]> {


    try {
        //从缓存中获取workbook
        const workbookResult: EnsureWorkbookResult = workbookCache.ensureWorkbook(filePathWithName);

        if (!workbookResult.success) {
            // 缓存中没有workbook，尝试读取并缓存文件
            const readResult: ReadSheetNamesResult = await readAndCacheFile(filePathWithName);
            if (!readResult.success) {
                // 读取文件失败，返回错误信息
                throw new Error(`read file failure: ${readResult.data.errors}`);
            } else {
                return readResult.data.SheetNames;
            }

        } else {
            const workbook = workbookResult.data as XLSX.WorkBook;
            return workbook.SheetNames
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`read file failure: ${errorMessage}`);
    }
}

export async function readDataBySheetName(
    filePathWithName: string,
    sheetName: string,
    headerRow: number = 1,  // 默认第一行为表头
    dataStartRow: number = 2  // 默认第二行开始为数据
): Promise<any> {
    try {
        const workbookResult: EnsureWorkbookResult = workbookCache.ensureWorkbook(filePathWithName);
        let workbook: XLSX.WorkBook;

        if (!workbookResult.success) {
            const readResult: ReadSheetNamesResult = await readAndCacheFile(filePathWithName);
            if (!readResult.success) {
                throw new Error(`read file failure: ${readResult.data.errors}`);
            }
            workbook = workbookCache.get(filePathWithName)!;
        } else {
            workbook = workbookResult.data as XLSX.WorkBook;
        }

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            throw new Error(`sheet ${sheetName} not found`);
        }

        // 将 Excel 行号转换为数组索引（减1）
        const headerIndex = headerRow - 1;
        const dataStartIndex = dataStartRow - 1;

        // 获取原始数据
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
            raw: true,
            defval: '',
            header: 1
        });

        if (rawData.length <= headerIndex) {
            throw new Error(`sheet is empty or header row (${headerRow}) exceeds sheet length`);
        }

        // 获取表头
        const headers = rawData[headerIndex] as string[];

        // 验证数据起始行
        if (rawData.length <= dataStartIndex) {
            throw new Error(`data start row (${dataStartRow}) exceeds sheet length`);
        }

        // 处理数据行
        const dataRows = rawData.slice(dataStartIndex);
        const result = dataRows.map((row: any) => {
            const item: { [key: string]: any } = {};
            headers.forEach((header, index) => {
                if (header) {
                    item[header] = row[index] || '';
                }
            });
            return item;
        });

        return result;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`read sheet data failure: ${errorMessage}`);
    }
}

export async function readAllSheetData(
    filePathWithName: string,
    headerRow: number = 1,
    dataStartRow: number = 2
): Promise<{ [sheetName: string]: any[] }> {
    try {
        const workbookResult: EnsureWorkbookResult = workbookCache.ensureWorkbook(filePathWithName);
        let workbook: XLSX.WorkBook;

        if (!workbookResult.success) {
            const readResult: ReadSheetNamesResult = await readAndCacheFile(filePathWithName);
            if (!readResult.success) {
                throw new Error(`Failed to read file: ${readResult.data.errors}`);
            }
            workbook = workbookCache.get(filePathWithName)!;
        } else {
            workbook = workbookResult.data as XLSX.WorkBook;
        }

        const result: { [sheetName: string]: any[] } = {};
        const headerIndex = headerRow - 1;
        const dataStartIndex = dataStartRow - 1;

        // 遍历所有工作表
        for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];

            // 获取原始数据
            const rawData = XLSX.utils.sheet_to_json(worksheet, {
                raw: true,
                defval: '',
                header: 1
            });

            if (rawData.length <= headerIndex) {
                await logToFile(`Sheet ${sheetName} is empty or header row (${headerRow}) exceeds sheet length`);
                continue;
            }

            // 获取表头
            const headers = rawData[headerIndex] as string[];

            // 验证数据起始行
            if (rawData.length <= dataStartIndex) {
                await logToFile(`Sheet ${sheetName} data start row (${dataStartRow}) exceeds sheet length`);
                continue;
            }

            // 处理数据行
            const dataRows = rawData.slice(dataStartIndex);
            result[sheetName] = dataRows.map((row: any) => {
                const item: { [key: string]: any } = {};
                headers.forEach((header, index) => {
                    if (header) {
                        item[header] = row[index] || '';
                    }
                });
                return item;
            });
        }

        return result;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read Excel data: ${errorMessage}`);
    }
}


export async function writeSheetData(
    filePathWithName: string,
    data: SheetData
): Promise<boolean> {
    try {
        // 创建新的工作簿
        const workbook = XLSX.utils.book_new();

        // 遍历数据对象的每个工作表
        for (const [sheetName, sheetData] of Object.entries(data)) {
            // 将数据转换为工作表
            const worksheet = XLSX.utils.json_to_sheet(sheetData);

            // 将工作表添加到工作簿
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        }

        // 写入文件
        XLSX.writeFile(workbook, filePathWithName);

        return true;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to write Excel data: ${errorMessage}`);
    }
}

export async function writeDataBySheetName(
    filePathWithName: string,
    sheetName: string,
    data: any[]
): Promise<boolean> {
    try {
        let workbook: XLSX.WorkBook;


        // 检查文件是否存在，注：filePathWithName ,已经经过了normalizePath
        if (await fileExists(filePathWithName)) {
            // 如果文件存在，读取现有工作簿
            const workbookResult = workbookCache.ensureWorkbook(filePathWithName);
            if (!workbookResult.success) {
                const readResult = await readAndCacheFile(filePathWithName);
                if (!readResult.success) {
                    throw new Error(`Failed to read existing file: ${readResult.data.errors}`);
                }
                workbook = workbookCache.get(filePathWithName)!;
            } else {
                workbook = workbookResult.data as XLSX.WorkBook;
            }
        } else {
            // 如果文件不存在，创建新的工作簿
            workbook = XLSX.utils.book_new();
        }

        // 将数据转换为工作表
        const worksheet = XLSX.utils.json_to_sheet(data);

        // 检查工作表是否已存在
        if (workbook.SheetNames.includes(sheetName)) {
            // 如果存在，删除旧的工作表
            const index = workbook.SheetNames.indexOf(sheetName);
            workbook.SheetNames.splice(index, 1);
            delete workbook.Sheets[sheetName];
        }

        // 添加新的工作表
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // 写入文件
        XLSX.writeFile(workbook, filePathWithName);

        // 更新缓存
        workbookCache.set(filePathWithName, workbook);

        return true;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to write sheet data: ${errorMessage}`);
    }
}

export async function analyzeExcelStructure(
    filePathWithName: string,
    headerRows: number = 1
): Promise<ExcelStructure> {
    try {
        const workbookResult: EnsureWorkbookResult = workbookCache.ensureWorkbook(filePathWithName);
        let workbook: XLSX.WorkBook;

        if (!workbookResult.success) {
            const readResult = await readAndCacheFile(filePathWithName);
            if (!readResult.success) {
                throw new Error(`Failed to read file: ${readResult.data.errors}`);
            }
            workbook = workbookCache.get(filePathWithName)!;
        } else {
            workbook = workbookResult.data as XLSX.WorkBook;
        }

        const result: ExcelStructure = {
            sheetList: [],
            sheetField: []
        };

        result.sheetList = workbook.SheetNames.map((sheetName, index) => ({
            SheetNo: index + 1,  // 添加从1开始的序号
            SheetName: sheetName
        }));
        // 遍历所有工作表
        for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            
            // 获取原始数据
            const rawData = XLSX.utils.sheet_to_json(worksheet, {
                raw: true,
                defval: '',
                header: 1
            });

            if (rawData.length === 0) {
                continue;
            }
            // 获取每列的数据
            const columnCount = (rawData[0] as any[]).length;
            for (let colIndex = 0; colIndex < columnCount; colIndex++) {
                const fieldInfo: any = {
                    SheetName: sheetName
                };

                // 根据 headerRows 获取指定数量的表头行
                for (let i = 1; i <= headerRows; i++) {
                    const headerIndex = i - 1;
                    if (rawData.length > headerIndex) {
                        const rowData = rawData[headerIndex] as any[];
                        fieldInfo[`Field${i}`] = rowData[colIndex] || '';
                    } else {
                        fieldInfo[`Field${i}`] = '';
                    }
                }

                result.sheetField = result.sheetField || [];
                result.sheetField.push(fieldInfo);
            }
        }

        return  result
        // {
        //     // 修改 sheetList 的映射，添加 SheetNo
        //     sheetList: workbook.SheetNames.map((sheetName, index) => ({ 
        //         SheetNo: index + 1,  // 添加从1开始的序号
        //         SheetName: sheetName 
        //     })),
        //     sheetField: result.sheetField || []
        // };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to get Excel structure: ${errorMessage}`);
    }
}

export async function exportExcelStructure(
    sourceFilePath: string,
    targetFilePath: string,
    headerRows: number = 1
): Promise<boolean> {
    try {
        // 1. 获取源文件的结构
        const structure = await analyzeExcelStructure(sourceFilePath, headerRows);

        // 校验结构数据
        if (!structure.sheetList || !Array.isArray(structure.sheetList) || structure.sheetList.length === 0) {
            throw new Error('Invalid Excel structure: sheetList is empty or invalid');
        }

        if (!structure.sheetField || !Array.isArray(structure.sheetField) || structure.sheetField.length === 0) {
            throw new Error('Invalid Excel structure: sheetField is empty or invalid');
        }

        // 2. 转换为 SheetData 格式
        const data: SheetData = {
            'sheetList': structure.sheetList,
            'sheetField': structure.sheetField
        };

        // 3. 使用 writeSheetData 写入文件
        return await writeSheetData(targetFilePath, data);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to export Excel structure: ${errorMessage}`);
    }
}

