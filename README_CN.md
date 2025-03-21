# Excel MCP Server

[![npm](https://img.shields.io/npm/v/@zhiweixu/excel-mcp-server)](https://www.npmjs.com/package/@zhiweixu/excel-mcp-server)
[![smithery badge](https://smithery.ai/badge/@zhiweixu/excel-mcp-server)](https://smithery.ai/server/@zhiweixu/excel-mcp-server)
[English](./readme.md) | 简体中文

基于模型上下文协议（MCP）的 Excel 文件处理服务器，提供 Excel 文件的读写、分析等功能。

## 功能特点

- 📖 读取 Excel 文件

  - 获取工作表列表
  - 读取指定工作表数据
  - 读取所有工作表数据

- ✍️ 写入 Excel 文件

  - 创建新的 Excel 文件
  - 写入指定工作表
  - 支持多工作表操作

- 🔍 分析 Excel 结构

  - 分析工作表结构
  - 导出结构到新文件

- 💾 缓存管理

  - 自动文件内容缓存
  - 定时缓存清理
  - 手动缓存清除

- 📝 日志管理
  - 自动操作日志记录
  - 定期日志清理

## 安装

### 通过 Smithery 安装

通过 [Smithery](https://smithery.ai/server/@zhiweixu/excel-mcp-server) 自动安装 excel-mcp-server 到 Claude Desktop：

```bash
npx -y @smithery/cli install @zhiweixu/excel-mcp-server --client claude
```
### 本地安装
通过 NPM 安装
excel-mcp-server 可以通过在 MCP 服务器配置中添加以下配置来自动安装。

Windows 平台:

```bash
{
  "mcpServers": {
    "excel": {
        "command": "cmd",
        "args": ["/c", "npx", "--yes", "@zhiweixu/excel-mcp-server"],
        "env": {
            "LOG_PATH": “[设置可访问的绝对路径]”
        }
    }
}
```

其它平台:

```bash
{
  "mcpServers": {
    "excel": {
        "command": "npx",
        "args": ["--yes", "@zhiweixu/excel-mcp-server"],
        "env": {
            "LOG_PATH": “[设置可访问的绝对路径]”
        }
    }
}
```
注意：LOG_PATH可以不设置，默认在应用程序根目录下的logs文件夹下

## API 工具

### 结构分析

- analyzeExcelStructure

  - 功能：获取 Excel 文件结构，包含工作表列表和列标题，以 JSON 格式返回
  - 参数：
    - fileAbsolutePath: Excel 文件的绝对路径
    - headerRows: 标题行数（默认：1）

- exportExcelStructure

  - 功能：将 Excel 文件结构（工作表和标题）导出为新的 Excel 模板文件
  - 参数：
    - sourceFilePath: 源 Excel 文件路径
    - targetFilePath: 目标 Excel 文件路径
    - headerRows: 标题行数（默认：1）

### 读取操作

- readSheetNames

  - 功能：获取 Excel 文件中的所有工作表名称
  - 参数：
    - fileAbsolutePath: Excel 文件的绝对路径

- readDataBySheetName

  - 功能：获取 Excel 文件中指定工作表的数据
  - 参数：
    - fileAbsolutePath: Excel 文件的绝对路径
    - sheetName: 要读取的工作表名称
    - headerRow: 标题行号（默认：1）
    - dataStartRow: 数据起始行号（默认：2）

- readSheetData

  - 功能：获取 Excel 文件中所有工作表的数据
  - 参数：
    - fileAbsolutePath: Excel 文件的绝对路径
    - headerRow: 标题行号（默认：1）
    - dataStartRow: 数据起始行号（默认：2）

### 写入操作

- writeDataBySheetName

  - 功能：将数据写入 Excel 文件的指定工作表（如果工作表已存在则覆盖）
  - 参数：
    - fileAbsolutePath: Excel 文件的绝对路径
    - sheetName: 要写入的工作表名称
    - data: 要写入的数据数组

- writeSheetData

  - 功能：使用提供的数据创建新的 Excel 文件
  - 参数：
    - fileAbsolutePath: 新 Excel 文件的绝对路径
    - data: 包含多个工作表数据的对象

### 缓存管理

- clearFileCache
  - 功能：清除指定 Excel 文件的缓存数据
  - 参数：
    - fileAbsolutePath: 要清除缓存的 Excel 文件绝对路径

## 配置说明

- 缓存配置

  - 缓存过期时间：1 小时
  - 缓存清理间隔：4 小时

- 日志配置

  - 日志保留天数：7 天
  - 清理间隔：24 小时

## 依赖项

- @modelcontextprotocol/sdk: ^1.7.0
- xlsx: ^0.18.5
- typescript: ^5.8.2

## 开发依赖

- @types/node: ^22.13.10
- nodemon: ^3.1.9
- ts-node: ^10.9.2

## 许可证

本项目采用 MIT 许可证。这意味着您可以：

- 将软件用于商业或非商业用途
- 修改源代码
- 分发原始或修改后的代码
  要求：

- 保留原始版权声明
- 对软件使用不承担任何责任
  详细许可信息请查看 [LICENSE](./LICENSE) 文件。
