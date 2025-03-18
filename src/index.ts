import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { analyzeTools } from "./tools/analyzeTools.js";
import { writeTools } from "./tools/writeTools.js";
import { readTools } from "./tools/readTools.js";
import { commTools } from "./tools/commTools.js";
import { LogCleaner } from "./utils/logCleaner.js";
import path from 'path';
// Create an MCP server
const server = new McpServer({
  name: "excel-mcp-server",
  version: "0.0.1"
});
// 初始化日志清理器
const logDir = path.join(__dirname, '../logs');
const logCleaner = new LogCleaner(logDir, 7); // 保留7天的日志
logCleaner.start(24); // 每24小时清理一次
// 注册工具
analyzeTools(server);
readTools(server);
writeTools(server);
commTools(server);


// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);