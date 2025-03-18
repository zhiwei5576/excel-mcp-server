import { z } from "zod";
import { fileExists, normalizePath } from "../utils/utils.js";
import { readAllSheetData, readDataBySheetName, readSheetNames } from '../handlers/excelHandlers.js'

export const readTools = (server: any) => {
    server.tool("readSheetNames", 'List all sheets names in the Excel file',
        {
            fileAbsolutePath: z.string().describe("The absolute path of the Excel file")
        },
        async (params: { fileAbsolutePath: string }) => {
            try {
                const normalizedPath = await normalizePath(params.fileAbsolutePath);
                if (normalizedPath === 'error') {
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `path is not valid: ${params.fileAbsolutePath}`,
                                suggestion: "please check the path and filename"
                            })
                        }]
                    };
                }
                if (!(await fileExists(normalizedPath))) {
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `file is not exist: ${params.fileAbsolutePath}`,
                                suggestion: "please check the path and filename"
                            })
                        }]
                    };

                }
                const result = await readSheetNames(normalizedPath);
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
                            error: `read sheet names failure: ${error}`,
                            suggestion: "please check the path and filename"
                        })
                    }]
                };
            }

        }
    );

    server.tool("readDataBySheetName", 'Get data from a specific sheet in the Excel file',
        {
            fileAbsolutePath: z.string().describe("The absolute path of the Excel file"),
            sheetName: z.string().describe("tThe name of the sheet to read"),
            headerRow: z.number().default(1).describe("tThe row number to use as field names (default: 1)"),
            dataStartRow: z.number().default(2).describe("The row number to start reading data from (default: 2)")
        },
        async (params: {
            fileAbsolutePath: string,
            sheetName: string,
            headerRow: number,
            dataStartRow: number
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
                                error: `File not exist: ${params.fileAbsolutePath}`,
                                suggestion: "Please verify the file path and name"
                            })
                        }]
                    };

                }
                if (!params.sheetName) {
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify({
                                error: `Invalid sheet name: ${params.sheetName}`,
                                suggestion: "Please verify the sheet name"
                            })
                        }]
                    };

                }
                const result = await readDataBySheetName(normalizedPath, params.sheetName, params.headerRow, params.dataStartRow);
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
                            error: `Failed to read data from sheet: ${params.sheetName} failure: ${error}`,
                            suggestion: "Please verify all parameters"
                        })
                    }]
                };
            }

        }
    );
    server.tool("readSheetData", 'Read data from all sheets in the Excel file',
        {
            fileAbsolutePath: z.string().describe("The absolute path of the Excel file"),
            headerRow: z.number().default(1).describe("The row number to use as field names (default: 1)"),
            dataStartRow: z.number().default(2).describe("The row number to start reading data from (default: 2)")
        },
        async (params: { fileAbsolutePath: string, headerRow: number, dataStartRow: number }) => {
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

                const result = await readAllSheetData(
                    normalizedPath,
                    params.headerRow,
                    params.dataStartRow
                );

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
                            error: `Failed to read Excel data: ${error}`,
                            suggestion: "Please verify all parameters"
                        })
                    }]
                };
            }
        }
    );
}

