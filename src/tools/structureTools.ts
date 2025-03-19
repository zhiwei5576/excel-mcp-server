import { z } from "zod";
import { fileExists, normalizePath } from "../utils/utils.js";
import { analyzeExcelStructure, exportExcelStructure } from '../handlers/excelHandlers.js'

export const structureTools = (server: any) => {
    server.tool("analyzeExcelStructure", 'Get Excel file structure including sheet list and column headers in JSON format',
        {
            fileAbsolutePath: z.string().describe("The absolute path of the Excel file"),
            headerRows: z.number().default(1).describe("Number of header rows to read (default: 1)")
        },
        async (params: {
            fileAbsolutePath: string;
            headerRows: number;
        }) => {
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

                if (!(await fileExists(normalizedPath))) {
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `File not found: ${params.fileAbsolutePath}`,
                                suggestion: "Please verify the file path and name"
                            })
                        }]
                    };
                }

                const result = await analyzeExcelStructure(normalizedPath, params.headerRows);

                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify(result)
                    }]
                };

            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: `Failed to get Excel structure: ${error}`,
                            suggestion: "Please verify all parameters"
                        })
                    }]
                };
            }
        }
    );
    server.tool("exportExcelStructure", 'Export Excel file structure (sheets and headers) to a new Excel template file',
        {
            sourceFilePath: z.string().describe("The source Excel file path to analyze"),
            targetFilePath: z.string().describe("The target Excel file path to save structure"),
            headerRows: z.number().default(1).describe("Number of header rows to analyze (default: 1)")
        },
        async (params: {
            sourceFilePath: string;
            targetFilePath: string;
            headerRows: number;
        }) => {
            try {
                // 验证源文件路径
                const normalizedSourcePath = await normalizePath(params.sourceFilePath);
                if (normalizedSourcePath === 'error') {
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `Invalid source file path: ${params.sourceFilePath}`,
                                suggestion: "Please verify the source file path"
                            })
                        }]
                    };
                }

                // 验证源文件是否存在
                if (!(await fileExists(normalizedSourcePath))) {
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `Source file not found: ${params.sourceFilePath}`,
                                suggestion: "Please verify the source file exists"
                            })
                        }]
                    };
                }

                // 验证目标文件路径
                const normalizedTargetPath = await normalizePath(params.targetFilePath);
                if (normalizedTargetPath === 'error') {
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `Invalid target file path: ${params.targetFilePath}`,
                                suggestion: "Please verify the target file path"
                            })
                        }]
                    };
                }

                // 验证目标文件是否已存在
                if (await fileExists(normalizedTargetPath)) {
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `Target file already exists: ${params.targetFilePath}`,
                                suggestion: "Please specify a different target file path"
                            })
                        }]
                    };
                }

                // 导出结构
                await exportExcelStructure(normalizedSourcePath, normalizedTargetPath, params.headerRows);

                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: `Excel structure exported successfully to: ${normalizedTargetPath}`
                        })
                    }]
                };

            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: `Failed to export Excel structure: ${error}`,
                            suggestion: "Please verify all parameters and try again"
                        })
                    }]
                };
            }
        }
    );
}

