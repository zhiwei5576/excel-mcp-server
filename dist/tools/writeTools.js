import { z } from "zod";
import { fileExists, normalizePath } from "../utils/utils.js";
import { writeDataBySheetName, writeSheetData } from '../handlers/excelHandlers.js';
export const writeTools = (server) => {
    server.tool("writeDataBySheetName", 'Write data to a specific sheet in the Excel file (overwrites if sheet exists)', {
        fileAbsolutePath: z.string().describe("The absolute path of the Excel file"),
        sheetName: z.string().describe("The name of the sheet to write"),
        data: z.array(z.record(z.string(), z.any())).describe("Array of objects to write to the sheet")
    }, async (params) => {
        try {
            const normalizedPath = await normalizePath(params.fileAbsolutePath);
            if (normalizedPath === 'error') {
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `Invalid file path: ${params.fileAbsolutePath}`,
                                suggestion: "Please verify the file path and name"
                            })
                        }]
                };
            }
            // 校验数据结构
            if (!Array.isArray(params.data) || params.data.length === 0) {
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: "Empty data array provided",
                                suggestion: "Please provide non-empty array of data"
                            })
                        }]
                };
            }
            // 校验工作表名称
            if (!params.sheetName) {
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: "Invalid sheet name",
                                suggestion: "Please provide a valid sheet name"
                            })
                        }]
                };
            }
            await writeDataBySheetName(normalizedPath, params.sheetName, params.data);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: `Data written successfully to sheet '${params.sheetName}' in file: ${normalizedPath}`
                        })
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: `Failed to write sheet data: ${error}`,
                            suggestion: "Please verify all parameters and try again"
                        })
                    }]
            };
        }
    });
    server.tool("writeSheetData", 'Create a new Excel file with provided data', {
        fileAbsolutePath: z.string().describe("The absolute path for the new Excel file"),
        data: z.record(z.string(), // 表名（动态）
        z.array(// 表数据数组
        z.record(// 每行数据对象
        z.string(), // 字段名（动态）
        z.any() // 字段值（任意类型）
        ))).describe("Data object with dynamic sheet names and column names")
    }, async (params) => {
        try {
            const normalizedPath = await normalizePath(params.fileAbsolutePath);
            if (normalizedPath === 'error') {
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `Invalid file path: ${params.fileAbsolutePath}`,
                                suggestion: "Please verify the file path and name"
                            })
                        }]
                };
            }
            // 校验数据结构
            if (Object.keys(params.data).length === 0) {
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: "Empty data object provided",
                                suggestion: "Please provide at least one sheet with data"
                            })
                        }]
                };
            }
            // 校验每个表的数据
            for (const [sheetName, sheetData] of Object.entries(params.data)) {
                if (!Array.isArray(sheetData) || sheetData.length === 0) {
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    error: `Invalid data format in sheet "${sheetName}": Data must be a non-empty array`,
                                    suggestion: "Please check the data format of each sheet"
                                })
                            }]
                    };
                }
            }
            if (await fileExists(normalizedPath)) {
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `File already exists: ${params.fileAbsolutePath}`,
                                suggestion: "Please specify a different file path"
                            })
                        }]
                };
            }
            await writeSheetData(normalizedPath, params.data);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: `Excel file created successfully: ${normalizedPath}`
                        })
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: `Failed to write Excel data: ${error}`,
                            suggestion: "Please verify the data format and file path"
                        })
                    }]
            };
        }
    });
};
