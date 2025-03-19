import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function formatDate(date: Date): string {
    return date.toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

export async function logToFile(message: string) {
    try {
        const logDir = path.join(__dirname, '../logs');
        const date = new Date();
        const fileName = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.log`;
        const logPath = path.join(logDir, fileName);

        await fs.mkdir(logDir, { recursive: true });
        await fs.appendFile(logPath, `${formatDate(date)} - ${message}\n`);
    } catch (error) {
        console.error('log to file failure:', error);
    }
}
export async function normalizePath(filePathWithName: string): Promise<string> {
    try {
        // 对路径进行编码处理
        const encodedPath = encodeURIComponent(filePathWithName)
            .replace(/%2F/g, '/') // 保留路径分隔符
            .replace(/%20/g, ' '); // 保留空格

        // 解码路径，确保中文字符正确显示
        const decodedPath = decodeURIComponent(encodedPath);

        return decodedPath.trim();
        // return normalizedPath;
    } catch (error) {
        await logToFile(`normalize path failure: ${error}`);
        return 'error';
    }
}

//confirm file is exist
export async function fileExists(filePathWithName: string): Promise<boolean> {
    try {
        const fs = await import('fs');
        if (!filePathWithName) {
            await logToFile("path is null");
            return false;
        }
        // 尝试规范化路径
        const fileExists = fs.existsSync(filePathWithName);
        if (!fileExists) {
            await logToFile(`file is not exist: ${fileExists}`);
            return false;
        }
        return true;
    } catch (error) {
        await logToFile(`file is not exist: ${error}`);
        return false;
    }
}