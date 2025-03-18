
import * as fs from 'fs'
import * as XLSX from 'xlsx'
import { workbookCache } from './workbookCache.js'
import { logToFile } from './utils.js';
import type { ReadSheetNamesResult } from '../types/index.js';

// Increase the timeout duration (5 minutes)
const READ_TIMEOUT = 300000;
export async function readAndCacheFile(filePathWithName: string): Promise<ReadSheetNamesResult> {
    try {
        const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('File reading timeout')), READ_TIMEOUT);
        });

        const readOperation = new Promise<ReadSheetNamesResult>(async (resolve, reject) => {
            try {
                // Read file in chunks
                const fileStream = fs.createReadStream(filePathWithName, {
                    highWaterMark: 1024 * 1024 // 1MB chunks
                });

                const chunks: Buffer[] = [];

                fileStream.on('data', (chunk: string | Buffer) => {
                    if (Buffer.isBuffer(chunk)) {
                        chunks.push(chunk);
                    } else {
                        chunks.push(Buffer.from(chunk));
                    }
                });

                fileStream.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    const workbook = XLSX.read(buffer, {
                        type: 'buffer',
                        cellDates: true,
                        cellNF: false,
                        cellText: false,
                    });
                    workbookCache.set(filePathWithName, workbook);
                    resolve({
                        success: true,
                        data: {
                            SheetNames: workbook.SheetNames,
                            errors: ''
                        }
                    });
                });

                fileStream.on('error', (error) => {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });

        const result = await Promise.race([readOperation, timeout]);
        return result as ReadSheetNamesResult;

    } catch (bufferError) {
        await logToFile(`[read-and-cache-file] Buffer read failure: ${bufferError}`);
        return {
            success: false,
            data: {
                SheetNames: [],
                errors: JSON.stringify(bufferError)
            }
        };
    }
}