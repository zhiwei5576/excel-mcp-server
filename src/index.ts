import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import packageJson from '../package.json' with { type: "json" };
import { structureTools } from "./tools/structureTools.js";
import { writeTools } from "./tools/writeTools.js";
import { readTools } from "./tools/readTools.js";
import { cacheTools } from "./tools/cacheTools.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeLogger } from "./handlers/logHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an MCP server
const server = new McpServer({
  name: "excel-mcp-server",
  version: packageJson.version
});

// 初始化日志清理器，直接使用 __dirname（dist 目录）
initializeLogger(__dirname);

// 注册工具
structureTools(server);
readTools(server);
writeTools(server);
cacheTools(server);   


// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);