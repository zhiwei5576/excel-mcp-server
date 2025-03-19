import { z } from "zod";
import { fileExists, normalizePath } from "../utils/utils.js";
import { workbookCache } from "../utils/workbookCache.js";
export const cacheTools = (server: any) => {
    server.tool("clearFileCache", 'Clear cached data for the specified Excel file',
        {
            fileAbsolutePath: z.string().describe("The absolute path of the Excel file to clear from cache")
        },
        async (params: { fileAbsolutePath: string }) => {
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

                const deleted = workbookCache.delete(normalizedPath);

                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: deleted
                                ? `Cache cleared successfully for file: ${normalizedPath}`
                                : `No cache found for file: ${normalizedPath}`
                        })
                    }]
                };

            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: `Failed to clear cache: ${error}`,
                            suggestion: "Please verify the file path"
                        })
                    }]
                };
            }
        }
    );

}

